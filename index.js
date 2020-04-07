const mysql = require("mysql");
require('console.table');
const inquirer = require ('inquirer'); 
const logo = require('asciiart-logo');
const config = require('./package.json');

const whatToDoQuestion = {
    type: "list", 
    message: "What would you like to do?",
    name: "question1",
    pageSize: 13,
    choices: [
        "View All Employees", 
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Add Role",
        "Add Department", 
        "Delete Employee", 
        "Delete Role",
        "Delete Department",
        "Update Employee Role", 
        "Update Employee Manager",
        "View Total Department Budget",
        "Exit"
    ]
}

const addEmployeeQuestions = [
    {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
    },
    {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
    },
    {
        type: "list",
        name: "role_id",
        message: "What is the employee role id?",
        choices: [1,2,3,4,5,6,7,8,9,10]
    },
    {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager id?",
        choices: [0,1,2,3,4,5,6,7,8,9,10]
    }
];

const addRoleQuestions = [
    {
        type: "input", 
        name: "title",
        message: "What is the role title to add?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for that role?"
      },
      {
        type: "list",
        name: "department_id",
        message: "what is the department id?",
        choices: [1,2,3,4,5]
      }

];

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
            case "View All Employees":    viewAllEmployees(); break; 
            case "View All Employees By Department":    viewAllEmployeesByDepartment(); break;
            case "View All Employees By Manager":    viewAllEmployeesByManager(); break;
            case "Add Employee":          addEmployee(); break;
            case "Add Role":          addRole(); break;
            case "Add Department":          addDepartment(); break;
            case "Delete Employee":       deleteEmployee(); break;
            case "Delete Role":       deleteRole(); break;
            case "Delete Department":       deleteDepartment(); break;
            case "Update Employee Role":  updateEmployeeRole(); break;
            case "Update Employee Manager":  updateEmployeeManager(); break; 
            case "View Total Department Budget": viewTotalDeptBudget(); break;  
            case "Exit":  connection.end(); break; 
        }
    } catch (error) {
        console.log("Error when inquiring questions: " + error);
    }
}; // end inquireWhatToDo

async function viewAllEmployees(){
    try {
        var queryAllEmployees =  `SELECT employee.first_name, employee.last_name 
                                FROM employee`;
        await connection.query(queryAllEmployees, function(err, res) {
            console.table(res);
            inquireWhatToDo();
        });  
    } catch (error) {
        console.log("Error when viewing all employees: " + error);
    }
}  // end viewAllEmployees

async function viewAllEmployeesByDepartment(){
    try {
        var queryEmplByDept =  `SELECT department.name, employee.first_name, employee.last_name
                                FROM  employee
                                INNER JOIN role ON employee.role_id = role.id
                                INNER JOIN department ON role.department_id = department.id
                                ORDER BY employee.id`;
        await connection.query(queryEmplByDept, function(err, res) {
            console.table(res);
            inquireWhatToDo();
        });  
        
    } catch (error) {
        console.log("Error when viewing all employees by department: " + error);
    }
}

async function viewAllEmployeesByManager(){
    try {
        var queryEmplByManager =  `SELECT employee.manager_id, employee.first_name, employee.last_name
                                FROM  employee
                                ORDER BY employee.manager_id`;
        await connection.query(queryEmplByManager, function(err, res) {
            console.table(res);
            inquireWhatToDo();
        });  
        
    } catch (error) {
        console.log("Error when viewing all employees by manager: " + error);
    }

}

async function addEmployee(){
    try {
        console.log("Inserting a new employee .... \n")
        const answer = await inquirer.prompt(addEmployeeQuestions);
        await connection.query(
            "INSERT INTO employee SET ?", answer, function(err, res) {
              if (err) throw err;
              console.log(res);
              console.log( "The employee has been successfully added!");
              inquireWhatToDo(); 
            }
        );    
    } catch (error) {
        console.log("Error when adding an employee: " + error);
    }
}

async function addRole(){
    try {
        console.log("Adding a new role .... \n");
        const answer = await inquirer.prompt(addRoleQuestions);
        await connection.query(
            "INSERT INTO role SET ?", answer, function(err, res) {
              if (err) throw err;
              console.log( "The role has been successfully added!");
              inquireWhatToDo(); 
            }
          );    
    } catch (error) {
        console.log("Error when adding a role: " + error);
    }

}

