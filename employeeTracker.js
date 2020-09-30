const inquirer = require("inquirer");
const Choice = require("inquirer/lib/objects/choice");
const mysql = require ("mysql");

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
              console.log ("VIEW Switch worked");
              viewSelection();         
              break;
            case "Add Data":
             console.log ("ADD Switch worked");
              break;
            case "Update Record":
                console.log ("UPDATE Switch worked");
                break;
            case "Delete Record":
                console.log ("DELETE Switch worked");
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
        message: "What next?",
        choices: [
            "View all records",
            "Search records by manager",
            "Exit"
        ]
    })
    .then(function(res){
        switch(res["view menu"]) {
            case "View all records":
            viewAll();         
              break;
            case "Search records by manager":
              searchByManager();  
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

//== ADD DATA MENU ==


//Start inquirer questionnaire asking 
//
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
    // 1.3 (OPTIONAL)View Total salary of a department
        //Query all departments from "department table"
        //JOIN 'department table-id' with 'role table-id' and FILTER by salary 
// 2)add (if inquiry.view = add then..) - done
    //continue inquiry asking what data wants to be added (Department, role or employee). This could just ask all values and create all 3 tables
    //Console log new inputs. Confirm and accept 
    //END connection
// 3)update role or manager (if .view == update then..) -done
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

