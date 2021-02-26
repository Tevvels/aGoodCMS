DROP DATABASE IF EXISTS cmsDB; 
CREATE database cmsDB;
USE cmsDB;
CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    names VARCHAR(30)
);
CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
   FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int,
    manager_id int NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN key (manager_id) REFERENCES employee(id)
);
SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;
