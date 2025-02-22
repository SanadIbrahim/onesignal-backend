require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());

// Load environment variables
const PUSHY_API_KEY = process.env.PUSHY_API_KEY;

// Log environment variables for debugging
console.log("PUSHY_API_KEY:", PUSHY_API_KEY);

// POST endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { requestId, userName, requestType } = req.body;
  if (!requestId || !userName || !requestType) {
    return res.status(400).json({ error: "Missing required fields: requestId, userName, or requestType" });
  }

  try {
    const response = await axios.post(
      'https://api.pushy.me/push?api_key=' + PUSHY_API_KEY,
      {
        to: '*', // Send to all devices (or specify a device token)
        notification: {
          title: `طلب رقم ${requestId}`, // Arabic title
          body: `تم إضافة طلب جديد بواسطة ${userName} \n نوع الطلب: ${requestType}`, // Arabic message
          sound: 'notification', // Custom sound file (without extension)
        },
        data: {
          requestType, // Additional data
        },
      }
    );

    console.log("Notification sent successfully:", response.data);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
