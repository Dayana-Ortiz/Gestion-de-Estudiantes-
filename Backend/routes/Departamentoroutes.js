const express = require ("express");
const router = express.Router();
const departamentomodelo = require("../modelo/Departamentomodelo.js");

router.get("/",departamentomodel.consultarDetalle);
router.post("/",departamentomodel.ingresar);

router.route("/:iden")
.get(departamentomodel.consultarDetalle);

module.exports = router;