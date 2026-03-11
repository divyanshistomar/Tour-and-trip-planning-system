

const http    = require('http');    
const path    = require('path');   
const fs      = require('fs');      
const express = require('express'); 
// Import route modules (modular routing)
const homeRoute         = require('./routes/home');
const destinationsRoute = require('./routes/destinations');
const packagesRoute     = require('./routes/packages');
const bookingsRoute     = require('./routes/bookings');
const aboutRoute        = require('./routes/about');
const contactRoute      = require('./routes/contact');
const apiRoute          = require('./routes/api');

const app  = express();
const PORT = 3000;

let toursData = [];
try {
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'tours.json'), 'utf8');
  toursData  = JSON.parse(raw);
  console.log('[SERVER] Loaded ' + toursData.length + ' tours from tours.json');
} catch (err) {
  console.error('[SERVER] Could not load tours.json:', err.message);
}
app.locals.tours = toursData; // make available to all routes


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
  console.log('[' + new Date().toLocaleTimeString() + ']  ' + req.method + '  ' + req.url);
  next();
});


app.use('/',             homeRoute);
app.use('/destinations', destinationsRoute);
app.use('/packages',     packagesRoute);
app.use('/booking',      bookingsRoute);
app.use('/about',        aboutRoute);
app.use('/contact',      contactRoute);
app.use('/api',          apiRoute);


app.use(function (req, res) {
  var stream = fs.createReadStream(path.join(__dirname, 'views', '404.html'));
  stream.on('error', function () { res.status(404).send('<h1>404 - Page Not Found</h1>'); });
  res.status(404);
  stream.pipe(res);
});


app.use(function (err, req, res, next) {
  console.error('[ERROR]', err.message);
  res.status(500).send('<h1>500 - Internal Server Error</h1>');
});

// --- HTTP Module: create and start server ---
var server = http.createServer(app);
server.listen(PORT, function () {
  console.log('================================================');
  console.log('  INDIA TRIP PLANNER - Server Running');
  console.log('  Open: http://localhost:' + PORT);
  console.log('================================================');
});

module.exports = app;
