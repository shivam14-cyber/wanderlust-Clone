require('dotenv').config()
const express=require('express');
const router=express.Router();
const wrapasyn=require("../utils/Wrapasycn");
const Listing=require("../model/listing");
const {isLoggedIn,isOwner,validatelistting}=require("../middleware");
const listingController=require("../controller/listing")
const multer  = require('multer')
const {storage}=require('../cloudConfig')
const upload = multer({ storage})


router.
 route("/")
 .get(wrapasyn(listingController.index))
 .post(isLoggedIn,upload.single("listing[image]"),validatelistting,wrapasyn(listingController.created))

router.
 route("/new")
 .get(isLoggedIn,listingController.new)

router.
 route("/:id")
 .get(wrapasyn(listingController.show))
 .put(isLoggedIn,isOwner,upload.single("listing[image]"),validatelistting,wrapasyn(listingController.update))
 .delete(isLoggedIn,isOwner,wrapasyn(listingController.delete))

router.get("/:id/edit",isLoggedIn,isOwner,wrapasyn(listingController.edit))


module.exports=router;