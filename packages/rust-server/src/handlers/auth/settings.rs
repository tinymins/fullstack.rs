use std::sync::Arc;

use axum::extract::State;
use axum::http::{header, HeaderMap};
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

use crate::db::entities::system_settings;
use crate::db::repos::auth_repo::AuthRepo;
use crate::error::ApiResponse;
use crate::AppState;

use super::parse_session_cookie;

pub async fn logout(State(state): State<Arc<AppState>>, headers: HeaderMap) -> Response {
    let session_id = parse_session_cookie(&headers);
    if let Some(sid) = session_id {
        let _ = AuthRepo::delete_session(&state.db, &sid).await;
    }

    let clear_cookie =
        "SESSION_ID=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    let body = Json(ApiResponse {
        success: true,
        data: Some(serde_json::json!({ "success": true })),
        error: None,
    });
    let mut resp = body.into_response();
    resp.headers_mut()
        .insert(header::SET_COOKIE, clear_cookie.parse().unwrap());
    resp
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemSettingsOutput {
    pub allow_registration: bool,
    pub single_workspace_mode: bool,
}

pub async fn system_settings(State(state): State<Arc<AppState>>) -> Response {
    use sea_orm::EntityTrait;

    let row = system_settings::Entity::find()
        .one(&state.db)
        .await
        .ok()
        .flatten();

    let output = match row {
        Some(s) => SystemSettingsOutput {
            allow_registration: s.allow_registration,
            single_workspace_mode: s.single_workspace_mode,
        },
        // Default: allow registration, no single workspace mode
        None => SystemSettingsOutput {
            allow_registration: true,
            single_workspace_mode: false,
        },
    };

    Json(ApiResponse {
        success: true,
        data: Some(output),
        error: None,
    })
    .into_response()
}
