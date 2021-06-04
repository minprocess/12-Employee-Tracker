

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

const addDepartment = () => {

  const newDeptQuestion = [
    {
      type: 'input',
      message: 'What is name of new department?',
      name: 'new_dept',
    },
  ];

  inquirer
    .prompt(newDeptQuestion)
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.new_dept }, (err) => {
        if (err) throw err;
        console.log(`The new department ${answer.new_dept} was inserted into department table successfully!`);
        setTimeout(function() { mainMenu(); }, 1000);
        return;
      });  // end of query insert into department
  }); // end of .then((answer))
} // End of addDepartment

const removeDepartment = () => {
  var deptNames = [];
  connection.query( 'SELECT * FROM department', (err, res) => {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object

    res.forEach(function(item) {
      deptNames.push(item.name);
    });
    deptNames.push("Cancel");

    const delDeptQuestions = [
      {
        type: 'list',
        message: 'Choose department to be removed',
        name: 'dept',
        pageSize: 15,
        choices: deptNames
      }
    ];

    inquirer
      .prompt(delDeptQuestions)
      .then((answer) => {
        if (answer.dept == "Cancel") {
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        }
        let query = `DELETE FROM department WHERE ${answer.dept} = department.name`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(`The department ${answer.dept} was deleted from the department table successfully!`);
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        });
      });   // End of .then
  });   // End of first connection.query
} // End of removeDepartment

const viewAllDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;

    var values = [];
    res.forEach(({ id, name }) => {
        let val = [id, name];
        values.push(val);
    });
    console.table(['ID', 'Department' ], values);
    setTimeout(function() { mainMenu(); }, 1000);
    return;
  });
} // End of viewAllDepartments


/*
CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id)
);
*/

const viewAllRoles = () => {
  let query = 'SELECT role.role_id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id=department.department_id'
  connection.query(query, (err, res) => {
    if (err) throw err;

    var values = [];
    res.forEach(({ role_id, title, salary, name }) => {
        let val = [role_id, title, salary, name];
        values.push(val);
    });

    console.table(['ID', 'Role', 'Salary', 'Department' ], values);
    setTimeout(function() { mainMenu(); }, 1000);
    return;

  });
}

const addNewRole = () => {
  // 1. What is name of new role
  const newRoleQuestion = [
    {
      type: 'input',
      message: 'What is name of new role?',
      name: 'new_role',
    },
    {
      type: 'number',
      message: 'What is salary?',
      name: 'new_salary'
    }
  ];
  inquirer
    .prompt(newRoleQuestion)
    .then((answer) => {
      var newRole = answer.new_role;
      var newSalary = answer.new_salary

      connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;

        var deptChoices = [];
        var deptIds = [];
        res.forEach(function(item) {
          deptIds.push(item.department_id);
          deptChoices.push(item.name);
        });
        deptChoices.push("Cancel");

        const whatDeptQuestions = [
          {
            type: 'list',
            message: 'Choose department that the new role is in',
            name: 'department',
            pageSize: 15,
            choices: deptChoices
        }];
        inquirer
          .prompt(whatDeptQuestions)
          .then((answer2) => {

            if (answer2.department == "Cancel") {
              setTimeout(function() { mainMenu(); }, 1000);
              return;
            }
            // when finished prompting, insert a new item into role table with that info
            var dept_id = 0;
            var i;
            for (i=0; i<deptChoices.length; i++) {
              if (answer2.department == deptChoices[i]) {
                dept_id = deptIds[i];
                break;
              }
            }
            connection.query('INSERT INTO role SET ?',
                {
                  title: newRole,
                  salary: newSalary,
                  department_id: dept_id
                }, (err) => {
              if (err) throw err;
              console.log(`The new role ${newRole} was inserted into the role table successfully!`);
              setTimeout(function() { mainMenu(); }, 1000);
              return;
            });  // end of query insert into employee
          }); // End of .then
      });
    });
} // End of addNewRole()

