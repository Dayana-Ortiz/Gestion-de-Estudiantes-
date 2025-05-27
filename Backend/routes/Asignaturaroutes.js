const express = require ("express");
const router = express.Router();
const asignaturamodelo = require("../modelo/Asignaturamodelo.js");

router.get("/",asignaturamodelo.consultarDetalle);
router.post("/",asignaturamodelo.ingresar);

router.route("/:iden")
.get(asignaturamodelo.consultarDetalle);

module.exports = router;