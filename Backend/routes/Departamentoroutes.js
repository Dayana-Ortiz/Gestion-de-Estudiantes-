const express = require ("express");
const router = express.Router();
const departamentomodelo = require("../modelo/Departamentomodelo.js");

router.get("/",departamentomodelo.consultarDetalle);
router.post("/",departamentomodelo.ingresar);

router.route("/:iden")
.get(departamentomodelo.consultarDetalle);

module.exports = router;