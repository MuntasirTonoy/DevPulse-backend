-- ============================================================
-- DevPulse Database Schema Migration
-- Version: 001
-- Description: Initial schema with users and issues tables
-- ============================================================

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20)  NOT NULL DEFAULT 'contributor'
                CONSTRAINT users_role_check CHECK (role IN ('contributor', 'maintainer')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ISSUES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS issues (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(150) NOT NULL,
  description  TEXT         NOT NULL,
  type         VARCHAR(20)  NOT NULL
                 CONSTRAINT issues_type_check CHECK (type IN ('bug', 'feature_request')),
  status       VARCHAR(20)  NOT NULL DEFAULT 'open'
                 CONSTRAINT issues_status_check CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id  INTEGER      NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
