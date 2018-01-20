const express = require("express")
const arduino = require("johnny-five")
const path = require("path")
const bodyParser = require("body-parser")
const canciones = require("j5-songs")

const app = express()
const circuito = new arduino.Board()

var lucecita, bocina;

/*
	CÓDIGO DEL SERVIDOR
*/

app.get("/", casita)
function casita(req, res) {
	res.sendFile( path.join( __dirname + "/interfaz.html" ) )
}

app.use(bodyParser.json())
app.post("/mensaje", mensaje)
app.get("/temperatura", temper)
app.listen(8000, iniciar)

function mensaje(req,res) {
	var m = req.body.voz
	iot_voz(m)
	res.send("ok")
}

function temper(req, res) {
	res.send("Está como calentito")
}

function iniciar() {
	console.log("Mi primer server :3")
}

/*
	CÓDIGO DEL CIRCUITO
*/

circuito.on("ready", electronica)
function electronica() {
	lucecita = new arduino.Led(13)
	var sensor = new arduino.Thermometer({
		controller: "LM35",
		pin: "A0"
	})

	bocina = new arduino.Piezo(9)

	lucecita.on()
	sensor.on("data", actualizar);
}

function iot_voz(voice)
{

	lucecita.stop();
	lucecita.off();
	console.log("**"+voice+"**");
	if(voice.search("encender") != -1 || voice.search("enciende") != -1)
	{
		lucecita.on()
	}
	if(voice.search("apagar") != -1 || voice.search("apaga") != -1)
	{
		lucecita.off()
	}
	if(voice.search("fiesta") != -1 || voice.search("rumba") != -1)
	{
		lucecita.strobe()
	}
	if(voice.search("canción") != -1)
	{
		bocina.play(canciones.load("beethovens-fifth"))
	}
	if(voice.search("soy tu padre") != -1)
	{
		bocina.play(canciones.load("starwars-theme"))
	}
	if(voice.search("rusia") != -1)
	{
		bocina.play(canciones.load("tetris-theme"))
	}


}

function actualizar(datos) {
	//console.log(datos.C)
}
