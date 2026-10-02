const express=require('express');
const router=express.Router({ mergeParams: true });
const wrapasyn=require("../utils/Wrapasycn");
const {validatereview,isLoggedIn,isAuthor}=require("../middleware");
const ReviewController=require("../controller/review")



// Review
router.post("/",isLoggedIn,validatereview,wrapasyn(ReviewController.createreview))

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapasyn(ReviewController.deleteReview))

module.exports=router;