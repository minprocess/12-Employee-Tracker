DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id)
);

CREATE TABLE employee(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

INSERT INTO department (name) VALUES 
    ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id) VALUES 
    ("Sales Lead" ,100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2),
    ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("John", "Doe", 1, null),
("Mike", "Chan", 2, null),
("Ashley", "Rodriguez", 3, null),
("Kevin", "Tupik", 4, null),
("Malia", "Brown", 5, null),
("Sarah", "Lourd", 6, null),
("Tom", "Allen", 7, null),
("Christian", "Echenrode", 3, null),
("Donald", "Duck", 3, 2),
("Mickey", "Mouse", 2, 1);
