const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoryClicksSchema = new Schema({
    category: {
      type: String,
      enum:   ['rooms' , 'iconic-cities' , 'mountains' ,'castles' , 'pools','camping' ,'farms','arctic' , 'domes', 'boats'],
      unique: true
    },
    clickCount: {
      type: Number,
      default: 0
    }
  });
  
const CategoryClicks = mongoose.model("CategoryClicks", categoryClicksSchema);
module.exports = CategoryClicks;
  