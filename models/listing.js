const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String ,
    image :  {
        type : String,
        default : "https://unsplash.com/photos/a-man-standing-on-top-of-a-hill-under-a-cloudy-sky-O-dWPPAOgEU" ,
        set : (v) => v === ""
        ? "https://unsplash.com/photos/a-man-standing-on-top-of-a-hill-under-a-cloudy-sky-O-dWPPAOgEU" 
        : v,
    },
    price : Number,
    location : String ,
    country : String ,

})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;