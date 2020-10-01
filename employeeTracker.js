const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
const mysql = require ("mysql");
const { start } = require("repl");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Arrozconleche1+",
    database: "employee_trackerDB"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    startInquiry();
});

function startInquiry (){
    inquirer
    .prompt({
        name: "start",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View Data",
            "Add Data",
            "Update Record",
            "Delete Record",
            "Exit"
        ]
    })
    .then(function(response){
        switch(response.start) {
            case "View Data":
              viewSelection();         
              break;
            case "Add Data":
                addRecord();
              break;
            case "Update Record":
                console.log ("UPDATE Switch worked");
                break;
            case "Delete Record":
                deleteRecord();
                break;
            case "Exit":
                console.log ("Program ended, Good bye.");
                connection.end(); 
                break;
          }
    })
}

// == VIEW DATA MENU ==
function viewSelection(){
    inquirer
    .prompt({
        name: "view menu",
        type: "rawlist",
        message: "Make a selection?",
        choices: [
            "View all employee records",
            "Search records by manager",
            "Show Department Budget",
            "Exit"
        ]
    })
    .then(function(res){
        switch(res["view menu"]) {
            case "View all employee records":
            viewAll();         
              break;
            case "Search records by manager":
              searchByManager();  
              break;
            case "Show Department Budget":
              displayDepartmentBudget();  
              break;
            case "Exit":
              connection.end(); 
              break;
          }
    }).catch(function(error){
        console.log(error);
    });
};

function viewAll(){
    var query = connection.query("SELECT * FROM employee", function (err,res){
        if (err)throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Name: " +
                res[i].first_name +
                " || Last Name: " +
                res[i].last_name +
                " || Role: " +
                res[i].role_id +
                " || Manager: " +
                res[i].manager_id
            );
        };
        connection.end();
    });
};

function searchByManager(){
    inquirer
    .prompt({
        name: "manager-id",
        type: "input",
        message: "Enter a manager-id"
    })
    .then(function(res){
        var query = connection.query(
            "SELECT * FROM employee_trackerDB.employee WHERE manager_id = ?", 
            [res["manager-id"]],
            function (err,res){
                if (err)throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "Name: " +
                        res[i].first_name +
                        " || Last Name: " +
                        res[i].last_name +
                        " || Role: " +
                        res[i].role_id +
                        " || Manager: " +
                        res[i].manager_id
                    );
                }
                connection.end();
            }
        );
    }).catch(function(error){
        console.log(error);
    });

    // var query = connection.query(
    //     "SELECT * FROM employee_trackerDB.employee WHERE manager_id = ?", 
    //     ["2"],
    //     function (err,res){
    //         if (err)throw err;
    //         console.log(res);
    // });
};

function displayDepartmentBudget(){
    inquirer
    .prompt({
        name: "department",
        type: "input",
        message: "Enter department ID:"
    })
    .then(function(res){
        var query = connection.query(
            "SELECT SUM(salary) FROM employee_trackerDB.role JOIN employee_trackerDB.employee ON employee_trackerDB.role.department_id = employee_trackerDB.employee.role_id WHERE department_id = ?;" , 
            [res["department"]],
            function (err,res){
                if (err)throw err;
                console.log("The Department Budget is = $" + JSON.stringify(res[0]["SUM(salary)"] ) )
                connection.end();
            }
        );
    }).catch(function(error){
        console.log(error);
    });
};


//== ADD DATA MENU ==
function addRecord(){
    inquirer
    .prompt({
        name: "addRecord",
        type: "rawlist",
        message: "What type of new data would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee",
            "Go back to previous page"
        ]
    })
    .then(function(res){
        switch(res["addRecord"]) {
            case "Department":
              addDepartment();
              break;
            case "Role":
              addRole();
              break;
            case "Employee":
              addEmployee();
              break;
            case "Go back to previous page":
              startInquiry();
            //   connection.end(); 
              break;
          }
    }).catch(function(error){
        console.log(error);
    });
};

function addDepartment(){
    inquirer
    .prompt({
        name: "department",
        type: "input",
        message: "Enter new department name:"
    })
    .then(function(res){
        var query = "INSERT INTO departments (name) VALUES (?)";
        connection.query(query, [res["department"]], function(err, res) {
            console.log(`The new department was added to the list`);
            connection.end();
        });

    })
};

function addRole(){
    inquirer
    .prompt([
    {
        name: "title",
        type: "input",
        message: "Enter new department role title:"
    },
    {
        name: "salary",
        type: "input",
        message: "Enter Salary:"
    },
    {
        name: "department-id",
        type: "input",
        message: "Assign a department id:"
    }
    ])
    .then(function(res){
        var query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(query, [res["title"], res["salary"], res["department-id"]], function(err, res) {
            console.log(`The new role was added to the list`);
            connection.end();
        });
    });
};

