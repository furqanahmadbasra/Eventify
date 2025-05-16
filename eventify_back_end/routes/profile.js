const express = require("express")
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const User = require('../models/User'); // Adjust path if different
const { body, validationResult } = require("express-validator")

// @route   POST /api/users/profile
// @desc    Add or update user profile
// @access  Private (requires login)
router.post('/profile', fetchuser, async (req, res) => {
    try {
        // Ensure userId is available
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User not found or token is invalid' });
        }

        // console.log("User ID: ", userId);

        // Ensure profile data exists in request body
        const profileData = req.body;
        if (!profileData || Object.keys(profileData).length === 0) {
            return res.status(400).json({ success: false, error: 'Profile data is missing or empty' });
        }

        // Log the incoming profile data to check what is coming from the frontend
        // console.log("Profile Data: ", profileData);

        // Proceed to update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    profile: profileData,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});




// now we are gona make a get route to fetch the profiel info , 
router.get("/profileInfo", fetchuser, async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId).select("-password -email -name");

        if (!user || !user.profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.status(200).json(user.profile);

    } catch (error) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});




// GET profiles (advisors and investors)
router.get('/get_investors_advisors_profiles', fetchuser , async (req, res) => {
  try {
    // Fetch all users with userType 'advisor' or 'investor'
    const advisors = await User.find({ 'profile.userType': 'advisor' }).select('profile');
    const investors = await User.find({ 'profile.userType': 'investor' }).select('profile');

    // console.log(advisors);
    // console.log("investors are ", investors );
    
    // Return the profiles of advisors and investors
    return res.json({
      advisors: advisors.map(user => user.profile),
      investors: investors.map(user => user.profile),
    });
    
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return res.status(500).json({ message: 'Failed to fetch profiles' });
  }
});


module.exports = router;
