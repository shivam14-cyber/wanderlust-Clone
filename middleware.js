const Listing=require("./model/listing")
const Review=require("./model/review");
const {listingSchema,ReviewSchema}=require("./schema");
const ExpressError=require("./utils/Expresserror");

module.exports.isLoggedIn=(req,res,next)=>{
   if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    return res.redirect("/login")
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next()
}

module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
      if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are n't author of this listing ");
        return res.redirect(`/listings/${id}`);
      }
      next()
}


module.exports.validatelistting=(req,res,next)=>{
  let {err}=listingSchema.validate(req.body);
  if(err){
    let errMsg=err.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
}

module.exports.validatereview=(req,res,next)=>{
  let {err}=ReviewSchema.validate(req.body);
  if(err){
    let errMsg=err.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
}

module.exports.isAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
      if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are n't author of this comment ");
        return res.redirect(`/listings/${id}`);
      }
      next()
}