use std::sync::Arc;

use axum::extract::State;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Deserialize;

use crate::db::entities::users::UserRole;
use crate::db::repos::auth_repo::AuthRepo;
use crate::db::repos::workspace_repo::WorkspaceRepo;
use crate::error::AppError;
use crate::services::auth::hash_password;
use crate::AppState;

use super::login::{build_session_response, AuthOutput, UserDto};

#[derive(Deserialize)]
pub struct RegisterInput {
    pub email: String,
    pub password: String,
}

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(body): Json<RegisterInput>,
) -> Response {
    // Check if email is already taken
    match AuthRepo::find_user_by_email(&state.db, &body.email).await {
        Ok(Some(_)) => return AppError::Conflict("该邮箱已被注册".into()).into_response(),
        Err(e) => return e.into_response(),
        Ok(None) => {}
    }

    let password_hash = match hash_password(&body.password) {
        Ok(h) => h,
        Err(e) => return AppError::Internal(e).into_response(),
    };

    // First user becomes superadmin, subsequent users are regular users
    let user_count = match AuthRepo::count_users(&state.db).await {
        Ok(n) => n,
        Err(e) => return e.into_response(),
    };
    let role = if user_count == 0 {
        UserRole::Superadmin
    } else {
        UserRole::User
    };

    // Derive a display name from the email prefix
    let name = body
        .email
        .split('@')
        .next()
        .unwrap_or("User")
        .to_string();

    let user = match AuthRepo::create_user(&state.db, &name, &body.email, &password_hash, role)
        .await
    {
        Ok(u) => u,
        Err(e) => return e.into_response(),
    };

    let user_id_str = user.id.clone();

    // Create session
    let session_id = match AuthRepo::create_session(&state.db, &user.id).await {
        Ok(s) => s,
        Err(e) => return e.into_response(),
    };

    // Create default workspace
    let slug = format!("ws-{}", &user_id_str[..8]);
    let workspace = match WorkspaceRepo::create_with_owner(
        &state.db,
        &format!("{}'s workspace", name),
        &slug,
        &user_id_str,
    )
    .await
    {
        Ok(ws) => ws,
        Err(e) => return e.into_response(),
    };

    let output = AuthOutput {
        user: UserDto::from(user),
        default_workspace_slug: workspace.slug,
    };

    build_session_response(output, &session_id)
}
