const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.static('public'))
app.use(cors())
app.use(express.json())

const port = 8080
const jugadores = []
const combatesOnline = []
let ataquesPorPartida = 7

class Jugador {
    constructor(id , mokepon = null, ataques = []){
        this.id = id
        this.mokepon = mokepon
        this.ataques = ataques     
    }
}

class Combate {
    constructor(idJugador1, idJugador2 = "0000"){
        this.idJugador1 = idJugador1
        this.idJugador2 = idJugador2
        this.onlineJ1 = 1
        this.onlineJ2 = 1
    }
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function asignarEnemigo(idEntrante){ //Usa el array "combatesOnline" para ir creando las parejas de jugadores en combate.
    let idAsignado = 0
    const idNoDefinido = "0000"
    let idRespuesta = "x"
    
    if(combatesOnline.length > 0){
        combatesOnline.forEach((combate) => { 
            if(combate.idJugador1 === idEntrante){
                if(combate.idJugador2 != "0000"){
                    idAsignado = 1
                    idRespuesta = combate.idJugador2
                }
                else if(combate.idJugador2 == "0000"){
                    idAsignado = 1
                    idRespuesta = "0000"
                }
            }
            else if(combate.idJugador2 === idEntrante){
                idAsignado = 1
                idRespuesta = combate.idJugador1
            }
        })

        if(idAsignado == 0){
        ultimoIndex = combatesOnline.length-1
         if(combatesOnline[ultimoIndex].idJugador2 === "0000"){
            combatesOnline[ultimoIndex].idJugador2  = idEntrante
            //console.log(`Se definió combate No. ${ultimoIndex + 1} entre: ${combatesOnline[ultimoIndex].idJugador1} y ${combatesOnline[ultimoIndex].idJugador2}`)
            idRespuesta = combatesOnline[ultimoIndex].idJugador1
         }
         else {
            combateNuevo = new Combate(idEntrante)
            combatesOnline.push(combateNuevo)
            //console.log(`Se creo un nuevo objeto de combatesOnline con:  ${combatesOnline[ultimoIndex + 1].idJugador1} y ${combatesOnline[ultimoIndex + 1].idJugador2}`)
            idRespuesta = "0000"
            }
        }
    }
    else { //Si combatesOnline.lenght no es mayor a cero, va a crear el primer objeto de este array.
        combateNuevo = new Combate(idEntrante)
        combatesOnline.push(combateNuevo)
        //console.log(`Primer registro en combatesOnline con: ${combatesOnline[0].idJugador1} y ${combatesOnline[0].idJugador2}`)
        idRespuesta = "0000"
    }
    return idRespuesta
}

function borrarJugador(idSaliente){ //Esta funcion elimina del registro a los jugadores que no entraron en combate online y se detectó que terminaron o ya no están.

    const jugadorIndex = jugadores.findIndex((jugador) => idSaliente === jugador.id)
    if(jugadorIndex >= 0){
        jugadores.splice(jugadorIndex, 1)   
        console.log("Se borró del array jugadores[] al ID: " + idSaliente ) 
    }
}

function borrarJugadoresCombate(idSaliente){ //Esta función se hizo para borrar los jugadores que ya tubieron una ronda completa de los array jugadores[] y combatesOnline[]

    const jugador1Index = jugadores.findIndex((jugador) => idSaliente === jugador.id)
    let jugador2Index = null
    let idAdversario = null
    let indexCombates = null

    const jugadorEnCombate1Index = combatesOnline.findIndex((jugadorC1) => idSaliente === jugadorC1.idJugador1)
    const jugadorEnCombate2Index = combatesOnline.findIndex((jugadorC2) => idSaliente === jugadorC2.idJugador2)

    //console.log(`jugadorEnCombate1Index: ${jugadorEnCombate1Index} y jugadorEnCombate2Index: ${jugadorEnCombate2Index} `)

    if(jugadorEnCombate1Index >= 0){
        combatesOnline[jugadorEnCombate1Index].onlineJ1 = 0
        indexCombates = jugadorEnCombate1Index
        idAdversario = combatesOnline[jugadorEnCombate1Index].idJugador2
        jugador2Index = jugadores.findIndex((adversario) => idAdversario === adversario.id)
    }

    if(jugadorEnCombate2Index >= 0){
        combatesOnline[jugadorEnCombate2Index].onlineJ2 = 0
        indexCombates = jugadorEnCombate2Index
        idAdversario = combatesOnline[jugadorEnCombate2Index].idJugador1
        jugador2Index = jugadores.findIndex((adversario) => idAdversario === adversario.id)
    }

    if(combatesOnline[indexCombates].onlineJ1 == 0 && combatesOnline[indexCombates].onlineJ2 == 0){

        jugadores.splice(jugador1Index, 1)
        console.log("Se borró del array jugadores a jugador ID: " + idSaliente)
        jugadores.splice(jugador2Index, 1)
        console.log("Se borró del array jugadores a jugador ID: " + idAdversario)
        combatesOnline.splice(indexCombates, 1)
        console.log("Se borró del array combateOnline a jugador ID: " + idSaliente)
    }
    //console.log("El array combatesOnline quedó así: " + combatesOnline)
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

app.get("/unirse", (req, res)=>{
    const idAleatorio = `${Math.random()}` //Las comillas convierten el numero 0.xxxxx en una cadena de texto.
    const id = idAleatorio.slice(2, 6) //la función slice copia la cadena, pero en este caso slice(2) empieza desde el index 2 y va hasta el index 6. 
    jugador = new Jugador(id)
    jugadores.push(jugador)
    //res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id)
    console.log("Id online: " + id)
    //res.send(`Hola, mundo JS`)

    setTimeout(() => { // Despues de 5 minutos, borrará este id del registro.
        borrarJugador(id)
    }, 5 * 60 * 1000)

})

app.get("/jugadores", (req, res) => { //Va a responder la cantidad de jugadores online.
    res.json(jugadores.length)
})

app.post("/warkepon/:jugadorId/final", (req, res) => { //End point para que frontend reporte final de juego de jugador modo local.
    const jugadorId = req.params.jugadorId || ""
    const reporte = req.body.reporte || ""
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    if(jugadorIndex >= 0 && reporte == "finalizo"){       
        
        borrarJugador(jugadorId)
    }   
    res.end()
})

app.post("/warkepon/:jugadorId", (req, res) => { //End point para que frontend reporte la mascota que escogió el jugador.
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.mokepon || ""
    ataquesPorPartida = req.body.ataquesPorPartida

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    if(jugadorIndex >= 0){       
        jugadores[jugadorIndex].mokepon = nombre
        //jugadores[jugadorIndex].id = jugadorId //Creo que esta instrucción sobra.
        console.log(`Jugador ID: ${jugadores[jugadorIndex].id} reportó su mascota: ${jugadores[jugadorIndex].mokepon}`)
    }   
    res.end()
})

app.post("/warkepon/:jugadorId/subir_ataques", (req, res) => { //End point para que frontend reporte los ataques del jugador.
    const jugadorId = req.params.jugadorId || ""
    const ataque = req.body.ataque || ""
    const ronda = req.body.ronda
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if (jugadorIndex >= 0) {
        if (jugadores[jugadorIndex].ataques[ronda] !== 'TimeOut') {
            jugadores[jugadorIndex].ataques[ronda] = ataque
            //console.log(`Jugador ID: ${jugadores[jugadorIndex].id} subió ataque No ${ronda} con: ${jugadores[jugadorIndex].ataques[ronda]}`)
            res.json({ recibido: 'Ok' })
        } else {
            //console.log(`Jugador ID: ${jugadores[jugadorIndex].id} intentó subir ataque No ${ronda} pero fue marcado como TimeOut.`)
            res.json({ recibido: 'TimeOut' })
        }
    } else {
        res.status(404).json({ status: 'not found' })
    }
})

app.post("/warkepon/:enemigoId/bajar_ataques", async (req, res) => { //End point para que frontend pida los ataques del enemigo.
    const enemigoId = req.params.enemigoId || ""
    const ronda = req.body.ronda
    let ataqueEnemigoRonda = null
    const jugadorIndex = jugadores.findIndex((jugador) => enemigoId === jugador.id)

    if (jugadorIndex >= 0) {
        const startTime = Date.now()
        const timeout = 10000 // 10 segundos
        
        while (true) {

           ataqueEnemigoRonda = jugadores[jugadorIndex].ataques[ronda]

            if (ataqueEnemigoRonda !== undefined && ataqueEnemigoRonda !== null) {
                //console.log(`Enemigo ID: ${jugadores[jugadorIndex].id} bajó ataque con: ${ataqueEnemigoRonda} de la ronda No ${ronda}`)
                break;
            }

            if (Date.now() - startTime > timeout) {
                jugadores[jugadorIndex].ataques[ronda] = 'TimeOut'
                ataqueEnemigoRonda = 'TimeOut'
                //console.log(`Enemigo ID: ${jugadores[jugadorIndex].id} no atacó en el tiempo límite.`)
                break;
            }

            await delay(500) // Espera 500 ms antes de volver a comprobar
        }
    }
    
    res.json({ ataqueEnemigoRonda })

    if(ronda + 1 == ataquesPorPartida){
        //console.log("Se llamó a la función borrarJugadoresCombate.")
        borrarJugadoresCombate(enemigoId)
    }
})

app.post("/warkepon/:jugadorId/adversario", (req, res) => { //Endpoint para que el frontend pida un adversario online.
    const jugadorId = req.params.jugadorId || ""
    let enemigoIndex
    let resEnemigo
    let resId
    let resPares
    //console.log("Entró petición fetch de jugadorId: " + jugadorId)
    let enemigoId = asignarEnemigo(jugadorId)
    //console.log(`En el Endpoint cuando id Jugador: ${jugadorId} el enemigoId es: ${enemigoId}`)

    if(enemigoId === "0000"){
        console.log("Esperando la conexión de otro adversario online.")
        //Crear secuencia para enviar mokepon enemigo una vez ingrese alguien más.
        resEnemigo = "Esperando"
        resId = "0000"
        resPares = 1
    } else {
        //Enviar el mokepon adversario y el enemigoId al frontend.
        enemigoIndex = jugadores.findIndex((jugador) => enemigoId === jugador.id)
        //console.log("En petición fetch de: " + jugadorId + " el enemigoIndex es: " + enemigoIndex)

        if(enemigoIndex >= 0){
            //Envia nombre del mokepon enemigo, el id
            resEnemigo = jugadores[enemigoIndex].mokepon
            resId = enemigoId
            resPares = 2
        } else {
            resEnemigo = "No"
            resId = "0000"
            resPares = 1
            //console.log(`El jugador ${jugadorId} ingreso al else de enemigoIndex no encontrado...`)
        }
    } 
    res.json({ 
        enemigo: resEnemigo, 
        enemigoId: resId,
        pares: resPares 
    }) 
})

app.listen(port, ()=>{ //Si se agrega [ port, '0.0.0.0', () ] aceptará conoexiones IP en todas las interfaces de red. Esto se probó dado que en el navegador no abria mediante 127.0.0.1:8080, sin embargo esto es un riesgo de seguridad en una web online.
    console.log(`Servidor funcionando desde el puerto ${port}...`)
})
  