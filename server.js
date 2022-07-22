const express=require('express')
const { ApolloServer, UserInputError } = require('apollo-server-express');
const dateScalar=require('./graphqlDate')
require('./models/db')
const fs = require('fs');
const Employee = require('./models/Employees');
let aboutMessage = "Welcome to GraphQL";

const resolvers = {
    Date: dateScalar,
    Query: {
        about: () => aboutMessage,
        employeeDirectory:async(parent,args,context,info)=>{
            console.log(args.employeetype)
            if(args.employeetype){
                const employee=await Employee.find({employeetype:args.employeetype})
                return employee;
            }
            else{
                      const employee=await Employee.find();
    return employee
            }
      
    
        }
    },
    Mutation: {
        employeeCreate:async(parent,args,context,info)=>{
         console.log(args.employee)
            const {title,firstname,lastname,age,dateofjoin,department,employeetype,currentstatus}=args.employee;
            const employee=new Employee({title,firstname,lastname,age,dateofjoin,department,employeetype});
           await employee.save();
            return employee;
        },
        SingleEmployee,
        updateEmployee
        
    }
};
async function SingleEmployee(parent,args,context,info){
    console.log(args)
    const SingleEmployee=await Employee.findById(args)
    return SingleEmployee;
}

//function to update the employee
async function updateEmployee(parent,args,context,info){
    console.log(args)

}


function validate(employee) {
    console.log(employee)
    const errors = [];
    if (employee.firstname.length < 3) {
        errors.push('Field "firstname" must be at least 3 characters long.')
    }
    if (employee.lastname.length < 3) {
        errors.push('Field "lastname" must be at least 3 characters long.')
    }
    console.log(errors.length)
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
}

function setAboutMessage(_, {message}){
    return aboutMessage = message;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema_graphql', 'utf8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
     },
});

const app = express();
app.use(express.static('public'));

server.start().then(() => {
    server.applyMiddleware({
        app,
        path:'/graphql',
        cors: true,
    });
})

app.listen(5000, function(){
    console.log('App started at 5000');
})