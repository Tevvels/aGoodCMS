DROP DATABASE IF EXISTS cmsDB; 
CREATE database cmsDB;
USE cmsDB;
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    names VARCHAR(30)
);
CREATE TABLE roles(
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT
);
CREATE TABLE employee(
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL
);
SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;