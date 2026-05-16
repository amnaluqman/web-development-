const express = require('express');
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from public folder
app.use(express.static('public'));

// Home route
app.get('/', function(req, res) {
  res.render('index');
});

// Start server
app.listen(port, function() {
  console.log('Server is running at http://localhost:3000');
});
