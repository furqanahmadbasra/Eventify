const mongoose = require("mongoose");

const { Schema } = mongoose;

const EventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

        // for storing the image
        image: {
            type: String,  // Store the Base64 string
        },

        time : {type : String} ,



        date: { type: Date, required: true },
        // startTime: { type: String },
        endTime: { type: String },

        // country: { type: String, required: true },
        country: { type: String},
        city: { type: String},
        // city: { type: String, required: true },
        mode: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            required: true,
        },
        skillLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            required: true,
        },
        eventType: {
            type: String,
            enum: [
                "Hackathon",
                "Seminar",
                "Workshop",
                "Conference",
                "Webinar",
                "Bootcamp",
                "Tech Talk",
            ],
            required: true,
        },
        category: {
            type: String,
            enum: [
                "Tech",
                "Business",
                "Design",
                "AI/ML",
                "Cybersecurity",
                "Blockchain",
                "Health",
                "Education",
            ],
            required: true,
        },
        audience: {
            type: String,
            enum: [
                "Students",
                "Professionals",
                "Startups",
                "Researchers",
                "Entrepreneurs",
                "Investors",
            ],
            required: true,
        },
        price: { type: Number, required: true },
        seatsAvailable: { type: Number, required: true },
        location: { type: String },
        // location: { type: String, required: true },

        // sortingBy: { type: String, required: true },// we are not gona store this value in db 

        latitude: { type: Number },
        longitude: { type: Number },
        eventLink: { type: String },
        contactInfo: { type: String },


        host: { type: Schema.Types.ObjectId, ref: "User", required: true },
        registeredUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

// Indexes for filtering
EventSchema.index({ date: 1 });
EventSchema.index({ country: 1 });
EventSchema.index({ city: 1 });
EventSchema.index({ mode: 1 });
EventSchema.index({ skillLevel: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ sortingBy: 1 });

EventSchema.index({ country: 1, city: 1, date: 1 });
EventSchema.index({ mode: 1, skillLevel: 1 });
EventSchema.index({ eventType: 1, category: 1 });

module.exports = mongoose.model("Event", EventSchema);
