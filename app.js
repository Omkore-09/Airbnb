const express= require("express");
const app= express();
const mongoose = require("mongoose");
// const Listing = require(".../Airbnb/models/listing.js");
const Listing = require('./models/listing');


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

app.get("/testListing" , async(req , res) =>{
    let sampleListing = new Listing({
        title : "My New Villa",
        description : "By the beach",
        price : 1200,
        location : "calangute , Goa",
        country : "India"
    });

    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Succesfull Testing");
});

app.listen(8080 ,()=>{
    console.log("server is listening on port 8080");
});