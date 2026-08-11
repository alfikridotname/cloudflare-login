DELETE FROM sessions;

CREATE UNIQUE INDEX IF NOT EXISTS
idx_sessions_user_id
ON sessions(user_id);