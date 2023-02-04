
//to make connection to the database
const mongoose= require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("connected", function(){
    console.log("Application is connected to the database");
})
