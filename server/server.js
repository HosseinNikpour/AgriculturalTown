const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
var fileupload = require("express-fileupload");
app.use(fileupload());


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors());


const REST_API_ROOT = '/api';
app.use(REST_API_ROOT, require('./routes/router'));

app.use(express.static(path.join(__dirname, '/Docs')));

// // Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

