const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
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
  review : [
    {
      type:Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing){
    await review.deleteMany({_id : {$in: listing.review}});
  }
  
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;