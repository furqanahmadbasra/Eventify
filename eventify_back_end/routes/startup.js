const express = require("express")
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const User = require('../models/User'); // Adjust path if different
const Startup = require("../models/Startup")

const { body, validationResult } = require("express-validator")



// POST request to create a new startup
router.post('/postStartup', fetchuser, async (req, res) => {
    // console.log("we are here we are not ////////////////")
    try {
        const {
            name,
            description,
            industry,
            stage,
            website,
            foundedDate,
            businessModel,
            problemStatement,
            solution,
            targetMarket,
            competitors,
            revenueModel,
            fundingNeeds,
            team,
            logo,
            pitchDeck,
            productImages,
        } = req.body;

        // Validate the incoming data
        if (!name || !description || !industry || !stage || !foundedDate || !businessModel || !problemStatement || !solution) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // console.log("we are after fist iw")

        // Create a new startup document
        const newStartup = new Startup({
            name,
            description,
            industry,
            stage,
            website,
            foundedDate,
            businessModel,
            problemStatement,
            solution,
            targetMarket,
            competitors,
            revenueModel,
            fundingNeeds,
            team,
            logo,
            pitchDeck,
            productImages,
            user: req.user.id,  // Associate the startup with the logged-in user
        });

        // console.log("we are bauot it save ti ")

        // Save the startup to the database
        const savedStartup = await newStartup.save();


        // Return success response
        res.status(201).json({ message: 'Startup created successfully', startup: savedStartup });
    } catch (error) {
        console.error('Error posting startup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// GET all startups for the logged-in user
router.get("/fetchStartups_OF_USER", fetchuser, async (req, res) => {
    try {
        const userID = req.user.id;

        // Fetch startups from DB where user field matches the logged-in user's ID
        const startups = await Startup.find({ user: userID });

        res.status(200).json({ success: true, startups });
    } catch (error) {
        console.error("Error fetching user startups:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// GET all startups for the logged-in user
router.get("/fetchOtherStartups", fetchuser, async (req, res) => {
    try {
        const userID = req.user.id;

        // Find startups where user !== logged-in user
        const startups = await Startup.find({ user: { $ne: userID } });

        // console.log("we are doommed aoradadsf")

        res.status(200).json({ success: true, startups });
    } catch (error) {
        console.error("Error fetching user startups:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});



router.delete("/DeleteStartup/:id", fetchuser, async (req, res) => {
  const { id } = req.params;

//   console.log("we have the id", id);

  try {
    const deletedStartup = await Startup.findByIdAndDelete(id);

    if (!deletedStartup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    res.json({ message: 'Startup deleted successfully' });
  } catch (error) {
    console.error('Error deleting startup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});













module.exports = router;
