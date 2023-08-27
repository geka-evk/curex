DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'curex-db') THEN
        CREATE DATABASE "curex-db";
    END IF;
END $$;

CREATE TABLE currency (
  id serial PRIMARY KEY,
  code character varying(3) UNIQUE NOT NULL,
  title character varying(50) NOT NULL
);

INSERT INTO currency (code, title) VALUES
  ('USD', 'United States Dollar'),
  ('EUR', 'Euro'),
  ('AUD', 'Australian Dollar'),
  ('UAH', 'Ukrainian Hryvnia'),
  ('CAD', 'Canadian Dollar');
