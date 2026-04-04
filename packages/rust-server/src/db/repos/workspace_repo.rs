use chrono::Utc;
use sea_orm::*;
use uuid::Uuid;

use crate::db::entities::workspace_members::WorkspaceMemberRole;
use crate::db::entities::{workspace_members, workspaces};
use crate::error::AppError;

pub struct WorkspaceRepo;

impl WorkspaceRepo {
    pub async fn list_by_user(
        db: &DatabaseConnection,
        user_id: &str,
    ) -> Result<Vec<workspaces::Model>, AppError> {
        let member_rows = workspace_members::Entity::find()
            .filter(workspace_members::Column::UserId.eq(user_id))
            .all(db)
            .await?;

        let workspace_ids: Vec<String> =
            member_rows.iter().map(|m| m.workspace_id.clone()).collect();
        if workspace_ids.is_empty() {
            return Ok(vec![]);
        }

        Ok(workspaces::Entity::find()
            .filter(workspaces::Column::Id.is_in(workspace_ids))
            .all(db)
            .await?)
    }

    /// Create workspace and add owner as member
    pub async fn create_with_owner(
        db: &DatabaseConnection,
        name: &str,
        slug: &str,
        user_id: &str,
    ) -> Result<workspaces::Model, AppError> {
        let ws_id = Uuid::new_v4().to_string();

        let ws = workspaces::ActiveModel {
            id: Set(ws_id.clone()),
            slug: Set(slug.to_string()),
            name: Set(name.to_string()),
            description: Set(None),
            created_at: Set(Some(Utc::now().into())),
        };
        workspaces::Entity::insert(ws).exec(db).await?;

        let member = workspace_members::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            workspace_id: Set(ws_id.clone()),
            user_id: Set(user_id.to_string()),
            role: Set(WorkspaceMemberRole::Owner),
            created_at: Set(Some(Utc::now().into())),
        };
        workspace_members::Entity::insert(member).exec(db).await?;

        workspaces::Entity::find_by_id(ws_id)
            .one(db)
            .await?
            .ok_or_else(|| AppError::Internal("failed to fetch created workspace".into()))
    }

    pub async fn get_first_by_user(
        db: &DatabaseConnection,
        user_id: &str,
    ) -> Result<Option<workspaces::Model>, AppError> {
        let member = workspace_members::Entity::find()
            .filter(workspace_members::Column::UserId.eq(user_id))
            .one(db)
            .await?;

        match member {
            Some(m) => Ok(workspaces::Entity::find_by_id(m.workspace_id).one(db).await?),
            None => Ok(None),
        }
    }
}
