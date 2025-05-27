const express = require ("express");
const router = express.Router();
const estudiantemodelo = require("../modelo/Estudiantemodelo.js");

router.get("/",estudiantemodelo.consultarDetalle);
router.post("/",estudiantemodelo.ingresar);

router.route("/:iden")
.get(estudiantemodelo.consultarDetalle);

module.exports = router;