const removeRole = () => {
  var roleTitles = [];
  connection.query( 'SELECT * FROM role', (err, res) => {
    if (err) throw err;

    res.forEach(function(item) {
      roleTitles.push(item.title);
    });
    deptNames.push("Cancel");

    const delRoleQuestions = [
      {
        type: 'list',
        message: 'Choose role to be removed',
        name: 'role',
        pageSize: 15,
        choices: roleTitles
      }
    ];

    inquirer
      .prompt(delRoleQuestions)
      .then((answer) => {
        if (answer.role == "Cancel") {
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        }
        let query = `DELETE FROM role WHERE ${answer.role} = role.title`;
        connection.query(query, function (err, res) {
          if (err) throw err;
          console.log(`The role ${answer.role} was deleted from the role table successfully!`);
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        });
      });   // End of .then
  });   // End of first connection.query
} // End of removeRoll


// To change role of employee
// 1. Ask user to select the employee to change
// 2. Ask user what is new role of employee.
// 3. Change role_id in employee table
// After last .then MainMenu is called (recursively!)

const updateRole = () => {
  // STEP 1. Select employee
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name, id FROM employee";
  connection.query( query, async function (err, res) {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
    var fullNames = [];
    res.forEach(function(item) {
      fullNames.push(item.full_name);
    });
    fullNames.push("Cancel");
    const employeeNameQuestions = [
      {
        type: 'list',
        message: 'Choose name of employee with new role',
        name: 'employee',
        pageSize: 15,
        choices: fullNames
      }];

    inquirer
      .prompt(employeeNameQuestions)
      .then((answer) => {

        if (answer.employee == "Cancel") {
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        }
        let theEmployee = answer.employee;

        var titles = [];
        var roleIds = [];
        connection.query( 'SELECT role_id, title FROM role ', (err, res) => {
          res.forEach(function(item){
            roleIds.push(item.role_id)
            titles.push(item.title);
          });
          titles.push("Cancel");

          let roleQuestions = [
            {
              type: 'list',
              message: 'Choose new role of employee',
              name: 'new_role',
              pageSize: 15,
              choices: titles
            }
          ];

          inquirer
            .prompt(roleQuestions)
            .then((answer2) => {
              if (answer2.new_role == "Cancel") {
                setTimeout(function() { mainMenu(); }, 1000);
                return;
              }

              let newRole = answer2.new_role;
              let new_role_id = 0;
              for (i=0; i<titles.length; i++) {
                if (answer2.new_role == titles[i]) {
                  new_role_id = roleIds[i];
                  break;
                }
              }   // end of for loop
              let substrings = theEmployee.split(' ');
              var sql = `UPDATE employee SET role_id = ${new_role_id} WHERE first_name = "${substrings[0]}" AND last_name = "${substrings[1]}"`;
              connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(`The new role ${newRole} of ${theEmployee} in employee table was performed successfully!`);
                setTimeout(function() { mainMenu(); }, 1000);
                return;
              });
            });   // end of .then
        })
      });
  });
}
  
