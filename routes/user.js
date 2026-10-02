const express=require("express")
const router=express.Router();
const User=require("../model/user");
const Wrapasycn = require("../utils/Wrapasycn");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware");


router.
route("/signup")
 .get((req,res)=>{
  res.render("user/signup.ejs");
 })
 .post(Wrapasycn(async(req,res,next)=>{
 try{
   let {username,email,password}=req.body;
  let newUser=new User({
    username:username,
    email:email
  })
 const registerUser=await User.register(newUser,password);
 req.login(registerUser,(err)=>{
  if(err){
    return next(err)
  }
  res.redirect("/listings");
 })
 }catch(e){
  req.flash("errror",e.message);
  res.redirect("/signup");
 }
}))

router.
  route("/login")
  .get((req,res)=>{
  res.render("user/login.ejs")})
 .post( saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
  function(req, res) {
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  });

router.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    res.redirect("/listings");
  })
})

module.exports=router;