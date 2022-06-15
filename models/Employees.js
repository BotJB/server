const mongoose =require('mongoose')
const Schema = mongoose.Schema;

const EmployeeSchema= new Schema(
    {
        firstname:String,
        lastname:String,
        age:Number,
        dateofjoin:Date,
        title:String,
        department:String,
        employeetype:String,
        curentstatus:{
            type:Number,
            default:1
        },
    }
);

const Employee =mongoose.model('Employee', EmployeeSchema,"employees");
module.exports=Employee;