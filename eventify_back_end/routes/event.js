const express = require("express")
const router = express.Router()
const fetchuser = require("../middleware/fetchuser")
const Event = require("../models/Event");
const { body, validationResult } = require("express-validator")
const User = require("../models/User");
const PastEvent = require("../models/Pastevents")
// cleanupEvents.js
const cron = require('node-cron');


// now we need to delete the events whose date has already passed , and put them in the pastEvents table
// Run every minute
cron.schedule('* * * * *', async () => {
    const now = new Date();

    try {
        // Get all events scheduled for today or earlier
        const candidates = await Event.find({
            date: { $lte: now } // so we don't even look at future events
        });

        const expiredEvents = [];

        for (const event of candidates) {
            if (!event.endTime) continue; // skip if no endTime

            // Combine date + endTime
            const [hours, minutes] = event.endTime.split(':').map(Number);
            const eventEnd = new Date(event.date);
            eventEnd.setHours(hours, minutes, 0, 0);

            if (eventEnd < now) {
                expiredEvents.push(event);
            }
        }

        if (expiredEvents.length > 0) {
            await PastEvent.insertMany(expiredEvents);
            await Event.deleteMany({ _id: { $in: expiredEvents.map(e => e._id) } });

            console.log(`✅ Moved ${expiredEvents.length} expired events to PastEvent at ${now}`);
        }
    } catch (err) {
        console.error('❌ Error while moving expired events:', err);
    }
});


// now we are gona fetch the events that are already occured , user can see thier past events
router.get("/get_past_events", fetchuser, async (req, res) => {

    const userId = req.user.id ;

try {
    const events = await PastEvent.find({ registeredUsers: userId });

    if (events.length) {
        res.json({
            success: true,
            message: "Past events found.",
            events
        });
    } else {
        res.json({
            success: false,
            message: "No past events found for this user.",
            events: []
        });
    }
} catch (err) {
    console.error('Error fetching past events:', err);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
});


//now we need to have a route to host a event by the user 
router.post('/addEvent', fetchuser, [
    body('title', 'please enter a valid title').isLength({ min: '3' }), //we can also add a custom message ('name', 'message') 
    body('description', ' description should not be less then 5 length').isLength({ min: '5' }),
], async (req, res) => {

    try {


        // console.log("we re in backend ///////////////////////////")
        // console.log(req.body);
        const { image, endTime, eventLink, contactInfo, title, description, date, time, location, latitude, longitude, city, country, category, seatsAvailable, price, is_online, eventType, skillLevel, audience, mode } = req.body;

        const errors = validationResult(req);
        // fist check wether the validation has given error or not
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Properly structure the response
        }


        const event = new Event({

            image,  // Send compressed Base64 image
            endTime,
            eventLink,
            contactInfo,

            title,
            description,
            date,
            time,
            location,
            latitude,
            longitude,
            city,
            country,
            category,
            seatsAvailable,
            price,
            is_online,
            eventType,
            skillLevel,
            audience,
            mode,
            host: req.user.id  // from the fetch user  , middleware 
        })

        const hosted_event = await event.save();

        // 🔄 Add the event to user's hostedEvents
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { hostedEvents: hosted_event._id }
        });

        res.json(hosted_event)



    } catch (error) {

        console.error(error.message)
        res.status(500).json({ error: "internal server eror" })

    }


})





// now we need a route to search the events , based on the specific fields that user entered on filter bar 
router.get('/getEvents', fetchuser, async (req, res) => {
    try {
        const {
            finalDate,
            sortBy,
            mode,
            audience,
            skillLevel,
            eventType,
            category,
            city,
            country,

        } = req.query;

        // console.log("we are in getEvents", finalDate);

        let startDate, endDate;

        // // Handle the finalDate
        // if (finalDate) {
        //     const now = new Date();

        //     if (finalDate === 'Today') {
        //         // Normalize today's date (start of the day to end of the day)
        //         startDate = new Date(now.setHours(0, 0, 0, 0));  // Start of today (00:00)
        //         endDate = new Date(now.setHours(23, 59, 59, 999));  // End of today (23:59:59)
        //     } else if (finalDate === 'This Week') {
        //         // Start of the week (Sunday) to the end of the week (Saturday)
        //         const startOfWeek = new Date(now);
        //         startOfWeek.setDate(now.getDate() - now.getDay());  // Sunday
        //         startOfWeek.setHours(0, 0, 0, 0);  // Start of the day

        //         const endOfWeek = new Date(startOfWeek);
        //         endOfWeek.setDate(startOfWeek.getDate() + 6);  // Saturday
        //         endOfWeek.setHours(23, 59, 59, 999);  // End of the day

        //         startDate = startOfWeek;
        //         endDate = endOfWeek;
        //     } else if (finalDate === 'This Month') {
        //         // From now to the end of this month
        //         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        //         const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);  // End of the month

        //         startDate = startOfMonth;
        //         endDate = endOfMonth;
        //     } else if (finalDate === 'Next Three Months') {
        //         // From now to the end of 3 months from today
        //         startDate = new Date(now);
        //         endDate = new Date(now.setMonth(now.getMonth() + 3));  // End of 3 months
        //         endDate.setHours(23, 59, 59, 999);  // End of the day
        //     }
        // }

        if (finalDate) {
            const now = new Date();  // Current time

            if (finalDate === 'Today') {
                // From now until the end of today
                startDate = now;
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);  // End of today
            } else if (finalDate === 'This Week') {
                // From now until 7 days from now
                startDate = now;
                endDate = new Date(now);
                endDate.setDate(now.getDate() + 7);  // Add 7 days to current date
                endDate.setHours(23, 59, 59, 999);  // End of that day
            } else if (finalDate === 'This Month') {
                // From now until 30 days from now
                startDate = now;
                endDate = new Date(now);
                endDate.setDate(now.getDate() + 30);  // Add 30 days to current date
                endDate.setHours(23, 59, 59, 999);  // End of that day
            } else if (finalDate === 'Next Three Months') {
                // From now until 90 days from now
                startDate = now;
                endDate = new Date(now);
                endDate.setDate(now.getDate() + 90);  // Add 90 days to current date
                endDate.setHours(23, 59, 59, 999);  // End of that day
            }
        }

        let sortOptions = {};

        if (sortBy === 'Alphabetical') {
            sortOptions.title = 1; // A to Z
        } else if (sortBy === 'Newly Added') {
            sortOptions.createdAt = -1; // Newest first
        } else if (sortBy === 'Ending Soon') {
            sortOptions.date = 1; // Soonest first
        }



        let filters = {};

        // Build the filter object
        if (mode) filters.mode = mode;
        if (audience) filters.audience = audience;
        if (skillLevel) filters.skillLevel = skillLevel;
        if (eventType) filters.eventType = eventType;
        if (category) filters.category = category;
        if (city) filters.city = city;
        if (country) filters.country = country;



        // Add the date range to the filters if it was calculated
        if (startDate && endDate) {
            filters.date = { $gte: startDate.toISOString(), $lte: endDate.toISOString() };
        }

        // const events = await Event.find(filters);

        let events;

        if (sortBy === 'Trending') {
            events = await Event.aggregate([
                { $match: filters },
                {
                    $addFields: {
                        registeredUsersCount: { $size: "$registeredUsers" }
                    }
                },
                { $sort: { registeredUsersCount: -1 } }
            ]);
        } else {
            events = await Event.find(filters).sort(sortOptions);
        }


        // example of how the quries are passed in  filter above 
        // Event.find({
        //     mode: "Online",
        //     city: "Islamabad",
        //     date: { $gte: startDate, $lte: endDate }
        // });

        res.json(events);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "internal server error" });
    }
});



