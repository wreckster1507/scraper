// const puppeteer = require('puppeteer');
// const Product = require('../models/Product'); // Assuming you have a Mongoose model for storing products
// const { sendPriceDropEmail } = require('../utils/email'); // Utility for sending emails

// const scrapePrices = async (req, res) => {
//     const baseUrl = 'https://www.flipkart.com/search?q=iphone+16&page=';
//     const totalPages = 6; // Set the number of pages to scrape
//     const iPhone16Details = []; // Array to hold iPhone 16 details

//     // CSS selectors
//     const priceSelector = '.Nx9bqj._4b5DiR'; // Adjust this selector as necessary
//     const imageSelector = 'img.DByuf4'; // Adjust this selector as necessary
//     const detailsSelector = '._6NESgJ'; // Adjust this selector as necessary
//     const deliveryDateSelector = '.yiggsN'; // Adjust this selector as necessary
//     const phoneNameSelector = '.KzDlHZ'; // Adjust this selector as necessary

//     let currentPage = 1;
//     try {
//         // Launch Puppeteer
//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();

//         // Loop through all pages
//         while (currentPage <= totalPages) {
//             console.log(`Scraping page ${currentPage}...`);

//             const url = `${baseUrl}${currentPage}`;
//             await page.goto(url, { waitUntil: 'networkidle2' });

//             // Scrape the phone names
//             const phoneNames = await page.evaluate((phoneNameSelector) => {
//                 const phoneNameElements = Array.from(document.querySelectorAll(phoneNameSelector));
//                 return phoneNameElements.map(element => element.innerText);
//             }, phoneNameSelector);

//             // Filter for "iPhone 16" only
//             const iPhone16Indexes = phoneNames
//                 .map((name, index) => (name.includes('iPhone 16') ? index : -1))
//                 .filter(index => index !== -1); // Remove -1s (non-matching items)

//             // Scrape the prices
//             const prices = await page.evaluate((priceSelector) => {
//                 const priceElements = Array.from(document.querySelectorAll(priceSelector));
//                 return priceElements.map(element => element.innerText);
//             }, priceSelector);

//             // Scrape the images
//             const images = await page.evaluate((imageSelector) => {
//                 const imageElements = Array.from(document.querySelectorAll(imageSelector));
//                 return imageElements.map(element => element.src);
//             }, imageSelector);

//             // Scrape the details
//             const details = await page.evaluate((detailsSelector) => {
//                 const detailsElements = Array.from(document.querySelectorAll(detailsSelector));
//                 return detailsElements.map(element => element.innerText);
//             }, detailsSelector);

//             // Scrape the delivery dates
//             const deliveryDates = await page.evaluate((deliveryDateSelector) => {
//                 const deliveryDateElements = Array.from(document.querySelectorAll(deliveryDateSelector));
//                 return deliveryDateElements.map(element => element.innerText);
//             }, deliveryDateSelector);

//             // Add only matching iPhone 16 items to the array
//             iPhone16Indexes.forEach((index) => {
//                 iPhone16Details.push({
//                     phoneName: phoneNames[index],
//                     price: prices[index],
//                     image: images[index],
//                     details: details[index],
//                     deliveryDate: deliveryDates[index]
//                 });
//             });

//             // Move to the next page
//             currentPage++;
//         }

//         // Convert price strings to numbers
//         const convertPrice = (price) => {
//             return parseInt(price.replace(/[₹,]/g, '')); // Remove currency symbol and commas
//         };

//         // Find the product with the minimum price
//         let minPricePhone = null;
//         if (iPhone16Details.length > 0) {
//             let minPriceValue = convertPrice(iPhone16Details[0].price);
//             minPricePhone = iPhone16Details[0]; // Assume the first product is the cheapest

//             for (let i = 1; i < iPhone16Details.length; i++) {
//                 let currentPrice = convertPrice(iPhone16Details[i].price);
//                 if (currentPrice < minPriceValue) {
//                     minPriceValue = currentPrice;
//                     minPricePhone = iPhone16Details[i];
//                 }
//             }
//         }

//         // Database & Price Drop Email Logic
//         for (const product of iPhone16Details) {
//             const existingProduct = await Product.findOne({ phoneName: product.phoneName });

//             const newPrice = convertPrice(product.price);
//             if (existingProduct) {
//                 // If price drops, send an email
//                 if (newPrice < existingProduct.price) {
//                     sendPriceDropEmail(product, existingProduct.price);
//                 }

//                 // Update existing product
//                 existingProduct.price = newPrice;
//                 existingProduct.image = product.image;
//                 existingProduct.details = product.details;
//                 existingProduct.deliveryDate = product.deliveryDate;
//                 existingProduct.lastUpdated = Date.now();
//                 await existingProduct.save();
//             } else {
//                 // Add new product
//                 const newProduct = new Product({
//                     phoneName: product.phoneName,
//                     price: newPrice,
//                     image: product.image,
//                     details: product.details,
//                     deliveryDate: product.deliveryDate,
//                     lastUpdated: Date.now()
//                 });
//                 await newProduct.save();
//             }
//         }

//         // Send the response with all iPhone 16 details and the minimum price phone
//         res.json({ iPhone16Details, minPricePhone });
//     } catch (error) {
//         console.error('Error scraping the prices:', error);
//         res.status(500).json({ error: 'Failed to fetch prices' });
//     }
// };

