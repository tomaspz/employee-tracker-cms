const mysql = require("mysql");
const consoleTable = require('console.table');
const inquirer = require ('inquirer'); 

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "guardoinfo",
  database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showTable();
  });

///////////////// FUNCTIONS ////////////////////////////

function showTable(){
    connection.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role_id AS role, manager_id AS manager 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id
        GROUP BY employee.id`,  
    function(err, res) {
        if (err) throw err;
        console.table(res);
        inquireWhatToDo();
    })
}

function inquireWhatToDo(){
    inquirer.prompt ([
    {
      type: "list", 
      message: "What would you like to do?",
      name: "wwyltd",
      choices: [
      "View All Employees", 
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee", 
      "Remove Employee", 
      "Update Employee Role", 
      "Update Employee Manager",
      "Exit"
    ]
    }
  ])
  .then (function(res){
    switch (res.start){    
      case "View all Employees":    viewAllEmployees(); break; 
      case "View all Employees By Department":    viewAllEmployeesByDepartment(); break;
      case "View all Employees By Manager":    viewAllEmployeesByManager(); break;
      case "Add Employee":          addEmployee(); break;
      case "Remove Employee":       removeEmployee(); break;
      case "Update Employee Role":  updateEmployeeRole(); break;
      case "Update Employee Manager":  updateEmployeeManager(); break;   
      case "Exit":  connection.end(); break; 
    }
  })
}

function viewAllEmployees(){

}

function viewAllEmployeesByDepartment(){

}

function viewAllEmployeesByManager(){

}

function addEmployee(){

}

function removeEmployee(){

}

function updateEmployeeRole(){

}

function updateEmployeeManager(){

}