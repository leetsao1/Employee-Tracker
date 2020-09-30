DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- TABLE ONE
CREATE TABLE departments(
    id INTEGER (10) AUTO_INCREMENT,
    name VARCHAR (30),
    PRIMARY KEY (id)
);

-- TABLE TWO
CREATE TABLE role(
    id INTEGER (10) AUTO_INCREMENT,
    title VARCHAR (30),
    salary DECIMAL (10,2),
    department_id INTEGER (10),
    PRIMARY KEY (id)
);

-- TABLE THREE
CREATE TABLE employee(
    id INTEGER (10) AUTO_INCREMENT,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INTEGER (10),
    manager_id INTEGER (10) NULL,
    PRIMARY KEY (id)
);

INSERT INTO departments(name)
VALUES ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Process Engineer", 125000, 1122);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Lee", "Tsao", 10, 5);