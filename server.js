const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

const usageData = [];
fs.createReadStream('usage_data.csv')
  .pipe(csv())
  .on('data', (row) => usageData.push(row))
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

// API Endpoint to Get Usage Data
app.get('/api/usage', (req, res) => {
  res.json(usageData);
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
