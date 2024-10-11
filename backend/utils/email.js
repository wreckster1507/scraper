const nodemailer = require('nodemailer');

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hirabyera123@gmail.com', // Use environment variable
        pass: 'dijhomtlqhuashhb'  // Use environment variable
    }
});

// Function to send a price drop email
const sendPriceDropEmail = (newPhone, oldPrice) => {
    const mailOptions = {
        from: 'hirabyera123@gmail.com', // Use environment variable
        to: 'hirabyera123@gmail.com',
        subject: 'Price Drop Alert: iPhone 16!',
        html: `<h3>Price Drop Detected!</h3>
               <p><strong>Phone Name:</strong> ${newPhone.phoneName}</p>
               <p><strong>Old Price:</strong> ₹${oldPrice}</p>
               <p><strong>New Price:</strong> ₹${newPhone.price}</p>
               <img src="${newPhone.image}" alt="iPhone 16 Image" style="width: 200px; height: auto;" />`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending price drop email:', error);
        } else {
            console.log('Price drop email sent:', info.response);
        }
    });
};

// Function to send a scraping completion email
const sendScrapingCompleteEmail = () => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Use environment variable
        to: 'hirabyera123@gmail.com',
        subject: 'Scraping Completed',
        html: `<h3>Scraping Job Completed Successfully!</h3>
               <p>The scraping process for the iPhone 16 has been completed.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending scraping completion email:', error);
        } else {
            console.log('Scraping completion email sent:', info.response);
        }
    });
};

module.exports = { sendPriceDropEmail, sendScrapingCompleteEmail };
