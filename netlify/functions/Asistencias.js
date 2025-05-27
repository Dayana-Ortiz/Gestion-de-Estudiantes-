var express = require ("express");
var cors = require("cors");
var serverless = require ("serverless-http");
var port = process.env.PORT ||5000;
var app  = express(); 
var asistenciasroutes = require ("../../Backend/routes/asistenciasrutas.js");


app.use(express.json());
app.use(cors());

var router = express.Router();
router.use ("/asistencias",asistenciasroutes);

var handler = app.use ("/.netlify/funcions",router);
exports.handler = serverless(app);


