const mysql = require('mysql');
const inquirer = require('inquirer');
const { choices } = require('yargs');

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
            //function for employee
            break;
            case'done':
            //function for employee
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

const updata = () => {
    const query = connection.query("UPDATE   SET ? WHERE ?",
        [
            {
                //SET

            },
            {
                //WHERE
            
            }
        ],
        (err,data)=>{
            if(err) throw err;
            console.log("update")
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
    }
    connection.query(
        `DELETE FROM ${where}  WHERE ?`,deletewhat
,
        (err,data) =>{
            if(err) throw err,
            console.log('delete')
        }

    )
}

connection.connect((err)=>{
    if(err) throw err;
    Employment();
    console.log(`connected as id ${connection.threadId}\n`)
});