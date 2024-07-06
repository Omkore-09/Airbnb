const express= require("express");
const app= express();
const mongoose = require("mongoose");
// const Listing = require(".../Airbnb/models/listing.js");
const Listing = require('./models/listing');
const path = require("path");
const methodOverride = require("method-override");


const MONGO_URL = "mongodb://127.0.0.1:27017/wandurlust"

main().then( ()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log("Error connecting to DB", err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


app.get("/", (req , res)=>{
    res.send("Hello omkar");
})

//index route
app.get("/listings" , async(req , res)=>{
    const allListings= await Listing.find({}) ;
    res.render("listings/index.ejs" , {allListings})
});

//new route
app.get("/listings/new", (req , res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})
});


//Create route
app.post("/listings" , async(req , res)=>{
    // let{title , description , image , price , location , country}=req.body ;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    // console.log(listing);
    res.redirect("/listings");
})

//Edit route
app.get("/listings/:id/edit", async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing})
})

//Update route
app.put("/listings/:id", async(req, res)=>{
    let {id} = req.params;
   await  Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listings/${id}`);
})


//Delete route 
app.delete("/listings/:id" , async(req , res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// app.get("/testListing" , async(req , res) =>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "calangute , Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Succesfull Testing");
// });

app.listen(8080 ,()=>{
    console.log("server is listening on port 8080");
});