// module.exports = { scrapePrices };


const puppeteer = require('puppeteer');
const Product = require('../models/Product'); // Assuming you have a Mongoose model for storing products
const { sendPriceDropEmail, sendScrapingCompleteEmail } = require('../utils/email'); // Utility for sending emails


const scrapePrices = async (req, res) => {
    const baseUrl = 'https://www.flipkart.com/search?q=iphone+16&page=';
    const totalPages = 6; // Set the number of pages to scrape
    const iPhone16Details = []; // Array to hold iPhone 16 details

    // CSS selectors
    const priceSelector = '.Nx9bqj._4b5DiR'; // Adjust this selector as necessary
    const imageSelector = 'img.DByuf4'; // Adjust this selector as necessary
    const detailsSelector = '._6NESgJ'; // Adjust this selector as necessary
    const deliveryDateSelector = '.yiggsN'; // Adjust this selector as necessary
    const phoneNameSelector = '.KzDlHZ'; // Adjust this selector as necessary

    let currentPage = 1;
    let browser;
    try {
        // Launch Puppeteer
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Loop through all pages
        while (currentPage <= totalPages) {
            console.log(`Scraping page ${currentPage}...`);

            const url = `${baseUrl}${currentPage}`;
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Scrape the phone names
            const phoneNames = await page.evaluate((phoneNameSelector) => {
                const phoneNameElements = Array.from(document.querySelectorAll(phoneNameSelector));
                return phoneNameElements.map(element => element.innerText);
            }, phoneNameSelector);

            // Filter for "iPhone 16" only
            const iPhone16Indexes = phoneNames
                .map((name, index) => (name.includes('iPhone 16') ? index : -1))
                .filter(index => index !== -1); // Remove -1s (non-matching items)

            // Scrape the prices
            const prices = await page.evaluate((priceSelector) => {
                const priceElements = Array.from(document.querySelectorAll(priceSelector));
                return priceElements.map(element => element.innerText);
            }, priceSelector);

            // Scrape the images
            const images = await page.evaluate((imageSelector) => {
                const imageElements = Array.from(document.querySelectorAll(imageSelector));
                return imageElements.map(element => element.src);
            }, imageSelector);

            // Scrape the details
            const details = await page.evaluate((detailsSelector) => {
                const detailsElements = Array.from(document.querySelectorAll(detailsSelector));
                return detailsElements.map(element => element.innerText);
            }, detailsSelector);

            // Scrape the delivery dates
            const deliveryDates = await page.evaluate((deliveryDateSelector) => {
                const deliveryDateElements = Array.from(document.querySelectorAll(deliveryDateSelector));
                return deliveryDateElements.map(element => element.innerText);
            }, deliveryDateSelector);

            // Add only matching iPhone 16 items to the array
            iPhone16Indexes.forEach((index) => {
                iPhone16Details.push({
                    phoneName: phoneNames[index],
                    price: prices[index],
                    image: images[index],
                    details: details[index],
                    deliveryDate: deliveryDates[index]
                });
            });

            // Move to the next page
            currentPage++;
        }

        // Convert price strings to numbers
        const convertPrice = (price) => {
            return parseInt(price.replace(/[₹,]/g, '')); // Remove currency symbol and commas
        };

        // Find the product with the minimum price
        let minPricePhone = null;
        if (iPhone16Details.length > 0) {
            let minPriceValue = convertPrice(iPhone16Details[0].price);
            minPricePhone = iPhone16Details[0]; // Assume the first product is the cheapest

            for (let i = 1; i < iPhone16Details.length; i++) {
                let currentPrice = convertPrice(iPhone16Details[i].price);
                if (currentPrice < minPriceValue) {
                    minPriceValue = currentPrice;
                    minPricePhone = iPhone16Details[i];
                }
            }
        }

        // Database & Price Drop Email Logic
        for (const product of iPhone16Details) {
            const existingProduct = await Product.findOne({ phoneName: product.phoneName });

            const newPrice = convertPrice(product.price);
            if (existingProduct) {
                // If price drops, send an email
                if (newPrice < existingProduct.price) {
                    sendPriceDropEmail(product, existingProduct.price);
                }

                // Update existing product
                existingProduct.price = newPrice;
                existingProduct.image = product.image;
                existingProduct.details = product.details;
                existingProduct.deliveryDate = product.deliveryDate;
                existingProduct.lastUpdated = Date.now();
                await existingProduct.save();
            } else {
                // Add new product
                const newProduct = new Product({
                    phoneName: product.phoneName,
                    price: newPrice,
                    image: product.image,
                    details: product.details,
                    deliveryDate: product.deliveryDate,
                    lastUpdated: Date.now()
                });
                await newProduct.save();
            }
        }

        // Log scraping completion
        console.log('Scraping completed successfully.');

        // Send email notification
        sendScrapingCompleteEmail(); // Notify that scraping is done

        // Send the response with all iPhone 16 details and the minimum price phone
        res.json({ iPhone16Details, minPricePhone });
    } catch (error) {
        console.error('Error scraping the prices:', error);
        res.status(500).json({ error: 'Failed to fetch prices' });
    } finally {
        if (browser) {
            await browser.close(); // Ensure browser is closed even in case of errors
        }
    }
};

// Set up a daily cron job (e.g., run the scrape function every day at 8 AM)


module.exports = { scrapePrices };
