const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

// Route for scraping iPhone prices
router.get('/scrape', scrapeController.scrapePrices);

module.exports = router;
