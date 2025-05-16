const mongoose = require('mongoose');
const { Schema } = mongoose;



const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    stage: {
      type: String,
      enum: ['Ideation', 'Pre-seed', 'Seed', 'Series A' , 'Series B+'], // Extend as needed
      default: 'Ideation',
    },
    website: {
      type: String,
    },
    foundedDate: {
      type: Date,
    },
    businessModel: {
      type: String,
    },
    problemStatement: {
      type: String,
    },
    solution: {
      type: String,
    },
    targetMarket: {
      type: String,
    },
    competitors: {
      type: String,
    },
    revenueModel: {
      type: String,
    },
    fundingNeeds: {
      type: String,
    },
    team: [{ name: String, role: String }],
    logo: {
      type: String, // Base64 string
    },
    pitchDeck: {
      type: String, // Base64 string
    },
    productImages: [
      {
        type: String, // Base64 strings
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Startup', startupSchema);
