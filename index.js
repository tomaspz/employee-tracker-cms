const mysql = require("mysql");
require('console.table');
const inquirer = require ('inquirer'); 
const logo = require('asciiart-logo');
const config = require('./package.json');

const whatToDoQuestion = {
    type: "list", 
    message: "What would you like to do?",
    name: "question1",
    pageSize: 8,
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
    console.log(logo(config).render());
    showTable();
  });

/////////////////////// FUNCTIONS ////////////////////////////

function showTable(){
    connection.query(`
        SELECT employee.id AS ID, employee.first_name AS FIRST_NAME, employee.last_name AS LAST_NAME, role.title AS ROLE, role.salary AS SALARY, employee.manager_id AS MANAGER, department.name AS DEPARTMENT
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        ORDER BY employee.id`,  
        (error, data) => {
            if (error) throw error;
            console.table(data);
            inquireWhatToDo();
        }
    )
}

async function inquireWhatToDo(){

    try {
        const answer = await inquirer.prompt (whatToDoQuestion);    
        switch (answer.question1){    
            case "View all Employees":    viewAllEmployees(); break; 
            case "View all Employees By Department":    viewAllEmployeesByDepartment(); break;
            case "View all Employees By Manager":    viewAllEmployeesByManager(); break;
            case "Add Employee":          addEmployee(); break;
            case "Remove Employee":       removeEmployee(); break;
            case "Update Employee Role":  updateEmployeeRole(); break;
            case "Update Employee Manager":  updateEmployeeManager(); break;   
            case "Exit":  connection.end(); break; 
        }
    } catch (error) {
        console.log("Error inside inquireWhatToDo");
    }
}; // end inquireWhatToDo

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