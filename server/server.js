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

//app.use(express.static(path.join(__dirname, 'client/build')));

// // Handles any requests that don't match the ones above
// app.get('*', (req,res) =>{
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });
app.use(cors());

// app.use(function (req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.headers['authorization'];
//     if (!token) return next(); //if no token, continue

//     token = token.replace('Bearer ', '');
//     jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
//         if (err) {
//             return res.status(401).json({
//                 error: true,
//                 message: "Invalid user."
//             });
//         } else {
//             req.user = user; //set the user to req so other routes can use it
//             next();
//         }
//     });
// });
const REST_API_ROOT = '/api';
app.use(REST_API_ROOT, require('./routes/router'));



const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

