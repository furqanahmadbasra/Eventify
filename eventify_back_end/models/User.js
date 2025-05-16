const mongoose = require('mongoose'); // Import mongoose
const { Schema } = mongoose; // Destructure Schema from mongoose


// Experience Schema
const experienceSchema = new Schema({
  role: { type: String, trim: true },
  organization: { type: String, trim: true },
  startDate: Date,
  endDate: Date,
  description: { type: String, trim: true }
}, { _id: true });

// Profile Subdocument Schema
const profileSchema = new Schema({
  fullName: { type: String, trim: true },
  dob: Date,
  location: { type: String, trim: true },
  bio: { type: String, trim: true },
  email : {type : String} ,
  profilePic: { type: String }, // image URL or path

  userType: {
    type: String,
    enum: ['attendee', 'organizer', 'investor', 'advisor'],
    default: 'attendee'
  },

  skills: [{ type: String, trim: true }],
  focusAreas: [{ type: String, trim: true }],

  linkedin: { type: String, trim: true },
  website: { type: String, trim: true },

  // Organizer-specific fields
  startupName: { type: String, trim: true },
  startupStage: { type: String, trim: true },

  // Advisor/Investor-specific
  awards: [{ type: String, trim: true }],

  // Professional Experience
  experiences: [experienceSchema]
}, { _id: false });


const UserSchema = new Schema({
  // Auth Fields
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Profile Subdocument (Optional at Registration)
  profile: profileSchema,
  
    // List of event IDs the user is registered in
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],

  hostedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],


  // System Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: Date
});


const user = mongoose.model("user" , UserSchema);
module.exports =  user