// To change manager of employee
// 1. Ask user to select the employee to change
// 2. Ask user who is new manager of employee.
// 3. Change manager in employee table
// After last .then MainMenu is called (recursively!)
const updateManager = () => {
  // STEP 1. Select employee
  var fullNames = [];
  var employeeIds = [];
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name, id FROM employee";
  connection.query( query, async function (err, res) {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object
    await res.forEach(function(item) {
      fullNames.push(item.full_name);
      employeeIds.push(item.id);
    });
    let fullNames2 = fullNames;
    fullNames2.push("Cancel");
    const employeeNameQuestions = [
      {
        type: 'list',
        message: 'Choose name of employee with new manager?',
        name: 'employee',
        pageSize: 15,
        choices: fullNames2
      }
    ];

    inquirer
      .prompt(employeeNameQuestions)
      .then((answer) => {

        if (answer.employee == "Cancel") {
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        }
        let theEmployee = answer.employee;

        let managerChoices = fullNames;
        let managerIds = employeeIds;
        managerChoices.push("No manager");
        managerIds.push(null);
        managerChoices.push("Cancel");

        let managerQuestion = [
          {
            type: 'list',
            message: 'Choose new manager',
            name: 'manager',
            pageSize: 15,
            choices: managerChoices
          }
        ];
        var new_role_id = 0;
        inquirer
          .prompt(managerQuestion)
          .then((answer2) => {

            if (answer2.manager == "Cancel") {
              setTimeout(function() { mainMenu(); }, 1000);
              return;
            }

            // Find manager_id from answer
            var manager_id = null;
            if (answer2.manager != "No manager") {
              for (i=0; i<managerChoices.length; i++) {
                if (answer2.manager == managerChoices[i]) {
                  manager_id = managerIds[i];
                  break;
                }
              }  
            }
            else {
              setTimeout(function() { mainMenu(); }, 1000);
              return;
            }

            let substrings = theEmployee.split(' ');
            let sql = `UPDATE employee SET manager_id = ${manager_id} WHERE first_name = "${substrings[0]}" AND last_name = "${substrings[1]}"`;
            connection.query(sql, function (err, result) {
              if (err) throw err;
              console.log(`The new manager ${answer2.manager} of ${theEmployee} in employee table was performed successfully!`);
              setTimeout(function() { mainMenu(); }, 1000);
              return;
            });
          });   // end of .then
      })   // end of .then
  });
}

const removeEmployee = () => {
  var fullNames = [];
  //let query = 'SELECT employee.first_name, employee.last_name FROM employee ';
  let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM employee";
  connection.query( query, (err, res) => {
    if (err) throw err;
    // https://stackoverflow.com/questions/31221980/how-to-access-a-rowdatapacket-object

    res.forEach(function(item) {
      fullNames.push(item.full_name)
    });
    fullNames.push("Cancel");

    const delEmplQuestions = [
      {
        type: 'list',
        message: 'Choose employee to be removed',
        name: 'employee',
        pageSize: 15,
        choices: fullNames
      }
    ];

    inquirer
      .prompt(delEmplQuestions)
      .then((answer) => {
        if (answer.employee == "Cancel") {
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        }
        let str = answer.employee;
        let substrings = str.split(' ');
        let sql = `DELETE FROM employee WHERE first_name = "${substrings[0]}" AND last_name = "${substrings[1]}"`;
        connection.query(sql, function (err2, result2) {
          if (err2) throw err2;
          console.log(`The employee ${answer.employee} was removed from employee table successfully!`);
          setTimeout(function() { mainMenu(); }, 1000);
          return;
        });
      });   // End of .then
  });   // End of first connection.query
}   // End of removeEmployee

// Displays formatted table of employees
const viewAllEmployees = (orderBy) => {
  let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ';
  query += 'FROM employee ';
  query += 'JOIN role ON employee.role_id=role.role_id ';
  query += 'JOIN department ON role.department_id=department.department_id ';
  if (orderBy == 0) {
    query += 'ORDER by employee.id'
  }
  else if (orderBy == 1) {
    query += 'ORDER by department.department_id, employee.id'
  }
  else {
    query += 'ORDER by employee.manager_id, employee.id'
  }

  connection.query( query, (err, res) => {
      if (err) throw err;

      var values = [];
      res.forEach(({ id, first_name, last_name, title, name, salary, manager_id }) => {
          let val = [id, first_name, last_name, title, name, salary, manager_id];
          values.push(val);
      });

      var i, j;
      var nameFound;
      // Find manager name from manager_id
      for (i=0; i<values.length; i++)
      {
        nameFound = false;
        for (j=0; j<values.length; j++) {
          if (values[i][6] == values[j][0]) { // [6] is manager_id, [0] is employee_id
            values[i][6] = values[j][1] + ' ' + values[j][2]; // replace the id in [6] by a name
            nameFound = true;
            break;
          }
        }
        if (!nameFound) {
          values[i][6] = "---";
        }
      }
      console.table(['ID', 'First name', 'Last name', 'Title', 'Department', 'Salary', 'Manager' ], values);
      setTimeout(function() { mainMenu(); }, 1000);
      return;
  });
}

