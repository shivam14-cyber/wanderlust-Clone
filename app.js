const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/Expresserror");
const listingRouter=require("./routes/listing");
const reviewRouter=require("./routes/review");
const userRouter=require("./routes/user");
const session=require('express-session');
const {MongoStore} = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user");


app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"views"));

app.engine('ejs',ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))

main().then(res=>console.log("mongodb connection successfull")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODBURL);
    
}

const store = MongoStore.create({
  mongoUrl: process.env.MONGODBURL,
  touchAfter: 24 * 3600
});

store.on("error",(err)=>{
  console.log("Error in MONGO SESSION STORE",err)
})

const sessionOption={
  store,
  secret: "mysuperSecreate",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly: true,
  },
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.maptiler=process.env.MAPTILER_KEY;
  next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/login",async(req,res)=>{
//   let userdata=new User({
//     username:"shivam",
//     email:'shivam@gmail.com'
//   })
//   let registerd=await User.register(userdata,"1234");
//   res.send(registerd);
// })

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something Went Wrong"}=err;
  res.status(statusCode).render("error.ejs",{message})
})

app.listen(8080,()=>{
  console.log("port was listing")
});