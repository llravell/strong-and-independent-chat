const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.listen(PORT, function () {
  console.log(`Server started on port: ${PORT}`);
});