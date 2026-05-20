CREATE TABLE app_user (
  id varchar(36) PRIMARY KEY,
  full_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  role enum('ADMIN','EMPLOYEE') NOT NULL,
  department varchar(255),
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL
);

CREATE TABLE leave_type (
  id varchar(36) PRIMARY KEY,
  name varchar(255) NOT NULL UNIQUE,
  max_days_per_year int NOT NULL,
  created_at datetime(6) NOT NULL
);

CREATE TABLE leave_request (
  id varchar(36) PRIMARY KEY,
  employee_id varchar(36) NOT NULL,
  leave_type_id varchar(36) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days_count int NOT NULL,
  reason varchar(1000),
  status enum('PENDING','APPROVED','REJECTED') NOT NULL,
  reviewed_by varchar(36),
  review_comment varchar(1000),
  document_url varchar(1000),
  document_name varchar(255),
  document_content_type varchar(120),
  document_size_bytes bigint,
  created_at datetime(6) NOT NULL,
  updated_at datetime(6) NOT NULL,
  CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES app_user(id),
  CONSTRAINT fk_leave_type FOREIGN KEY (leave_type_id) REFERENCES leave_type(id),
  CONSTRAINT fk_leave_reviewer FOREIGN KEY (reviewed_by) REFERENCES app_user(id)
);

INSERT INTO leave_type (id, name, max_days_per_year, created_at) VALUES
(UUID(), 'Annual Leave', 21, NOW(6)),
(UUID(), 'Sick Leave', 10, NOW(6)),
(UUID(), 'Family Responsibility Leave', 3, NOW(6)),
(UUID(), 'Unpaid Leave', 30, NOW(6));
