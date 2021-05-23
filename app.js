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

// Only for testing purposes
const readDepartment = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};


const queryNamesOfEmployees = () => {

  var fullNames = [];
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
  connection.query( query, (err, res) => {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
    res.forEach(function(item){
      fullNames.push(item)
    });
  });
}


const queryAllEmployees = () => {
  let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ';
  query += 'FROM employee ';
  query += 'JOIN role ON employee.role_id=role.role_id ';
  query += 'JOIN department ON role.department_id=department.department_id ';
  connection.query( query, (err, res) => {
      if (err) throw err;

      var values = [];
      res.forEach(({ id, first_name, last_name, title, name, salary, manager }) => {
          let val = [id, first_name, last_name, title, name, salary, manager];
          values.push(val);
      });
      console.table(['ID', 'First name', 'Last name', 'Title', 'Department', 'Salary', 'Manager' ], values)
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
      type: 'list',
      message: 'What is department?',
      name: 'department',
      choices: ["Sales", "Engineering", "Finance", "Legal"]
  }
];

const deleteEmployee = () => {
  // Which employee do you want to remove
  // Create array of emplyees
  // Get first and last name we can use to create a list for
  var fullNames = [];
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
  connection.query( query, (err, res) => {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
    res.forEach(function(item){
      fullNames.push(item.full_name)
      console.log(fullName.length);
    });
  });
  console.log("fullNames")
  console.log(fullNames);
  const delEmplQuestions = [
    {
      type: 'list',
      message: 'What is name of employee to be deleted?',
      name: 'employee',
      choices: fullNames
    }];
  //console.log("begin")
  //console.log(delEmplQuestions.choices);
  console.log('end')
  inquirer
    .prompt(delEmplQuestions)
    .then((answer) => {
      console.log("inquirer answer")
      console.log(answer)
      /*
      connection.query(
        `DELETE FROM employee WHERE first_name = ${first} AND last_name = ${last}`,

        (err) => {
          if (err) throw err;
          console.log('Your employee was inserted into employee table successfully!');
        }
      );  // end of query insert into employee
      */
    });
}

// User wants to add employee to Employee table
// Has two inquirer prompts?
// After last .then MainMenu is called (recursively!)
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
          mainMenus();
        });
    });
}

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
          deleteEmployee();
          connection.end();
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

mainMenus();


/*
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //readDepartment();
  queryAllEmployees();
});
*/