// User wants to add employee to Employee table
// Has two inquirer prompts?
// After last .then MainMenu is called (recursively!)
const addEmployee = () => {

  var roleChoices = [];
  var roleIds = [];
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach(function(item) {
      roleChoices.push(item.title);
      roleIds.push(item.role_id);
    });
    roleChoices.push("Cancel");

    var managerChoices = [];
    var managerIds = [];
    let query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name, id FROM employee";
    connection.query(query, (err, res) => {
      if (err) throw err;
      res.forEach(function(item) {
        managerChoices.push(item.full_name)
        managerIds.push(item.id)
      });
      managerChoices.push("No manager");
      managerIds.push(null);
      managerChoices.push("Cancel");
  
      // Create an array of questions for user input during add employee
      const addEmpQuestions = [
        {
          type: 'input',
          message: "Employee's first name?",
          name: 'firstname',
        },
        {
          type: 'input',
          message: "Employee's last name?",
          name: 'lastname',
        },
        {
          type: 'list',
          message: "Choose employee's role",
          name: 'role',
          pageSize: 15,
          choices: roleChoices,
        },
        {
          type: 'list',
          message: "Choose employee's manager",
          name: 'manager',
          pageSize: 15,
          choices: managerChoices,
        },
      ];
      inquirer
        .prompt(addEmpQuestions)
        .then((answer) => {

          if (answer.role == "Cancel") {
            setTimeout(function() { mainMenu(); }, 1000);
            return;
          }

          // Find role_id from title
          var role_id = null;
          var i;
          for (i=0; i<roleChoices.length; i++) {
            if (answer.role == roleChoices[i]) {
              role_id = roleIds[i];
              break;
            }
          }

          if (answer.manager == "Cancel") {
            setTimeout(function() { mainMenu(); }, 1000);
            return;
          }

          // Find manager_id from answer
          var manager_id = null;
          if (answer.manager != "No manager") {
            for (i=0; i<managerChoices.length; i++) {
              if (answer.manager == managerChoices[i]) {
                manager_id = managerIds[i];
                break;
              }
            }  
          }

          // when finished prompting, insert a new item into employee table that info
          connection.query('INSERT INTO employee SET ?',
              {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: role_id,
                manager_id: manager_id
              }, (err) => {
            if (err) throw err;
            console.log('Your employee was inserted into employee table successfully!');
            setTimeout(function() { mainMenu(); }, 1000);
            return;
          });  // end of query insert into employee

        }); // End of .then
    }); // End of query select from manager choices
  }); // End of query select from roles
}   // End of Add Employee

const mainMenu = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      pageSize: 13,
      choices: [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View All Roles',
        'Add New Role',
        'Remove Role',
        'View All Departments',
        'Add Department',
        'Remove Department',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmployees(0);
          break;

        case 'View All Employees by Department':
          viewAllEmployees(1);
          break;

        case 'View All Employees by Manager':
          viewAllEmployees(2);
          break;
    
        case 'Add Employee':
          addEmployee();
          break;

        case 'Remove Employee':
          removeEmployee();
          break;

        case 'Update Employee Role':
          updateRole();
          break;

        case 'Update Employee Manager':
          updateManager();
          break;
  
        case 'View All Roles':
          viewAllRoles();
          break;
    
        case 'Add New Role':
          addNewRole();
          break;
  
          // ToDo
        case 'Remove Role':
          removeRole();
          break;
  
        // ToDo
        case 'View All Departments':
          viewAllDepartments();
          break;
  
        // ToDo
        case 'Add Department':
          addDepartment();
          break;
  
        // ToDo
        case 'Remove Department':
          removeDepartment();
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