// now we are gona register the user into the event 
router.post("/register/:eventId", fetchuser, async (req, res) => {

    try {

        const { eventId } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(eventId);

        // check if the event is present or not 
        if (!event) {
            return res.status(400).json({ message: "Event not found" })
        }

        // Prevent duplicate registration
        if (event.registeredUsers.includes(userId)) {
            return res.status(400).json({ message: 'User already registered for this event' });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Prevent duplicate registration in user
        if (user.registeredEvents.includes(eventId)) {
            return res.status(400).json({ message: 'Event already added to user' });
        }

        // Register event in user
        user.registeredEvents.push(eventId);
        await user.save();

        event.registeredUsers.push(userId);
        const result = await event.save();

        if (result) {
            res.status(200).json({ message: 'Registration successful', event });
        }
        else {
            return res.status(400).json({ message: 'internal server error ' });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "internal server error" });
    }

});






// GET: Get all events a user has registered for
router.get('/registeredEventsByUser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('registeredEvents');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // console.log("weeeeee ;;;;;;;;;;;")
        const eventIds = user.registeredEvents;

        // If no events are registered
        if (eventIds.length === 0) {
            return res.status(200).json([]);  // Empty array response
        }
        // console.log("weeeeee ;;;;;;;;;;;")

        // Fetch event documents using the IDs
        const events = await Event.find({ _id: { $in: eventIds } });

        // console.log("we have found events" , events)
        return res.status(200).json(events);  // ✅ This is the proper response
    } catch (error) {
        console.error("Error fetching registered events:", error);
        return res.status(500).json({ message: "Server error" });
    }
});




// now we are gona cancle the registeration in a event by the user 
router.delete('/cancel-registration/:eventId', fetchuser, async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;


    // console.log("the event id is ", eventId)
    // console.log("the user id is :  ", userId)

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // console.log("wuser foind ")

        // Remove eventId from registeredEvents in user schema
        user.registeredEvents.pull(eventId);
        await user.save();

        // Remove userId from attendees of the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.registeredUsers.pull(userId);
        await event.save();


        return res.status(200).json({ message: 'Registration canceled successfully' });
    } catch (error) {
        console.error('Error during cancellation:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});






//now we need a route to delete the event hosted by the user 

// so first of all get all the events hosted by user 
// GET /api/event/hosted - Get all events hosted by the logged-in user
router.get('/hosted', fetchuser, async (req, res) => {
    try {
        const hostedEvents = await Event.find({ host: req.user.id });
        res.json(hostedEvents);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// now delete teh event 
// DELETE /api/event/delete/:id
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        const eventId = req.params.id;

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the logged-in user is the host
        if (event.host.toString() !== req.user.id) {
            return res.status(401).json({ error: 'Unauthorized: You are not the host of this event' });
        }

        // Delete the event from the Event collection
        await Event.findByIdAndDelete(eventId);

        // Remove the event ID from the user's hostedEvents array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { hostedEvents: eventId }
        });

        res.json({ message: 'Event deleted successfully' });

    } catch (error) {
        console.error('Delete event error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});





// now to update the event 

// PUT route to update an event
router.put('/update_The_Event/:id', fetchuser, async (req, res) => {
    try {

        const { id } = req.params;

        // Find the event by ID
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update the event details
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

        // Respond with the updated event
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating event' });
    }
});


router.get("/AllRegisteredUsers/:id", fetchuser, async (req, res) => {
    try {

        // console.log("..................///////////////////")
        const eventId = req.params.id;

        // Find users who registered for this event
        const users = await User.find({ registeredEvents: eventId })
            .select("name email profile.profilePic  profile.fullName");

        // console.log(users);
        res.json(users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router; 