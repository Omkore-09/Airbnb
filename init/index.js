const mongoose = require("mongoose");
// const initData = require('./data');
const initData = require("./data.js");
const Listing = require('../models/listing');


const MONGO_URL = "mongodb://127.0.0.1:27017/wandurlust"

main().then( ()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log("Error connecting to DB", err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj , owner:"669e94ba5cd8e322d0fb9817"}))
    await Listing.insertMany(initData.data);
    console.log("data was initiallised");
};

initDB();  