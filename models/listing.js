const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default :'https://unsplash.com/photos/a-split-photo-of-a-living-room-and-kitchen-Itg6WGOAJaY',
    }
  },
    
  price: Number,
  location: String,
  country: String,
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;