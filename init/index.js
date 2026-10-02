require('dotenv').config()
const mongoose=require("mongoose");
const Listing=require("../model/listing");
const initdata=require("./data")

main().then(res=>console.log("mongodb connection successfull")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODBURL);   
}


const inserManydata=async()=>{
  await Listing.deleteMany({});
  const sampleData= initdata.data.map((obj)=>({...obj,owner:'6abf67c7b29a972c399f31bd'}));
  await Listing.insertMany(sampleData);
  console.log("data was saved");
}

inserManydata();