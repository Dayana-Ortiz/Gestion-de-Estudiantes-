var express = require ("express");
var cors = require("cors");
var serverless = require ("serverless-http");
var port = process.env.PORT ||5000;
var app  = express(); 
var departamentosroutes = require ("../../Backend/routes/Departamentosrutas.js");


app.use(express.json());
app.use(cors());

var router = express.Router();
router.use ("/departamentos",departamentosroutes);

var handler = app.use ("/.netlify/funcions",router);
exports.handler = serverless(app);


