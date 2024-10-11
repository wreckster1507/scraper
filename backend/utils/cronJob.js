// utils/cronJob.js
const cron = require('node-cron');
const axios = require('axios');

// Schedule the cron job to run every day at 9:00 AM
cron.schedule('0 9 * * *', () => {
    console.log('Running daily price check...');
    axios.get('http://localhost:5000/api/scrape') // Update to your actual scrape endpoint
        .then(response => {
            console.log('Daily price check complete.');
        })
        .catch(error => {
            console.error('Error running daily price check:', error);
        });
});
