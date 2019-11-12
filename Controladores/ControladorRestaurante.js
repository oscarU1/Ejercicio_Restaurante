const fs = require('fs')
var _ = require('underscore')
var ventas
var totalesCorte = {'totalEfectivo':0,'totalDolares':0,'totalTCredito':0,
                    'totalAmex':0, 'totalPropina':0, 'totalGastos':0, 'granTotal':0}
const dolarMX = 18

function leerJSON(){    
    ventas = JSON.parse(fs.readFileSync('./recursos/dataset.json', 'utf-8'))
}

const totalesCortes = () =>{
        leerJSON();
        
        for (var corte in ventas) {
            if (ventas.hasOwnProperty(corte)) {
                for (var iter in ventas[corte]['ingresos']) {
                    if (ventas[corte]['ingresos'].hasOwnProperty(iter)) {
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'EFECTIVO') {
                            totalesCorte['totalEfectivo'] += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                            totalesCorte['granTotal'] += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                        }
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'DOLARES') {
                            totalesCorte['totalDolares'] += ((ventas[corte]['ingresos'][iter]['cantidadOriginal']) * dolarMX)
                            totalesCorte['granTotal'] += ((ventas[corte]['ingresos'][iter]['cantidadOriginal']) * dolarMX)
                        }
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'T CREDITO') {
                            totalesCorte['totalTCredito'] += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                            totalesCorte['granTotal'] += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                        }
                        if (ventas[corte]['ingresos'][iter]['moneda'] === 'AMEX') {
                            totalesCorte['totalAmex'] += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                            totalesCorte['granTotal'] += ventas[corte]['ingresos'][iter]['cantidadOriginal']
                        }
                        
                        totalesCorte['totalPropina'] += ventas[corte]['ingresos'][iter]['propinas']
                        totalesCorte['granTotal'] += ventas[corte]['ingresos'][iter]['propinas']

                        totalesCorte['totalGastos'] += ventas[corte]['ingresos'][iter]['gastos']
                        totalesCorte['granTotal'] -= ventas[corte]['ingresos'][iter]['gastos']
                    }
                }
            }
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