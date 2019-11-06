const fs = require('fs')
var _ = require('underscore')
var ventas
var totalesCorte = []
const dolarMX = 18

function leerJSON(){    
    ventas = JSON.parse(fs.readFileSync('./recursos/dataset.json', 'utf-8'))
}

const totalesCortes = () =>{
        leerJSON();
        totalEfectivo = 0;
        totalDolares = 0;
        totalT_Credito = 0;
        totalAMEX = 0;
        totales = 0;
        propinas = 0;
        
        for (var corte in ventas) {
            if (ventas.hasOwnProperty(corte)) {
                for (var iter in ventas[corte]['ingresos']) {
                    if (ventas[corte]['ingresos'].hasOwnProperty(iter)) {
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'EFECTIVO') {
                            totalEfectivo += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                        }
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'DOLARES') {
                            totalDolares += ((ventas[corte]['ingresos'][iter]['cantidadOriginal']) * dolarMX)
                        }
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'T CREDITO') {
                            totalT_Credito += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                        }
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'AMEX') {
                            totalAMEX += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                        }
                    }
                    propinas += ventas[corte]['ingresos'][iter]['propinas']
                    totales += (totalEfectivo + totalDolares + totalT_Credito + totalAMEX)
                }
            }
            var registro = {
                'Corte': ventas[corte]['id'], 'totalEfectivo': totalEfectivo,
                'totalDolares': totalDolares, 'totalT_Credito': totalT_Credito,
                'totalAMEX': totalAMEX, 'Propina': propinas, 'Totales': totales
            };
            totalesCorte.push(registro);
            totalEfectivo = 0;
            totalDolares = 0;
            totalT_Credito = 0;
            totalAMEX = 0;
            propinas = 0;
            totales = 0;
        }
        totalesCorte = JSON.stringify(totalesCorte)
        return totalesCorte
    }

    function agruparDatos(){
        leerJSON();

        var groups = _.groupBy(ventas, function(value){
            return value.fechaFinal + '#' + value.usuario;
        });

        var  datosA= _.map(groups, function(group){
            return {
                fechaFinal: group[0].fechaFinal,
                usuario: group[0].usuario,
                AMEX : 0,
                DOLARES: 0,
                EFECTIVO: 0,
                T_CREDITO: 0,
                propinas: 0,
                gastos:0,
                ingresos: _.pluck(group, ['ingresos'][0])
            }
        });
        for (var corte in datosA) {
            if (datosA.hasOwnProperty(corte)) {
                for (var ingresos in datosA[corte]['ingresos'][0]) {
                    if (datosA[corte]['ingresos'].hasOwnProperty(ingresos)) {
                        for (var datos in datosA[corte]['ingresos'][0]) {
                            if (datosA[corte]['ingresos'][ingresos].hasOwnProperty(datos)) {
                                if (datosA[corte]['ingresos'][ingresos][datos]['moneda'] === 'EFECTIVO') {
                                    datosA[corte]['EFECTIVO'] += datosA[corte]['ingresos'][ingresos][datos]['cantidadOriginal']
                                }
                                if (datosA[corte]['ingresos'][ingresos][datos]['moneda'] === 'DOLARES') {
                                    datosA[corte]['DOLARES'] += ((datosA[corte]['ingresos'][ingresos][datos]['cantidadOriginal']) * dolarMX)
                                }
                                if (datosA[corte]['ingresos'][ingresos][datos]['moneda'] === 'T CREDITO') {
                                    datosA[corte]['T_CREDITO'] += datosA[corte]['ingresos'][ingresos][datos]['cantidadOriginal']
                                }
                                if (datosA[corte]['ingresos'][ingresos][datos]['moneda'] === 'AMEX') {
                                    datosA[corte]['AMEX'] += datosA[corte]['ingresos'][ingresos][datos]['cantidadOriginal']
                                }
                                datosA[corte]['propinas'] += datosA[corte]['ingresos'][ingresos][datos]['propinas']
                                datosA[corte]['gastos'] += datosA[corte]['ingresos'][ingresos][datos]['gastos']
                            }
                        }
                    }
                }
                datosA[corte]['ingresos'] = undefined
            }
        }
        datosA = JSON.stringify(datosA)
        return datosA
    }


module.exports = {
    totalesCortes,
    agruparDatos
}