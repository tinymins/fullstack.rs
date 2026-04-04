pub mod build_info;
pub mod error;
pub mod logging;
pub mod middleware;
pub mod router;

use sea_orm::DatabaseConnection;

/// 共享应用状态。
pub struct AppState {
    pub db: DatabaseConnection,
}

pub use router::build_app;
