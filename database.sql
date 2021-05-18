-- create users table
CREATE TABLE users(
  id SERIAL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  resetPasswordToken TEXT DEFAULT '',
  resetPasswordExpiresIn DATE,
  role INTEGER DEFAULT 0
);



