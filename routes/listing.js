const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController=require("../controllers/listings.js");

//Index route
router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),
validateListing, wrapAsync(listingController.createListing))

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);


//Show route ,Update Route ,Delete Route
router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isOwner, isLoggedIn,wrapAsync(listingController.destroyListing))

//Edit Route
router.get("/:id/edit",isOwner,isLoggedIn, wrapAsync(listingController.renderEditForm));



module.exports = router;




//Create route
// app.post("/listings", wrapAsync(async (req, res, next) => {
  
//     //  let {title,description,image,price,country,location}=req.body;
//     // let listing=req.body.listing; this is actually a JS object so created a model instance
//     if (
//       !req.body.listing.image ||
//       typeof req.body.listing.image !== "string" ||
//       req.body.listing.image.trim() === ""
//     ) {
//       req.body.listing.image = undefined;
//     }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
  
// }));


// //Index route && Create Route
// router.get("/test-upload", (req, res) => {
//   res.send(`
//     <form action="/listings/test-upload" method="POST" enctype="multipart/form-data">
//       <input type="file" name="image" />
//       <button type="submit">Upload</button>
//     </form>
//   `);
// });


// router.post(
//   "/test-upload",
//   upload.single("image"),
//   (req, res) => {
//     console.log("UPLOAD DONE:", req.file);
//     res.json({
//       success: true,
//       file: req.file,
//     });
//   }
// );