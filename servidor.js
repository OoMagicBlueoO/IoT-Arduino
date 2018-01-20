const express = require("express");
const cinco= require("johnny-five");
const path = require("path");
const bodyParser = require("body-parser");

const app = express()
const circuito = new cinco.Board({port: "COM3"})
/*Codigo de servidor*/
var lucecita;
var bocina;
var temp;
var c;


app.get("/", home)
function home(request,response){
  response.sendFile(path.join( __dirname +"/control.html"));
}
app.get("/temperatura", temp)
function temp(request,response){
  response.send("Esta C alientito");
}

app.listen(9219, iniciar)
function iniciar(){
  console.log("ServerUP")
}
app.use(bodyParser.json());
app.post("/mensaje", mensaje);
function mensaje(req,res){
  var m = req.body.mensaje;
  iot_voz(m);
  res.send("ok");
}
/*Codigo de circuito*/
circuito.on("ready", electronica)
function electronica(){
   lucecita = new cinco.Led(13)
  var sensor = new cinco.Thermometer({
    controller: "LM35",
    pin: "A0"
  });
  //lucecita.on()
  sensor.on("data", actualizar)
  function actualizar(datos){
    console.log(datos.C)

  }
}
function iot_voz(voz){
  console.log("**"+voz+"**");
  if(
  	voz.search("google") != -1 && voz.search("encender") != -1
  	|| voz.search("google") != -1 &&  voz.search("enciende") !=-1
    || voz.search("google") != -1 &&  voz.search("prende") !=-1
    || voz.search("google") != -1 &&  voz.search("prender") !=-1
    ){
    lucecita.on();
  }
  else if(voz.search("google") != -1 && voz.search("apagar") != -1 || voz.search("google") != -1 &&  voz.search("apaga") != -1){
    lucecita.off();
    lucecita.stop();
  }

  else if(voz.search("google") != -1 && voz.search("fiesta") != -1 || voz.search("google") != -1 &&  voz.search("party") != -1){
    lucecita.strobe();
  }
}
