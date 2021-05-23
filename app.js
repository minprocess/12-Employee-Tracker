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


// Create an array of questions for user input during add employee
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

// To change role of employee
// 1. Ask user to select the employee to change
// 2. Ask user what is the department of new role
// 3. Ask user what is title in the department.
// 4. Change role_id in employee table
// Has three inquirer prompts
// After last .then MainMenu is called (recursively!)
const addEmployee = () => {
  // STEP 1. Select employee
  var fullNames = [];
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
  connection.query( query, (err, res) => {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
    res.forEach(function(item){
      fullNames.push(item.full_name)
    });
    const delEmplQuestions = [
      {
        type: 'list',
        message: 'What is name of employee with new role?',
        name: 'employee',
        choices: fullNames
      }];
    var firstName;
    var lastName;
    inquirer
      .prompt(delEmplQuestions)
      .then((answer) => {
        let str = answer.employee;
        let substrings = str.split(' ');
        firstName = substrings[0];
        lastName = substrings[1];

        const whatDeptQuestions = [
          {
            type: 'list',
            message: 'What is department?',
            name: 'department',
            choices: ["Sales", "Engineering", "Finance", "Legal"]
        }];
        inquirer
        .prompt(whatDeptQuestions)
        .then((answer) => {
          var role_id;
          switch (answer.department) {
            case 'Sales':
              choicesPos = ["Sales Lead", "Salesperson"];
              break;
            case 'Engineering':
              choicesPos = ["Lead Engineer", "Software Engineer"];
              break;
            case 'Finance':
              choicesPos = ["Accountant"];
              break;
            case 'Legal':
              choicesPos = ["Legal Team Lead", "Lawyer"];
              break;
            default:
              console.log(`Invalid action answer.department: ${answer.department}`);
              break;
          }
          let posQuestions = [
            {
              type: 'choices',
              message: 'What is new position',
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
                  break;
                case 'Salesperson':
                  role_id = 2;
                  break;
                case 'Lead Engineer':
                  role_id = 3;
                  break;
                case 'Software Engineer':
                  role_id = 4;
                  break;
                case 'Finance':
                  role_id = 5;
                  break;
                case 'Legal Team Lead':
                  role_id = 6;
                  break;
                case 'Lawyer':
                  role_id = 7;
                  break;
                default:
                  console.log(`Invalid action answer2.position: ${answer2.position}`);
                  break;
              }
              var sql = `UPDATE employee SET role_id = ${role_id} WHERE first_name = ${firstName} AND last_name = ${lastName}`;
              con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                mainMenu();
              });
            }); 
          });
        });   // End of .then
  });   // End of first connection.query
}

const DeleteEmployee = () => {
  var fullNames = [];
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
  connection.query( query, (err, res) => {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
    res.forEach(function(item){
      fullNames.push(item.full_name)
    });

    const delEmplQuestions = [
      {
        type: 'list',
        message: 'What is name of employee to be deleted?',
        name: 'employee',
        choices: fullNames
      }];

    var firstName;
    var lastName;
    inquirer
      .prompt(delEmplQuestions)
      .then((answer) => {
        let str = answer.employee;
        let substrings = str.split(' ');
        firstName = substrings[0];
        lastName = substrings[1];
        let query2 = `DELETE FROM employee WHERE first_name = "${firstName}" AND last_name = "${lastName}"`;
        connection.query(query2, function (err2, result2) {
          if (err2) throw err2;
          // After we delete an employee show the table
          //queryAllEmployees()
          mainMenu();
        });
      });   // End of .then
  });   // End of first connection.query
}   // End of DeleteEmployee

// Displays formatted table of employees
const queryAllEmployees = () => {
  let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ';
  query += 'FROM employee ';
  query += 'JOIN role ON employee.role_id=role.role_id ';
  query += 'JOIN department ON role.department_id=department.department_id ';
  query += 'ORDER by id'
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


// Create an array of questions for user input during add employee
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
          break;
        case 'Engineering':
          choicesPos = ["Lead Engineer", "Software Engineer"];
          break;
        case 'Finance':
          choicesPos = ["Accountant"];
          break;
        case 'Legal':
          choicesPos = ["Legal Team Lead", "Lawyer"];
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
              break;
            case 'Salesperson':
              role_id = 2;
              break;
            case 'Lead Engineer':
              role_id = 3;
              break;
            case 'Software Engineer':
              role_id = 4;
              break;
            case 'Finance':
              role_id = 5;
              break;
            case 'Legal Team Lead':
              role_id = 6;
              break;
            case 'Lawyer':
              role_id = 7;
              break;
            default:
              console.log(`Invalid action answer2.position: ${answer2.position}`);
              break;
          }

          // when finished prompting, insert a new item into employee table that info
          connection.query('INSERT INTO employee SET ?',
            {
              first_name: answer.firstname,
              last_name: answer.lastname,
              role_id: role_id,
              manager_id: null
            }, (err) => {
              if (err) throw err;
              console.log('Your employee was inserted into employee table successfully!');
              mainMenu();
            }
          );  // end of query insert into employee

        });
    });
}   // End of Add Employee

const mainMenu = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Delete Employee',
        'Change Role of Employee',
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

        case 'Delete Employee':
          DeleteEmployee();
          break;

          case 'Change Role of Employee':
            ChangeRoleOfEmployee();
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

mainMenu();


/*
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //readDepartment();
  queryAllEmployees();
});
*/

