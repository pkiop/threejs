const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.static('public'));
app.get('/glb', (req, res) => {
  res.send('glb');
});

app.listen(3030, () => {
  console.log('server on!');
});
