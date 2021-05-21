const mysql = require('mysql');
const cTable = require('console.table');

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
  let query = 'SELECT employee.first_name, employee.last_name, role.title, department.name, role.salary ';
  query += 'FROM employee ';
  query += 'JOIN role ON employee.role_id=role.role_id ';
  query += 'JOIN department ON role.department_id=department.department_id ';
  connection.query( query, (err, res) => {
      if (err) throw err;
      var values = [];
      console.log("res")
      console.log(res)
      /*
      res.forEach(({ first_name, last_name, role_id }) => {
        //values.push(`${id},${first_name},${last_name},${title},${department},${salary}`);
        console.log(`${first_name} | ${last_name} | ${role_id}`);
      });
      */
      //console.table(['id', 'first name', 'last name', ''])
  });
}
/*
var values = [
  ['max', 20],
  ['joe', 30]
];
console.table(['name', 'age'], values);
*/

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  readDepartment();
  //queryAllEmployees();
});

