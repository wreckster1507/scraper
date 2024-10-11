const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const scrapeRoutes = require('./routes/scrape');
require('./utils/cronJob'); // Import the cron job utility

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

// Routes
app.use('/api', scrapeRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
