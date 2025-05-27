const express = require ("express");
const router = express.Router();
const asignaturamodelo = require("../modelo/Asignaturamodelo.js");

router.get("/",asignaturamodel.consultarDetalle);
router.post("/",asignaturamodel.ingresar);

router.route("/:iden")
.get(asignaturamodel.consultarDetalle);

module.exports = router;