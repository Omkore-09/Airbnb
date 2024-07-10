const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wandurlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); //using css

app.get("/", (req, res) => {
  res.send("Hello omkar");
});

const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errMsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}


//index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let{title , description , image , price , location , country}=req.body ;
    //for error checking
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listings");
    // }

    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    
    // if(newListing.description){
    //     throw new ExpressError(400, "Description is missing");
    // }
    // if(newListing.title){
    //     throw new ExpressError(400, "Title is missing");
    // }
    await newListing.save();
    // console.log(newListing);
    res.redirect("/listings");
  })
);

//Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

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

app.all("*", (req, res, next) => {
  next(new ExpressError(404, " Page Not Found!"));
});

//middleware

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went wrong" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});
