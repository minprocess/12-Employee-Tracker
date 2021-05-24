// addnewRole()
// changeRole() of employee
// deleteEmployee()
// viewAllEmployees()
// addEmployee()


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

const addNewRole = () => {
  // 1. What is name of new role
  const newRoleQuestion = [
    {
      type: 'input',
      message: 'What is name new role?',
      name: 'new_role',
    },
    {
      type: 'number',
      message: 'What is salary',
      name: 'new_salary'
    }
  ];
  inquirer
    .prompt(newRoleQuestion)
    .then((answer) => {
      var newRole = answer.new_role;
      var newSalary = answer.new_salary
      var deptChoices = [];
      connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        res.forEach(function(item){
          deptChoices.push(item.name)
        });    

        const whatDeptQuestions = [
          {
            type: 'list',
            message: 'What department is the new role in?',
            name: 'department',
            choices: deptChoices
        }];
        inquirer
          .prompt(whatDeptQuestions)
          .then((answer) => {
            // when finished prompting, insert a new item into role table with that info
            var dept_id = 0;
            var i;
            for (i=0; i<deptChoices.length; i++) {
              if (answer.department == deptChoices[i]) {
                dept_id = i+1;
              }
            }
            connection.query('INSERT INTO role SET ?',
              {
                title: new_role,
                salary: new_salary,
                department_id: dept_id;
              }, (err) => {
                if (err) throw err;
                console.log('The new role was inserted into role table successfully!');
                mainMenu();
              }
            );  // end of query insert into employee

          });
        //connection.end();
      });


    });
}


// To change role of employee
// 1. Ask user to select the employee to change
// 2. Ask user what is new role of employee.
// 3. Change role_id in employee table
// After last .then MainMenu is called (recursively!)
const changeRole = () => {
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
    const employeeNameQuestions = [
      {
        type: 'list',
        message: 'What is name of employee with new role?',
        name: 'employee',
        choices: fullNames
      }];
    var firstName;
    var lastName;
    inquirer
      .prompt(employeeNameQuestions)
      .then((answer) => {
        let str = answer.employee;
        let substrings = str.split(' ');
        firstName = substrings[0];
        lastName = substrings[1];
        var titles = [];
        connection.query( 'SELECT * FROM role ', (err, res) => {
          res.forEach(function(item){
            titles.push(item.title);
          });

          let roleQuestions = [
            {
              type: 'choices',
              message: 'What is new role of employee',
              name: 'new_role',
              choices: roles
            }
          ];
          var new_role_id = 0;
          inquirer
            .prompt(posQuestions)
            .then((answer) => {
              for (i=0; i<titles.length; i++) {
                if (answer.new_role == titles[i]) {
                  new_role_id = i+1;
                }
              }   // end of for loop
              var sql = `UPDATE employee SET role_id = ${role_id} WHERE first_name = ${firstName} AND last_name = ${lastName}`;
              con.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                mainMenu();
              });
            });   // end of .then
        })
      });
  });
}

const deleteEmployee = () => {
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
const viewAllEmployees = () => {
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




// User wants to add employee to Employee table
// Has two inquirer prompts?
// After last .then MainMenu is called (recursively!)
const addEmployee = () => {
  var roleChoices = [];
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
      res.forEach(function(item) {
      roleChoices.push(item.name)
    });

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
          message: 'What is role?',
          name: 'role',
          choices: roleChoices
      }
    ];
  inquirer
    .prompt(addEmpQuestions)
    .then((answer) => {
      var firstName = answer.firstname;
      var lastName = answer.lastname;
      var title = answer.role;
      // Find role_id from title
      var role_id = 0;
      for (i=0; i<roleChoices.length; i++) {
        if (title == roleChoices[i]) {
          role_id = i+1;
        }
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
        'Add New Role',
        'Exit'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmployees();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Delete Employee':
          deleteEmployee();
          break;

        case 'Change Role of Employee':
          changeRole;
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

