const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
// const CategoryClicks = require("../models/categoryClicksSchema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


//searching

router
.get('/search', async (req, res) => {
  const searchTerm = req.query.q;
  
  console.log('Search term:', searchTerm); // Debugging: log the search term
  
  try {
    const results = await Listing.find({
      $text: { $search: searchTerm }
    });
    res.render('search', { results }); // Render the search results page
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).send('An error occurred during the search.');
  }
});




router.get('/', listingController.index);

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
