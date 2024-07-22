const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema }= require("../schema.js");
const Listing = require("../models/listing");


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
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let{title , description , image , price , location , country}=req.body ;
    //for error checking
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listings");
    // }

    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
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
    req.flash("success", "New listing created")
    // console.log(newListing);
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!")
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
  })
);

module.exports = router;
