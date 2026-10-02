const Listing=require("../model/listing");

module.exports.index=async(req,res)=>{
  let allListing= await Listing.find({});
  res.render("listing/index",{allListing});
};
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
    const updatedData = await Listing.findByIdAndUpdate(id,data,{new: true,runValidators: true} );
    if(typeof req.file !== "undefined"){
     let url=req.file.path;
     let filename=req.file.filename;
     updatedData.image={url,filename};
     await updatedData.save();
    }
    res.redirect(`/listings/${id}`);
}
module.exports.delete=async(req,res)=>{
  let {id}=req.params;
  let deletedData=await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}