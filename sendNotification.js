require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Load environment variables
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

// Log environment variables for debugging
console.log("ONESIGNAL_APP_ID:", process.env.ONESIGNAL_APP_ID);
console.log("ONESIGNAL_API_KEY:", process.env.ONESIGNAL_API_KEY);

// POST endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { requestId, userName, requestType } = req.body;

  if (!requestId || !userName || !requestType) {
    return res.status(400).json({ error: "Missing required fields: requestId, userName, or requestType" });
  }

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["All"],
        headings: { 
          "ar": `طلب رقم ${requestId}` ,
          "en": `Request Number ${requestId}` },
        contents: { 
          "ar": `تم إضافة طلب جديد بواسطة ${userName} \n نوع الطلب: ${requestType}`,
          "en": `A new request has been added by ${userName} \n request type: ${requestType}`
         },
        data: { requestType },
        sound: "notification",
      },
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_API_KEY}`, // Ensure this is correct
          "Content-Type": "application/json",
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
