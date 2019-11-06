const ControladorRestaurante = require('./Controladores/ControladorRestaurante')
var fs = require('fs');
var jsonTotales = ControladorRestaurante.totalesCortes()
var jsonAgrupados = ControladorRestaurante.agruparDatos()

fs.writeFile ("./resultados/jsonTotales.json", jsonTotales, function(err) {
  if (err) throw err;
  console.log('Terminado');
  }
);

fs.writeFile ("./resultados/jsonAgrupados.json", jsonAgrupados, function(err) {
  if (err) throw err;
  console.log('Terminado');
  }
);