function addEmployee(){
    inquirer
    .prompt([
    {
        name: "name",
        type: "input",
        message: "Enter new employee first name:"
    },
    {
        name: "lastName",
        type: "input",
        message: "Enter employee last name"
    },
    {
        name: "role-id",
        type: "input",
        message: "Assign a role ID:"
    },
    {
        name: "manager-id",
        type: "input",
        message: "Assign a manager ID:"
    }
    ])
    .then(function(res){
        var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)" ;
        connection.query(query, [res["name"], res["lastName"], res["role-id"], res["manager-id"]], function(err, res) {
            console.log(`The new employee was added to the list`);
            connection.end();
        });
    });
};

//== UPDATE QUERY ==


//== DELETE QUERY ==
function deleteRecord(){
    inquirer
    .prompt({
        name: "deleteRecord",
        type: "rawlist",
        message: "What type of data would you like to DELETE?",
        choices: [
            "Department",
            "Role",
            "Employee",
            "Go back to previous page"
        ]
    })
    .then(function(res){
        switch(res["deleteRecord"]) {
            case "Department":
              deleteDepartment();
              break;
            case "Role":
              deleteRole();
              break;
            case "Employee":
              deleteEmployee();
              break;
            case "Go back to previous page":
              startInquiry();
            //   connection.end(); 
              break;
          }
    }).catch(function(error){
        console.log(error);
    });
};

function deleteDepartment(){
    inquirer
    .prompt({
        name: "department",
        type: "input",
        message: "Enter department name:"
    })
    .then(function(res){
        var query = "DELETE FROM employee_trackerDB.departments WHERE name = ?";
        connection.query(query, [res["department"]], function(err, res) {
            console.log(`The new department was DELETED from the list`);
            connection.end();
        });
    })
};

function deleteRole(){
    inquirer
    .prompt(
    {
        name: "title",
        type: "input",
        message: "Enter new department role title to DELETE:"
    })
    .then(function(res){
        var query = "DELETE FROM employee_trackerDB.role WHERE title = ?";
        connection.query(query, res["title"], function(err, res) {
            console.log(`The new role was DELETED from the list`);
            connection.end();
        });
    });
};

function deleteEmployee(){
    inquirer
    .prompt([
    {
        name: "name",
        type: "input",
        message: "Enter new employee first name:"
    },
    {
        name: "lastName",
        type: "input",
        message: "Enter employee last name"
    }
    ])
    .then(function(res){
        var query = "DELETE FROM employee_trackerDB.employee WHERE first_name = ? AND last_name = ?" ;
        connection.query(query, [res["name"], res["lastName"]], function(err, res) {
            console.log(`The new employee was DELETED from the list`);
            connection.end();
        });
    });
};




    // 1)VIEW OPTION -DONE
    // 1.1) view all employees (If inquiry.view = view then ...) -DONE
        // Do a SELECT * FROM query -DONE
        // Send response back and store into an array of objects -DONE
        // console log the results as tables (FORMAT into table) -DONE
        // END connection -DONE
    // 1.2 (OPTIONAL) View employee by manager -DONE
        //Query all manager IDs and do a INQUIRY -DONE
        //select manager -DONE
        //SELECT from employee where manager_id = ? , [] , call back -DONE
    // 1.3 (OPTIONAL)View Total salary of a department -DONE
        //Query all departments from "department table" -DONE
        //JOIN 'department table-id' with 'role table-id' and FILTER by salary  -DONE
// 2)add (if inquiry.view = add then..) - done
    //continue inquiry asking what data wants to be added (Department, role or employee). This could just ask all values and create all 3 tables -DONE
    //Console log new inputs. Confirm and accept -DONE
    //END connection -DONE
// 3)update role or manager (if .view == update then..) -DONE
      //Query a view of all employee names and ID
      //ASK what type of data to update? ROLE or MANAGER?
        //IF ROLE
            //create an inquirer to select form options 
            //InquirY about new role information. Whats the new role? ect..card-body
            //Do an UPDATE FROM role WHERE ? , [], callback
            //console log success
            //END CONNECTION
        //IF MANAGER (OPTIONAL)
            //create an inquirer to ask for new manager ID
            //Do an UPDATE FROM role WHERE ? , [], callback
            //console log success
            //END CONNECTION

//4) (OPTIONAL) DELETE department role, department and employees -done

