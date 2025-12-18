const Listing = require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
 let response=await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 1,
})
  .send();
  
  const newListing = new Listing(req.body.listing);

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  newListing.owner = req.user._id;
  newListing.geometry=response.body.features[0].geometry;
  let saveListing=await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;

  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_300,h_200,c_fill,q_auto,f_auto"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  // if new image uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.listingsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const allListings = await Listing.find({ category });
        res.render('listings/index.ejs', { allListings });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Unable to fetch listings for this category');
        res.redirect('/listings');
    }
};


// module.exports.updateListing=async (req, res) => {
//   let { id } = req.params;
//   if(!req.body.listing)
//     {
//       throw new ExpressError(400,"send valid data for listing");
//     }
//   if (!req.body.listing.image || !req.body.listing.image.url.trim()) {
//     req.body.listing.image = {
//       url: undefined, // let mongoose apply default
//       filename: undefined,
//     };
//   }

//   await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     req.flash("success","Listing Updated!");
//   res.redirect(`/listings/${id}`);
// };