async function addDepartment(){
    try {
        console.log("Adding a department .... \n");
        const answer = await inquirer.prompt(
            {
                type: "input",
                name: "name",
                message: "What is the department name you want to add?"
            }
        );
        console.log(answer);
        await connection.query(
            "INSERT INTO department SET ?", answer, function(err, res) {
              if (err) throw err;
              console.log( "The department has been successfully added!");
              inquireWhatToDo(); 
            }
          );    
    } catch (error) {
        console.log("Error when adding a role: " + error);
    }
}

async function deleteEmployee(){
    try {
        console.log("Deleting an employee .... \n")
        const answer = await inquirer.prompt(
            {
                type: "input",
                name: "id",
                message: "What is the id of the user you want to delete?"
            }
        );
        await connection.query(
            "DELETE FROM employee WHERE employee.id = ?", answer, function(err, res) {
              if (err) throw err;
              console.log( "The employee has been successfully deleted!");
              inquireWhatToDo(); 
            }
        );    
    } catch (error) {
        console.log("Error when deleting the employee: " + error);
    }

}

async function deleteRole(){
    try {
        console.log("Deleting role .... \n")
        const answer = await inquirer.prompt(
            {
                type: "input",
                name: "id",
                message: "What is the id of the role you want to delete?"
            }
        );
        await connection.query(
            "DELETE FROM role WHERE role.id = ?", answer, function(err, res) {
              if (err) throw err;
              console.log( "The role has been successfully deleted!");
              inquireWhatToDo(); 
            }
        );    
    } catch (error) {
        console.log("Error when deleting the role: " + error);
    }
}

async function deleteDepartment(){
    try {
        console.log("Deleting department .... \n")
        const answer = await inquirer.prompt(
            {
                type: "input",
                name: "id",
                message: "What is the department id you want to delete?"
            }
        );
        await connection.query(
            "DELETE FROM department WHERE department.id = ?", answer, function(err, res) {
              if (err) throw err;
              console.log( "The department has been successfully deleted!");
              inquireWhatToDo(); 
            }
        );    
    } catch (error) {
        console.log("Error when deleting the department: " + error);
    }
}

async function updateEmployeeRole(){
    try {
        console.log("Updating the employee role .... \n")
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "What is the employee id, who's role you want to update?"
            },
            {
                type: "input",
                name: "role_id",
                message: "What is the new role id?"
            }
        ]);
        await connection.query(
            "UPDATE employee SET role_id=? WHERE employee.id=?", [answer.role_id, answer.id], function(err, res) {
              if (err) throw err;
              console.log( "Employee role successfully updated!");
              inquireWhatToDo(); 
            }
        );    
    } catch (error) {
        console.log("Error when updating the employee role: " + error);
    }
}

async function updateEmployeeManager(){
    try {
        console.log("Updating the employee manager .... \n")
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "What is the employee id, who's manager you want to update?"
            },
            {
                type: "input",
                name: "manager_id",
                message: "What is the new manager id to assign to the employee?"
            }
        ]);
        await connection.query(
            "UPDATE employee SET manager_id=? WHERE employee.id=?", [answer.manager_id, answer.id], function(err, res) {
              if (err) throw err;
              console.log( "Employee manager successfully updated!");
              inquireWhatToDo(); 
            }
        );    
    } catch (error) {
        console.log("Error when updating the employee manager: " + error);
    }
}

async function viewTotalDeptBudget(){
    try {
        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "name",
                message: "What is the department name you want to view the budget?",
                choices: ["Engineering", "Human Resources", "Finance", "Management", "Sales"]
            }
        ]);
        switch(answer.name) {
            case "Engineering": querySalaryDepartment(1, "Engineering"); break;                                   
            case "Human Resources": querySalaryDepartment(2, "Human Resources"); break;  
            case "Finance": querySalaryDepartment(3, "Finance"); break;
            case "Management": querySalaryDepartment(4, "Management"); break;
            case "Sales": querySalaryDepartment(3, "Sales"); break;
        }
         
    } catch (error) {
        console.log("Error when updating the employee manager: " + error);
    }
}

async function querySalaryDepartment(id, departmentName){
    try {
        const queryDepartment = `SELECT role.salary FROM role WHERE role.department_id = ${id}`;
        await connection.query(queryDepartment, function(err, data){
            if(err) throw err;
            let sum = 0;
            for(let i=0; i<data.length; i++){
                sum += data[i].salary;
            }
        console.log(`\n The total budget for the ${departmentName} department is $${sum}/year \n`);
        inquireWhatToDo();
        });     
    } catch (error) {
        console.log("Error when querying the department's budget: " + error);
    }
    
}