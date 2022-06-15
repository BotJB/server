
//to make connection to the database
const mongoose= require('mongoose')
mongoose.connect('mongodb+srv://hvinayak:hvinayak@cluster0.ioevs.mongodb.net/?retryWrites=true&w=majority');
mongoose.connection.on("connected", function(){
    console.log("Application is connected to the database");
})
