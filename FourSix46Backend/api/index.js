// Vercel serverless function entry point
// This file exports the Express app for Vercel deployment

const app = require('../server');

// Export the Express app directly - Vercel will handle it
module.exports = app;

