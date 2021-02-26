const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user: 'root',
    password: "Flargin2",
    database: 'cmsDB'
});



function Employment(){
    inquirer.prompt([
        {
            type:'list',
            message: 'which table we working on?',
            choices:['department','roles','employee','done'],
            name:'choice'
        }
    ]).then((response)=>{
        console.log(response.choice);
        switch(response.choice){
            case'department':
            departmentChoices();
            
            break;
            case'roles':
           roleChoices();
            break;
            case'employee':
            employeeChoices();
            break;
            case'done':
            connection.end();
            break;

        }

    })
}



function departmentChoices(){
    inquirer.prompt([
        {
            type:'list',
            message:"would you like do",
            choices: ['view the departments','add a department',"delete a department","go back"],
            name:"departmentChoice"
        }
    ]).then((response)=>{
        console.log(response.departmentChoice);
        switch(response.departmentChoice){
            case'view the departments':
            read("department");
            break;
            case'add a department':
            addDepartment();
            break;
            case'delete a department':
            deleteDepartment();
            break;
            case'go back':
            Employment();
            break;

        }

    })
}


function addDepartment(){
    inquirer.prompt([
        {
            message:'what is the department name?',
            name:'choice'
        }
    ]).then((response)=>{
        console.log(response.choice);
        create('department',response.choice)

    })
}


const deleteDepartment = () =>{
    connection.query(`SELECT * FROM department`,(err,data)=>{
        if(err) throw err;
        deparray = [];
        data.forEach(id => {
            deparray.push(id.names);
        });
        console.log(deparray);

    
        inquirer.prompt([
            {
                type:'rawlist',
                message:'which department do you wanna delete?',
                choices:deparray,
                name:'departmentDeletion'


            }

        ]).then((response)=>{
            console.log(response);
            delet('department',response.departmentDeletion)
            Employment();
        })
    })
}

function roleChoices(){
    inquirer.prompt([
        {
            type:'list',
            message:"would you like do",
            choices: ['view the roles','add a role',"delete a role","go back"],
            name:"roleChoice"
        }
    ]).then((response)=>{
        console.log(response.roleChoice);
        switch(response.roleChoice){
            case'view the roles':
            read("roles");
            break;
            case'add a role':
            addRole();
            break;
            case'delete a role':
            deleteRole();
            break;
            case'go back':
            Employment();
            break;

        }

    })
}



function addRole(){
    connection.query('SELECT * FROM department',(err,data)=>{
        if(err) throw err;
        depid = data.map(({name,id})=>({
            name:name,
            value:id
        }))
    inquirer.prompt([
        {
            message:'what role would you like to add?',
            name:'title'
        },
        {
            message:'how much is the salary?',
            name:'salary'
        },
        {
            type:'rawlist',
            message:'which department is the role assigned to?',
            choices:depid,
            name:'departmentID'


        }
  
        ]).then((response)=>{
            console.log(response.title);
            create('roles',response.title,response.salary,parseInt(response.departmentID))

        })
    })
}

function deleteRole(){
    connection.query(`SELECT * FROM roles`,(err,data)=>{
        if(err) throw err;
        rolearray = []
        data.forEach(id => {
            rolearray.push(id.title);
        })
        console.log(rolearray);
    inquirer.prompt([
        {
            type:'rawlist',
            message:'which role do you wanna delete?',
            choices:rolearray,
            name:'roledeletion'
        }
    ]).then((response)=>{
        console.log(response);
        delet('roles',response.roledeletion);
        Employment();
    })
})

}

function employeeChoices(){
    inquirer.prompt([
        {
            type:'list',
            message:'would you like do',
            choices: ['view employees','add an employee','update employee role','remove an employee','go back'],
            name:'employeeChoices'
        }
    
    ]).then((response) =>{
        switch(response.employeeChoices){
            case'view employees':
            read('employee');
            break;
            case'add an employee':
            addEmployee()
            break;
            case'update employee role':
            updateEmployee()
            break;
            case'remove an employee':
            deleteEmployee();
            break;
            case'go back':
            Employment();
            break;
        }
    })
}

function addEmployee(){
    connection.query(`SELECT * FROM roles`,(err,data)=>{
        if(err) throw err;
        empid = data.map(({id,title})=>({
            name:title,
            value:id
        }))
        inquirer.prompt([
            {
                message:"what is the employee's first name",
                name:'firstname'
            },
            {
                message:"what is the employee's last name",
                name:'lastname'
            },
            {
                type:'rawlist',
                message:"what role are they in",
                choices:empid,
                name:'role'
            },
            {
                message:"who is there manager",
                name:'manager'
            }
         ]).then((response)=>{
             create('employee',response.firstname,response.lastname,parseInt(response.role),response.manager)
         })
    })
}

function updateEmployee(){
connection.query(`SELECT * FROM employee`,(err,data)=>{
    if(err) throw err;
    employees = data.map(({first_name})=>({
        name:first_name,
       

    }))
    inquirer.prompt([
        {
            type:'rawlist',
            message:'which employee',
            choices:employees,
            name:'newrole'
        }
    ]).then((response) =>{
        who = response.newrole
    

    inquirer.prompt([
        {
            message:'a new role',
            name:'role'
        }

        ]).then((response)=>{
            update('employee',response.role,who);
        })
    })
    })
}

function deleteEmployee(){
    connection.query(`SELECT * FROM employee`,(err,data)=>{
        if(err) throw err;
        emparray = []
        data.forEach(id => {
            emparray.push(id.first_name)
        })
        console.log(emparray);
        inquirer.prompt([
            {
                type:'rawlist',
                message:'which employee do you wanna remove',
                choices:emparray,
                name:'employeedeletion'
            }
        ]).then((response)=>{
            console.log(response);
            delet('employee',response.employeedeletion);
            Employment();
        })
    })
}

const create = (where,...what) =>{
   
    var whats = []
    switch(where){
        case 'department':
        whats = {names:what};
        break;
        case 'roles':
        whats = {title:what[0],
                salary:what[1],
                department_id:what[2],

        };
        break;
        case 'employee':
        whats = {first_name:what[0],
                last_name:what[1],
                role_id:what[2],
                manager_id:what[3]

        };
        break;
    }



    const query = connection.query(`INSERT INTO ${where} SET ?`,
    whats,(err,data)=>{
        if (err) throw err;
        console.log("Create");
        Employment();
    })

}

const read = (where) =>{
    connection.query(`SELECT * FROM  ${where}`, (err,data)=>{
        if (err) throw err;
        console.log('read')
        console.log(data);
        Employment()
        // connection.end();
    })
}

const update = (table,what,where) => {
    const query = connection.query(`UPDATE ${table} SET ? WHERE ?`,
        [
            {
                role_id: `${what}`

            },
            {
                first_name: `${where}`
            
            }
        ],
        (err,data)=>{
            if(err) throw err;
            console.log("update")
            Employment();
        }
    );
    
}

const delet = (where,data) =>{
    if(where){
        if(where == 'department')
        {
            deletewhat =  
            {
            names: `${data}`
         }
        }
        else if(where == 'roles')
        {
            deletewhat = {
                title:`${data}`
            }

        }
        else if(where == 'employee')
        {
            
            deletewhat = {
                first_name:`${data}`
            }

        }
    }
    connection.query(
        `DELETE FROM ${where}  WHERE ?`,deletewhat
,
        (err,data) =>{
            if(err) throw err,
            console.log('delete')
        console.log(where,deletewhat)

        }

    )
}

connection.connect((err)=>{
    if(err) throw err;
    Employment();
    console.log(`connected as id ${connection.threadId}\n`)
});