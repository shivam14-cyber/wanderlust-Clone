const Listing=require("../model/listing");
const  {config,geocoding}=require("@maptiler/client");
config.apiKey=process.env.MAPTILER_KEY;

module.exports.index = async (req, res) => {
    let { search } = req.query;
    let allListing;
    if (search && search.trim()) {
        search = search.trim().toUpperCase();
        allListing = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
        if (allListing.length === 0) {
           allListing = await Listing.find({});
         }
    } else {
        allListing = await Listing.find({});
    }

    res.render("listing/index.ejs", { allListing });
};

// module.exports.index=async(req,res)=>{
//   let allListing= await Listing.find({});
//   res.render("listing/index",{allListing});
// };
module.exports.new=(req,res)=>{
  res.render("listing/new");
  
}

module.exports.created=async(req,res)=>{
  let data=req.body.listing;
  let url=req.file.path;
  let filename=req.file.filename;
  let newdata=await  new Listing (data);
  newdata.image={url,filename};
  newdata.owner=req.user._id;

  const result = await geocoding.forward(newdata.location);
  const coordinates=result.features[0].geometry.coordinates ||[0,0];
  
  newdata.geomatry={type:"Point",coordinates:coordinates};

  let savedata=await newdata.save();
  res.redirect("/listings");
}

module.exports.show=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  res.render("listing/show",{listing});
}
module.exports.edit=async(req,res)=>{
  let {id}=req.params;
  let data=await Listing.findById(id);
  if(!data){
    req.flash("error","Listing you requested doesn't exist");
     return res.redirect("/listings");
  }
  let originalImage=data.image.url;
  originalImage = originalImage.replace(
  "/upload",
  "/upload/h_300,w_250"
  ); 
   res.render("listing/edit",{data,originalImage});
}
module.exports.update= async (req, res)=>{
    const { id } = req.params;
    const data = req.body.listing;
    
  const result = await geocoding.forward(data.location);
  const coordinates=result.features[0].geometry.coordinates ||[0,0];

  data.geomatry={type:"Point",coordinates:coordinates};
  console.log(data.geomatry);

  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    updatedData.image={url,filename};
    await updatedData.save();
  }

  const updatedData = await Listing.findByIdAndUpdate(id,data,{new: true,runValidators: true} );
    res.redirect(`/listings/${id}`);
}
module.exports.delete=async(req,res)=>{
  let {id}=req.params;
  let deletedData=await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}