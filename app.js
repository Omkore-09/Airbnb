const express= require("express");
const app= express();
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/wandurlust"

main().then( ()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log("Error connecting to DB", err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req , res)=>{
    res.send("Hello omkar");
})

app.listen(8080 ,()=>{
    console.log("server is listening on port 8080");
});