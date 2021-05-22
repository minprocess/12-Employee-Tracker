const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'Dog20cat',
  database: 'employee_db',
});

const readDepartment = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};

const queryAllEmployees = () => {
  let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary ';
  query += 'FROM employee ';
  query += 'JOIN role ON employee.role_id=role.role_id ';
  query += 'JOIN department ON role.department_id=department.department_id ';
  connection.query( query, (err, res) => {
      if (err) throw err;
      var values = [];
      
      res.forEach(({ id, first_name, last_name, title, name, salary }) => {
          let val = [id, first_name, last_name, title, name, salary];
          values.push(val)
      });
      console.table(['id', 'first name', 'last name', 'title', 'department', 'salary'], values)
  });
}

// Create an array of questions for user input
const addEmpQuestions = [
  {
      type: 'input',
      message: 'What is first name?',
      name: 'firstname',
  },
  {
      type: 'input',
      message: 'What is last name?',
      name: 'lastname',
  },
  {
      type: 'choices',
      message: 'What is department?',
      name: 'department',
      choices: ["Sales", "Engineering", "Finance", "Legal"]
  }
];


const addEmployee = () => {
  inquirer
    .prompt(addEmpQuestions)
    .then((answer) => {
      var department_id;
      var role_id;
      switch (answer.department) {
        case 'Sales':
          choicesPos = ["Sales Lead", "Salesperson"];
          department_id = 1;
          break;

        case 'Engineering':
          choicesPos = ["Lead Engineer", "Software Engineer"];
          department_id = 2;
          break;

        case 'Finance':
          choicesPos = ["Accountant"];
          department_id = 3;
          break;

        case 'Legal':
          choicesPos = ["Legal Team Lead", "Lawyer"];
          department_id = 4;
          break;

        default:
          console.log(`Invalid action answer.department: ${answer.department}`);
          break;
      }
      let posQuestions = [
        {
          type: 'choices',
          message: 'What is position',
          name: 'position',
          choices: choicesPos
        }
      ];

      inquirer
        .prompt(posQuestions)
        .then((answer2) => {
          switch (answer2.position) {
            case 'Sales Lead':
              role_id = 1;
              salary = 100000;
              break;

            case 'Salesperson':
              role_id = 2;
              salary = 80000;
              break;
      
            case 'Lead Engineer':
              role_id = 3;
              salary = 150000;
              break;

            case 'Software Engineer':
              role_id = 4;
              salary = 120000;
              break;
      
            case 'Finance':
              role_id = 5;
              salary = 125000;
              break;
    
            case 'Legal Team Lead':
              role_id = 6;
              salary = 250000;
              break;
    
            case 'Lawyer':
              role_id = 7;
              salary = 190000;
              break;
      
            default:
              console.log(`Invalid action answer2.position: ${answer2.position}`);
              break;
          }

          // when finished prompting, insert a new item into employee table that info
          connection.query(
            'INSERT INTO employee SET ?',
            {
              first_name: answer.firstname,
              last_name: answer.lastname,
              role_id: role_id,
              manager_id: null
            },
            (err) => {
              if (err) throw err;
              console.log('Your employee was inserted into employee table successfully!');
            }
          );  // end of query insert into employee
        });
    });
}

/*
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO auctions SET ?',
        // QUESTION: What does the || 0 do?
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0,
        },
        (err) => {
          if (err) throw err;
          console.log('Your auction was created successfully!');
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
*/


const mainMenus = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Remove Employee',
        'Exit'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          queryAllEmployees();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Remove Employee':
          RemoveEmployee();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};





connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //readDepartment();
  queryAllEmployees();
});

