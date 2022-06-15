const express=require('express')
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql');
require('./models/db')
const Employee = require('./models/Employees');
let aboutMessage = "Welcome to GraphQL";
const initialemployee = [
    {firstname:"heena",lastname:"vinayak",age:28,dateofjoin:new Date('25-08-2021'),title:"Director",department:"IT",employeetype:"Full Time",curentstatus:1}
];



const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value.toISOString(); // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
        //return new Date(value);
        const dateValue = new Date(value);
        return isNaN(dateValue) ? undefined : dateValue;
    },
    parseLiteral(ast) { 
        if (ast.kind == Kind.INT) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
            //return new Date(parseInt(ast.value, 10));
        } else if(ast.kind == Kind.STRING) {
            const value = new Date(ast.value);
            return isNaN(value) ? undefined : value;
            //return new Date(ast.value)
        }
        return null;
    }
})

const typeDefs =`
scalar Date 

enum titleType {
    Employee
    Manager 
    Director
    VP
}

enum departmentType {
    IT 
    Marketing
    HR
    Engineering
}

enum employeetypeType {
    FullTime
    PartTime
    Contract
    Seasonal
}

input EmployeeInputs {
    title:String
    firstname:String!
    lastname:String!
    age:Int!
    dateofjoin:Date!
    department:String
    employeetype:String
    curentstatus:Int
    
}


type Employee {
  
    firstname:String!
    lastname:String!
    age:Int!
    dateofjoin:Date!
    title:titleType!
    department:departmentType
    employeetype:employeetypeType!
    curentstatus:Int
},

type Query {
    about: String!,
    employeeDirectory: [Employee!]!
}
type Mutation {
    setAboutMessage(message: String!): String
    employeeCreate(employee: EmployeeInputs!): Employee!
}`;

const resolvers = {
    Date: dateScalar,
    Query: {
        about: () => aboutMessage,
        employeeDirectory:async()=>{
            const employee=await Employee.find();
    return employee
        }
    },
    Mutation: {
        setAboutMessage,
        employeeCreate:async(parent,args,context,info)=>{
         console.log(args.employee)
            const {title,firstname,lastname,age,dateofjoin,department,employeetype,currentstatus}=args.employee;
            const employee=new Employee({title,firstname,lastname,age,dateofjoin,department,employeetype});
           await employee.save();
            return employee;
        }
    }
};


 



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
    typeDefs,
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

app.listen(4000, function(){
    console.log('App started at 4000');
})