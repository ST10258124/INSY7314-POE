// src/server.js
require('dotenv').config(); // load env FIRST

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const app = require('./app'); // <-- app should apply helmet/csp, cors, parsers, routes, errors

//  Route inspector
const listEndpoints = require("express-list-endpoints");
console.log("Registered routes:");
console.table(listEndpoints(app));

const PORT = process.env.PORT || 5000;

// Try to load local SSL certs for HTTPS; fallback to HTTP if not present
const keyPath = path.join(__dirname, '..', 'ssl', 'privatekey.pem');
const certPath = path.join(__dirname, '..', 'ssl', 'certificate.pem');

let serverFactory;
let protoLabel;

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  serverFactory = () => https.createServer(sslOptions, app);
  protoLabel = 'https';
} else {
  serverFactory = () => http.createServer(app);
  protoLabel = 'http';
  console.warn('SSL certs not found in ./ssl; starting HTTP server for development.');
};

app.listen(5000, () => console.log("Server running on port 5000" + PORT));
