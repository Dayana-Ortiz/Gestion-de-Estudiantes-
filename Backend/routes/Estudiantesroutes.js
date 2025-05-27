const express = require ("express");
const router = express.Router();
const estudiantemodelo = require("../modelo/Estudiantemodelo.js");

router.get("/",estudiantemodel.consultarDetalle);
router.post("/",estudiantemodel.ingresar);

router.route("/:iden")
.get(estudiantemodel.consultarDetalle);

module.exports = router;