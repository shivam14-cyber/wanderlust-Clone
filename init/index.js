
const mongoose = require("mongoose");
const Listing = require("../model/listing");
const initdata = require("./data");

main()
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });

async function main() {
    await mongoose.connect("mongodb+srv://sk2650shivam_db_user:IMvZCKKBGvajJ4nn@cluster0.xaqunbc.mongodb.net/?appName=Cluster0");
}

const insertManyData = async () => {
    try {
        await Listing.deleteMany({});

        const sampleData = initdata.data.map((obj) => ({
            ...obj,
            owner: "6abf67c7b29a972c399f31bd",
        }));

        await Listing.insertMany(sampleData);

        console.log("Data inserted successfully!");
    } catch (err) {
        console.log("Data insertion error:", err);
    } finally {
        await mongoose.connection.close();
    }
};

insertManyData();