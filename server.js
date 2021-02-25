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
            //function for roles
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
    }  )
}



const create = (where,what) =>{

    const query = connection.query(`INSERT INTO ${where} SET ?`,{
        names:what,

    },(err,data)=>{
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
    connection.query(
        `DELETE FROM ${where}  WHERE ?`,
        {
           names:`${data}`
        },
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