-- Portable schema: runs on MySQL 8 and SQLite.
CREATE TABLE IF NOT EXISTS job_postings (
  posting_id      VARCHAR(10) PRIMARY KEY,
  employer        VARCHAR(120),
  title           VARCHAR(120),
  category        VARCHAR(60),
  neighborhood    VARCHAR(60),
  zip             VARCHAR(10),
  lat             DECIMAL(9,5),
  lon             DECIMAL(9,5),
  hours_per_week  INT,
  wage_per_hour   DECIMAL(6,2),
  health_insurance VARCHAR(5),
  shift           VARCHAR(20),
  remote          VARCHAR(5),
  near_bus_line   VARCHAR(5),
  description     TEXT,
  posted_date     DATE,
  synthetic       VARCHAR(5)
);
