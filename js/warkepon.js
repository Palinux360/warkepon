const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')
const botonModoJuego = document.getElementById('boton-modo')
const botonReiniciar = document.getElementById('boton-reiniciar')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVictoriasJugador = document.getElementById('victorias-jugador')
const spanVictoriasEnemigo = document.getElementById('victorias-enemigo')
const sectionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador') //Apunta al html a la class donde se muestra ataques del jugador.
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo') //Apunta al html a la class donde se muestra ataques del Enemigo.
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')
const contenedorModos = document.getElementById('contendorModos')
const sectionModosDeJuego = document.getElementById('modos-de-juego')
const tituloMascotas = document.getElementById('titulo-elige-mascota')
const tituloModo = document.getElementById('titulo-elige-modo')
const tituloAtaques = document.getElementById('titulo-elige-ataque')
const tituloRecorreMapa = document.getElementById('titulo-recorre-mapa')    
 
let ataqueJugador = [] //Guarda el ataque efectuado por el  Jugador en la ronda.
let ataqueEnemigo = []  //Guarda el ataque efectuado por el  Enemigo en la ronda.
let emojiAtaqueJugador = [] //Guarda el emoji del ataque efectuado por el  Jugador en la ronda, para usar en la animación.
let emojiAtaqueEnemigo = [] //Guarda el emoji del ataque efectuado por el  Enemigo en la ronda, para usar en la animación.
let opcionDeMokepones
let victoriasJugador = 0
let victoriasEnemigo = 0
let mokepones = []

let inputMascotaJugador
let botonFuego
let botonAgua
let botonTierra
let botones = []
let modoJuego = "local"

let ataquesMokepon //Sera usada para guardar la estructura de los botones de ataque en html
let seleccionOk = 0 
let ataquesDisponiblesJugador = [] //Variable para guardar en un arreglo los ataques disponibles del Mokepon Jugador.
let ataquesDisponiblesEnemigo = [] //Variable para guardar en un arreglo los ataques disponibles del Mokepon Enemigo.
let ataquesUsadosEnemigo = [] //Es un arreglo que se usa para saber cuales ataques del Enemigo aun no se han usado en la seleccion aleatoria en cada ronda.
let cantidadAtaquesEnemigo = 0
let ronda = 0
let ataquesPorPartida
let mokeponJugador //Va a guardar el objeto completo del Mokepon elegido por Jugador.
let mokeponEnemigo //Va a guardar el objeto completo del Mokepon Enemigo.
let imagenMokeponJugador = new Image()
let imagenMokeponEnemigo = new Image()

//Variables canvas Mapa
const sectionVerMapa = document.getElementById('ver-mapa')
const mapa = document.getElementById('canvas-mapa')
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackgroud1 = new Image()
let cargaInicialMapa = 0
let colision = 0

//Variables Canvas Combate
const sectionVerCombate = document.getElementById('ver-combate')
const mapaCombate = document.getElementById('canvas-combate')
let lienzoCombate = mapaCombate.getContext('2d')
let fondoCombate = new Image()

fondoCombate.src = './assets/fondo-combate.png'

//Sonidos
const sonidoBotonSeleccion = new Audio('./sounds/seleccion-mascota.mp3')
const sonidoAtaques = new Audio('./sounds/ataques.mp3')
const sonidoEmpate = new Audio('./sounds/empate.mp3')
const sonidoGanaste = new Audio('./sounds/ganaste.mp3')
const sonidoPerdiste = new Audio('./sounds/perdiste.mp3')

//Online
let jugadorId = null
let enemigoOnlineId = null
let enemigosConectados = 0
let enemigoOnline 
let pares = 0
let intervaloEnemigoOnline
let botonesAtaqueOn = 0
let ataqueEnemigoRecibido = 1

class Mokepon { //Con este método construimos una clase que luego nos sirve de "plantilla" para construir objetos. Las clases van con mayuscula en la primera letra.

    constructor(nombre, foto, xPedestal, yPedestal, xMapa, yMapa){ //Debe llevar la palabra reservada "constructor" y luego los parametros.

        this.nombre = nombre
        this.foto= foto
        this.ataques = [] //Este va a ser el arreglo para introducir los ataques de los mokepones. No se define como un parámetro a ingresar en el paréntesis de constructor (), porque la forma de "inyectar" datos a un arreglo es con el método .push(), lo cual se hará fuera de la clase.
        this.x = xPedestal
        this.y = yPedestal
        this.x2 = xMapa
        this.y2 = yMapa
        this.ancho = 80
        this.alto = 80
        this.mapaFoto = new Image()
        this.mapaFoto.src = foto
        this.velocidadX = 0
        this.velocidadY = 0
    }

    dibujarMokepon(){

        lienzo.drawImage(
            this.mapaFoto, 
            this.x2, 
            this.y2, 
            this.ancho, 
            this.alto
        )

    }

}
//Como agregar una nueva mascota al juego:
//1. Define una variable con el nombre para creaer el objeto con la clase Mokepon()
//2. Inyecta con push() los ataques de la nueva mascota en el arreglo nombreDelMokepon.ataques.push({nombre,id})
//3. Agrega manualmente el nombre de la nueva mascota al arreglo mokepones.push(hipodoge, capipepo, ratigueya, langostelvis, tucapalma, pydos, nuevaMascota)
//4. Luego, para que los nuevos personajes sean dibujados en el mapa (Caverna de Enemigos), hay que llamarles su método .dibujarMokepon() en la function dibujarMapa()
//5. Luego en la function dibujarMapa, se debe agregar los if() correspondientes para detectar las colisiones.

//Estas instrucciones crean un objeto de acuerdo a la clase "Mokepon". 
let hipodoge = new Mokepon('Hipodoge', './assets/hipodoge.png', 160, 55, 410, 290)  
let capipepo = new Mokepon('Capipepo', './assets/capipepo.png', 160, 55, 170, 210)
let ratigueya = new Mokepon('Ratigueya', './assets/ratigueya.png', 160, 55, 5, 180)
let langostelvis = new Mokepon('Langostelvis', './assets/langostelvis.png', 160, 55, 345, 5)
let tucapalma = new Mokepon('Tucapalma', './assets/tucapalma.png', 160, 55, 15, 20)
let pydos = new Mokepon('Pydos', './assets/pydos.png', 160, 55, 70, 290)
let thoreon = new Mokepon('Thoreon', './assets/lyonsgard.png', 160, 55, 310, 290)
let gokurry = new Mokepon('Gokurry', './assets/gokurry.png', 160, 55, 430, 140)
let aerokrip = new Mokepon('Aerokrip', './assets/aerokrip.png', 160, 55, 250, 210)
let esperando = new Mokepon('Esperando', './assets/esperando.png') //Este no se inyecta en el arreglo de mokepones. Es solo para usar en el proceso de espera online.
//En hipodoge.ataques -> va a estar el arreglo definido en la clase. Con push() le inyectamos la información deseada, en este caso los ataques.
hipodoge.ataques.push(
    {nombre: '💧', id: 'boton-agua'}, //Aqui nombre, no es el mismo nombre de la clase. Es un elemento nuevo y le estamos asignando un texto, que en este caso es un emoji. 
    {nombre: '💧', id: 'boton-agua'}, //Aqui nombre -> se usa para indicar el nombre del ataque. El id, es el correspondiente a ese boton de ataque en html.
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '⚡', id: 'boton-electron'},
)
capipepo.ataques.push(
    {nombre: '🪨', id: 'boton-tierra'}, 
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '🔥', id: 'boton-fuego'} 
)
ratigueya.ataques.push(
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '💧', id: 'boton-agua'}, 
    {nombre: '🪨', id: 'boton-tierra'}
)
langostelvis.ataques.push(
    
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '💨', id: 'boton-aire'},  
)
tucapalma.ataques.push(
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '🪨', id: 'boton-tierra'}
)
pydos.ataques.push(
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '💧', id: 'boton-agua'}, 
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '🪨', id: 'boton-tierra'},  
)
thoreon.ataques.push(
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '🪨', id: 'boton-tierra'},
    {nombre: '💨', id: 'boton-aire'},  
    {nombre: '💧', id: 'boton-agua'},
)
gokurry.ataques.push(
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '💨', id: 'boton-aire'},
    {nombre: '💧', id: 'boton-agua'}
)
aerokrip.ataques.push(
    {nombre: '🪨', id: 'boton-tierra'}, 
    {nombre: '🪨', id: 'boton-tierra'}, 
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '⚡', id: 'boton-electron'},
    {nombre: '💨', id: 'boton-aire'}, 
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🔥', id: 'boton-fuego'},
)
//La estructura anterior, desde la definición de una variable a la que despues se le asigna = new Mokepon(nombre, foto, vida), 
// mas la definición de los ataques, que se introducen en el arreglo -> .ataques a través de push()
//estamos creando todo el codigo necesario para crear personajes. Si se fueran a crear otros, se debe repetir la secuencia aqui.

//Luego que todos los personajes han sido creados, es necesario agruparlos en una sola variable (mokepones) que será usada posteriormente, 
//en este caso en la función iniciarJuego.

mokepones.push(hipodoge, capipepo, ratigueya, langostelvis, tucapalma, pydos, thoreon, gokurry, aerokrip) //Aqui estamos inyectando las mascotas en un arreglo que será usado más adelante.
ataquesPorPartida = mokepones[0].ataques.length //De acuerdo a la cantidad de ataques, devuelve la cantidad de juegos por partida. 

function iniciarJuego() {
   
    tituloAtaques.style.display = 'none'
    sectionSeleccionarAtaque.style.display = 'none'
    tituloModo.style.display='none'
    tituloRecorreMapa.style.display = 'none'
    sectionModosDeJuego.style.display='none'
    sectionReiniciar.style.display = 'none'   
    sectionVerMapa.style.display = 'none'
    seleccionOk = 0 

    mokepones.forEach((mokepon) => { // Este método define -> Por cada uno de los elementos de este arreglo (mokepones) has algo ->

        // Las comillas invertidas e utilizan para crear cadenas de texto en lo que se conoce como "plantillas de cadenas de texto" o "template literals". 
        //Estas plantillas te permiten crear cadenas de texto que pueden contener, código para incrustar en html.
        //console.log(mokepon)
        
            opcionDeMokepones = `
            <input type="radio" name="mascota" id=${mokepon.nombre} />
            <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
                <p>${mokepon.nombre}</p>
                <img src=${mokepon.foto} alt=${mokepon.nombre}>
            </label>     
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones //Aqui estoy enviando al html el arreglo que se definió en opcionDeMokepones. 
        }                                                     // El += permite que se "imprima" todo el contenido del arreglo. 
                                                        //Si se dejara solo un =, traería solamente el ultimo valor ingresado al arreglo.
    )
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)   
    botonModoJuego.addEventListener('click', seleccionarModoJuego)
    botonReiniciar.addEventListener('click', reiniciarJuego)
    unirseAlJuegoOnline() //Para pedir el id online a tiempo...
       
}

function seleccionarMascotaJugador() {
 
    let i = mokepones.length - 1 //Traemos la cantidad de objetos en el array "mokepones" donde estan todos los Mokepones disponibles y le restamos 1 para usarlo en un ciclo que se repertirá ('cantidad' - 1) veces. Porque el array comienza dessde 0.
        
    while (i>=0){

        inputMascotaJugador = document.getElementById(mokepones[i].nombre) //Apunta dinamicamente a los botones de mascotas por seleccionar.
        
        if(inputMascotaJugador.checked){ //Verifica que el boton haya sido checked; si es 'true' ejecuta la secuencia para definir la mascota seleccionada por el jugador.

            sonidoBotonSeleccion.play()
            tituloMascotas.style.display = 'none'
            sectionSeleccionarMascota.style.display = 'none'  //Apaga section Mascotas (porque ya se eligió).
            tituloModo.style.display = 'flex'
            sectionModosDeJuego.style.display = 'flex' 
            
           // spanMascotaJugador.innerHTML = mokepones[i].nombre //Para imprimir luego en el html.
            
            mokeponJugador = mokepones[i] //Guarda el objeto de Mokepon Jugador para usar en otras partes del código.
            reportarMokeponJugador(mokeponJugador.nombre) //Llamada a la función de avisar al servidor el Id y el Mokepon seleccionado por el jugador.
            i = -1 //Le asigno -1 para que se salga del ciclo while.
            seleccionOk = 1
            ataquesDisponiblesJugador = extraerAtaques(mokeponJugador.nombre) //Guarda el arreglo con los ataques que tiene el Mokepon seleccionado.
            cantidadJugadoresOnline()

        }
        else{
            i--
        }
    
    }
    if(seleccionOk==0){ 
    alert('Selecciona una mascota')

   } 
         
}

//El nombre de esta variable del JSON es decir "mokepon", debe ser usado igual en el backend.
function seleccionarModoJuego(){
      
    let inputEnemigoAleatorio = document.getElementById('enemigo-aleatorio')
    let inputMapaEnemigos = document.getElementById('mapa-enemigos')
    let inputEnemigoOnline =document.getElementById('enemigo-online')

    if (inputEnemigoAleatorio.checked) {
      
        //Los siguientes elementos podrian estar en una funcion.
        sonidoBotonSeleccion.play()
        tituloModo.style.display = 'none'
        sectionModosDeJuego.style.display = 'none'
        tituloAtaques.style.display = 'flex'
        sectionSeleccionarAtaque.style.display = 'flex'  //Enciende section Ataques, para continuar con el juego.
        sectionVerCombate.style.display = 'flex'
        mostrarAtaques (ataquesDisponiblesJugador) //Se llama a la funcion que va a mostrar los botones de ataques del Jugador.
        seleccionarMascotaEnemigo("aleatorio")
        dibujarMapaCombate()
        secuenciaAtaque ("local") //Es la funcion que permite al jugador ir seleccionando sus ataques de acuerdo a los botones en pantalla.
                    
    } 
    else if (inputMapaEnemigos.checked) {
        sonidoBotonSeleccion.play()
        tituloModo.style.display = 'none'
        sectionModosDeJuego.style.display = 'none'
        tituloRecorreMapa.style.display = 'flex'
        sectionVerMapa.style.display = 'flex'
        iniciarMapa()   
    }
    else if (inputEnemigoOnline.checked) {

        if(enemigosConectados == 0){
            cantidadJugadoresOnline()
            alert("No hay enemigos online en este momento. Intenta más tarde.")
        }
        else {
            modoJuego = "online"
            tituloModo.style.display = 'none'
            sectionModosDeJuego.style.display = 'none'
            sonidoBotonSeleccion.play()    
            pedirAdversarioAlServidor()
           
        }
    } 
    else {
        alert('Selecciona un modo de juego para continuar.')
    }
}

function mostrarAtaques (ataques){

    if(botonesAtaqueOn == 0){

        ataques.forEach((ataque) => {

            ataquesMokepon = `
            <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
            `
            contenedorAtaques.innerHTML += ataquesMokepon
        })
        botones = document.querySelectorAll('.BAtaque')
        botonesAtaqueOn = 1
    }   
}

function secuenciaAtaque(modo){ //modo espera una de dos opciones: "local" y "online". Define la forma de pedir los ataques del enemigo.

    if(pares == 0 || pares == 2){// Pares inicia en 0 y es cambiado desde el servidor cuando hay pareja de combate definida, entonces pares = 2. Cuando pares = 1, muestra los botones pero no "funcionan."

            botones.forEach((boton) => {
                boton.addEventListener('click', (e) => {
            
                    if(e.target.textContent === '🔥'&& ataqueEnemigoRecibido == 1){
                        emojiAtaqueJugador.push('🔥')
                        ataqueJugador.push('FUEGO')
                        //console.log(ataqueJugador)
                        boton.style.background = '#0c192b' //Cambia el color del fondo del botón
                        boton.style.border = 'none'
                        boton.disabled = true
                    } 
                    else if (e.target.textContent === '💧' && ataqueEnemigoRecibido == 1){
                        ataqueJugador.push('AGUA')
                        emojiAtaqueJugador.push('Ô')
                        //console.log(ataqueJugador)
                        boton.style.background = '#0c192b' //Cambia el color del fondo del botón
                        boton.style.border = 'none'
                        boton.disabled = true
                    }
                    else if (e.target.textContent === '🪨' && ataqueEnemigoRecibido == 1){
                        emojiAtaqueJugador.push('🪨')
                        ataqueJugador.push('TIERRA')
                        //console.log(ataqueJugador)
                        boton.style.background = '#0c192b' //Cambia el color del fondo del botón
                        boton.style.border = 'none'
                        boton.disabled = true
                    }
                    else if (e.target.textContent === '💨' && ataqueEnemigoRecibido == 1){
                        emojiAtaqueJugador.push('💨')
                        ataqueJugador.push('VIENTO')
                        //console.log(ataqueJugador)
                        boton.style.background = '#0c192b' //Cambia el color del fondo del botón
                        boton.style.border = 'none'
                        boton.disabled = true
                    }
                    else if (e.target.textContent === '⚡' && ataqueEnemigoRecibido == 1){
                        emojiAtaqueJugador.push('⚡')
                        ataqueJugador.push('RAYO')
                        //console.log(ataqueJugador)
                        boton.style.background = '#0c192b' //Cambia el color del fondo del botón
                        boton.style.border = 'none'
                        boton.disabled = true
                    }
            
                    if(modo == "local"){
                        ataqueAleatorioEnemigo()
                    }
                    else if(modo == "online" && ataqueEnemigoRecibido == 1){
                        reportarAtaqueOnline()
                        pedirAtaqueOnlineEnemigo()
                    }
                    
                })
            })          
    }

}

function extraerAtaques(nombre){ //Permite extaer los ataques correspondientes de la macota "nombre", retornando el arreglo con los respectivos ataques.

    let ataquesMascota 
    for (let i = 0; i < mokepones.length; i++) {
        if(nombre == mokepones[i].nombre){
            ataquesMascota = mokepones[i].ataques
        }
    }
    return ataquesMascota
}

function seleccionarMascotaEnemigo(modo) { //El parámetro 'modo' espera uno de dos argumentos en texto: "aleatorio", "mapa".
    
   
    if(modo == "aleatorio"){
 
        let mascotaAleatoria = aleatorio(0, mokepones.length-1) //Dado que va a seleccionar un numero para luego escoger de un array, comenzamos desde el 0 hasta ( cantidad de indices - 1)
        //spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatoria].nombre //Imprime el nombre del Mokepon Enemigo en el html
        mokeponEnemigo = mokepones[mascotaAleatoria] //Guarda el objeto de Mokepon enemigo para usar en otras partes del código.

         //Luego de que se haya seleccionado la mascota Enemigo -> hay que extraer sus ataques e inicializar el arreglo de verificación de ataques usados
    //ataquesDisponiblesEnemigo = extraerAtaques(mokeponEnemigo.nombre) //Guarda en un arreglo " ataquesDisponiblesEnemigo" los ataques del Mokepon Enemigo.        
    }
    else if (modo == "mapa"){

        apagarTecladoMapa()
         //Luego de que se haya seleccionado la mascota Enemigo -> hay que extraer sus ataques e inicializar el arreglo de verificación de ataques usados
    //ataquesDisponiblesEnemigo = extraerAtaques(mokeponEnemigo.nombre) //Guarda en un arreglo " ataquesDisponiblesEnemigo" los ataques del Mokepon Enemigo.            
    }

    ataquesDisponiblesEnemigo = extraerAtaques(mokeponEnemigo.nombre) //Guarda en un arreglo " ataquesDisponiblesEnemigo" los ataques del Mokepon Enemigo.  
    let n = ataquesDisponiblesEnemigo.length
    for (i = 0; i<n ; i++) {
       ataquesUsadosEnemigo.push(1)  // Cuando el enemigo "escoje" mascota, se inicializa el arreglo -> ataquesUsadosEnemigo, así [1, 1, ... , n]
   } 

}

function ataqueAleatorioEnemigo() { 
    let n = ataquesDisponiblesEnemigo.length-cantidadAtaquesEnemigo
    let saltos = 0
    let saltosAleatorio = aleatorio(1, n)
    let ciclos = ataquesDisponiblesEnemigo.length 

    for(i=0; i<=ciclos; i++){
       
            if(ataquesUsadosEnemigo[i] == 1){
            saltos++
            if(saltosAleatorio == saltos){
                ataquesUsadosEnemigo[i] = 0
                cantidadAtaquesEnemigo++
                //En esta parte vamos a cambiar el emoji encontrado "ataquesDisponiblesEnemigo[i].nombre" por el nombre en letras, para guardarlos en el arreglo "ataqueEnemigo"
               
                if(ataquesDisponiblesEnemigo[i].nombre == '🔥'){
                    emojiAtaqueEnemigo.push('🔥')
                    ataqueEnemigo.push('FUEGO')
                } 
                else if(ataquesDisponiblesEnemigo[i].nombre == '💧'){
                    emojiAtaqueEnemigo.push('Ô')
                    ataqueEnemigo.push('AGUA')
                }
                else if(ataquesDisponiblesEnemigo[i].nombre == '🪨'){
                    emojiAtaqueEnemigo.push('🪨')
                    ataqueEnemigo.push('TIERRA')
                } 
                else if(ataquesDisponiblesEnemigo[i].nombre == '💨'){
                    emojiAtaqueEnemigo.push('💨')
                    ataqueEnemigo.push('VIENTO')
                } 
                else if(ataquesDisponiblesEnemigo[i].nombre == '⚡'){
                    emojiAtaqueEnemigo.push('⚡')
                    ataqueEnemigo.push('RAYO')
                }
                //ataqueEnemigo.push(ataquesDisponiblesEnemigo[i].nombre) -> Esta instrucción ingresaría al arreglo "ataqueEnemigo" la secuencia de emojis en ves de nombres.
                i = ciclos + 1
            }
        }
    }
    combate()
}

function combate() {

    sonidoAtaques.play()
    
        if(ataqueEnemigo[ronda] == 'TimeOut') {
            crearMensaje("Ganaste esta ronda.")
            victoriasJugador++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], '', "jugador")  
        }

        if(ataqueJugador[ronda] == 'TimeOut') {
            crearMensaje("Perdiste esta ronda por TimeOut.")
            victoriasEnemigo++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate('', emojiAtaqueEnemigo[ronda], "enemigo")  
        }

        if(ataqueJugador[ronda] == ataqueEnemigo[ronda]) {
            crearMensaje("Ronda empatada...")
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "empate")
            
        } 
        //Opciones del ataque FUEGO.
        else if(ataqueJugador[ronda] == 'FUEGO' && (ataqueEnemigo[ronda] == 'TIERRA'|| ataqueEnemigo[ronda]==='VIENTO')) {
            crearMensaje("Ganaste esta ronda.")
            
            victoriasJugador++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "jugador")
            //spanVictoriasJugador.innerHTML = victoriasJugador
        } 
        else if(ataqueJugador[ronda] == 'FUEGO' && (ataqueEnemigo[ronda] == 'AGUA'|| ataqueEnemigo[ronda]==='RAYO')) {
            crearMensaje("Perdiste esta ronda.")
            
            victoriasEnemigo++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "enemigo")
            //spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
        //Opciones del ataque AGUA.
        else if(ataqueJugador[ronda] == 'AGUA' && (ataqueEnemigo[ronda] == 'FUEGO'|| ataqueEnemigo[ronda]==='RAYO')) {
            crearMensaje("Ganaste esta ronda.")
            
            victoriasJugador++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "jugador")
            //spanVictoriasJugador.innerHTML = victoriasJugador
        } 
        else if(ataqueJugador[ronda] == 'AGUA' && (ataqueEnemigo[ronda] == 'TIERRA'|| ataqueEnemigo[ronda]==='VIENTO')) {
            crearMensaje("Perdiste esta ronda.")
            
            victoriasEnemigo++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "enemigo")
            //spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
        //Opciones del ataque TIERRA.
        else if(ataqueJugador[ronda] == 'TIERRA' && (ataqueEnemigo[ronda] == 'AGUA'|| ataqueEnemigo[ronda]==='VIENTO')) {
            crearMensaje("Ganaste esta ronda.")
            
            victoriasJugador++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "jugador")
            //spanVictoriasJugador.innerHTML = victoriasJugador
        } 
        else if(ataqueJugador[ronda] == 'TIERRA' && (ataqueEnemigo[ronda] == 'FUEGO'|| ataqueEnemigo[ronda]==='RAYO')) {
            crearMensaje("Perdiste esta ronda.")
            
            victoriasEnemigo++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "enemigo")
            //spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
         //Opciones del ataque VIENTO.
         else if(ataqueJugador[ronda] == 'VIENTO' && (ataqueEnemigo[ronda] == 'AGUA'|| ataqueEnemigo[ronda]==='RAYO')) {
            crearMensaje("Ganaste esta ronda.")
            
            victoriasJugador++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "jugador")
            //spanVictoriasJugador.innerHTML = victoriasJugador
        } 
        else if(ataqueJugador[ronda] == 'VIENTO' && (ataqueEnemigo[ronda] == 'FUEGO'|| ataqueEnemigo[ronda]==='TIERRA')) {
            crearMensaje("Perdiste esta ronda.")
            
            victoriasEnemigo++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "enemigo")
            //spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
        //Opciones del ataque RAYO.
        else if(ataqueJugador[ronda] == 'RAYO' && (ataqueEnemigo[ronda] == 'TIERRA'|| ataqueEnemigo[ronda]==='FUEGO')) {
            crearMensaje("Ganaste esta ronda.")
            
            victoriasJugador++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "jugador")
           //spanVictoriasJugador.innerHTML = victoriasJugador
        } 
        else if(ataqueJugador[ronda] == 'RAYO' && (ataqueEnemigo[ronda] == 'VIENTO'|| ataqueEnemigo[ronda]==='AGUA')) {
            crearMensaje("Perdiste esta ronda.")
            
            victoriasEnemigo++
            dibujarMapaCombate()
            textoAtaquesCombate()
            animacionCombate(emojiAtaqueJugador[ronda], emojiAtaqueEnemigo[ronda], "enemigo")
            //spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
    ronda++
    revisarVictorias()
} 

function animacionCombate(ataqueRondaJugador, ataqueRondaEnemigo, ganador) {
    let desplazamientoX = 0;
    lienzoCombate.font = 'normal 18px Arial';
    lienzoCombate.fillStyle = 'white';
    repeticiones = 22
    
    function drawEmoji() {
        setTimeout(() => {
        
            if(desplazamientoX <= 100){

                lienzoCombate.fillText(ataqueRondaJugador, 80 + desplazamientoX, 80) 
                lienzoCombate.fillText(ataqueRondaEnemigo, 300 - desplazamientoX, 75)
                //console.log("Desplazamiento X primera parte y empates = ", desplazamientoX)

            }
            if(desplazamientoX == 100 && ganador == "empate"){
                lienzoCombate.font = 'bold 18px Arial'
                lienzoCombate.fillStyle = 'red'
                lienzoCombate.fillText("⮯", 92 + desplazamientoX, 85) 
                lienzoCombate.fillText("⮬", 301 - desplazamientoX, 70)    
            }

                       
            if(desplazamientoX > 100 && ganador == "jugador"){

            lienzoCombate.fillText(ataqueRondaJugador, 80 + desplazamientoX, 80) 
            //console.log("Desplazamiento X ganador Jugador = ", desplazamientoX)
           

            }
            else if(desplazamientoX > 100 && ganador == "enemigo"){
                lienzoCombate.fillText(ataqueRondaEnemigo, 300 - desplazamientoX, 75)
                //console.log("Desplazamiento X ganador Enemigo = ", desplazamientoX)
            }
            //Revisión de último ciclo:
            if(desplazamientoX == repeticiones*10 && ganador == "jugador"){

                lienzoCombate.fillStyle = 'black'
                lienzoCombate.fillText(" ⮞", 90 + desplazamientoX, 80)
               
                }
                else if(desplazamientoX == repeticiones*10 && ganador == "enemigo"){
                lienzoCombate.fillStyle = 'black'
                lienzoCombate.fillText("⮜", 296 - desplazamientoX, 75)
                }


            desplazamientoX += 10
            if (desplazamientoX <= repeticiones*10) { 
                drawEmoji() // Llamada recursiva para la siguiente iteración
            }
        }, 10) // Retardo de 10 ms entre cada iteración
    }
    
    drawEmoji() // Comenzar la animación
  
}


 function revisarVictorias() {

    if(ronda == ataquesPorPartida){

        if(modoJuego == "local"){
            reportarFinalJuego()
            console.log("Se reportó al servidor salida del ID: " + jugadorId)
        }

        if (victoriasEnemigo == victoriasJugador) {
            crearMensajeFinal("FIN DEL JUEGO => 🍻 EMPATE.")
            sonidoEmpate.play()
        } 
        else if (victoriasEnemigo < victoriasJugador) {
            crearMensajeFinal("FIN DEL JUEGO => 🏆 GANASTE!")
            sonidoGanaste.play()
        }
        else if (victoriasEnemigo > victoriasJugador) {
            sonidoPerdiste.play()
            crearMensajeFinal('FIN DEL JUEGO => 😠 PERDISTE.')
        }
    }    
}

function crearMensaje(resultado) {
 
    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')
    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = ataqueJugador[ronda]
    nuevoAtaqueDelEnemigo.innerHTML = ataqueEnemigo[ronda]

    //ataquesDelJugador.appendChild(nuevoAtaqueDelJugador) //Esta es la instrucción que permite "imprimir" en el html el ataque que selecciono el jugador.
    //ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo) //Esta es la instrucción que permite "imprimir" en el html el ataque que selecciono el enemigo.
}

function crearMensajeFinal(resultadoFinal) {
   
    sectionMensajes.innerHTML = resultadoFinal
    sectionReiniciar.style.display = 'block' //Permite mostrar el boton reiniciar cuando se acabó el juego.
}

function dibujarMapaCombate(){
    //console.log("Mokepon enemigo = " + mokeponEnemigo.nombre)
    imagenMokeponJugador.src = mokeponJugador.foto
    imagenMokeponEnemigo.src = mokeponEnemigo.foto 
    mapaCombate.width = 400
    mapaCombate.height = 160
    lienzoCombate.drawImage(fondoCombate, 0, 0, mapaCombate.width, mapaCombate.height)
    lienzoCombate.drawImage(imagenMokeponJugador, 20, 50, 80, 80)
    lienzoCombate.drawImage(imagenMokeponEnemigo, 300, 50, 80, 80)
    lienzoCombate.font = 'normal 16px Arial'
    lienzoCombate.fillStyle = 'white'
    lienzoCombate.fillText(mokeponJugador.nombre, 10, 25)
    lienzoCombate.fillText(mokeponEnemigo.nombre, 265, 25)
    lienzoCombate.fillText(victoriasJugador, 121, 25 )
    lienzoCombate.fillText(victoriasEnemigo, 373, 25 )
}

function textoAtaquesCombate(){

    lienzoCombate.font = 'bold 14px Arial'
    lienzoCombate.fillStyle = '#a50cac'
    lienzoCombate.fillText(ataqueJugador[ronda], 120, 130)
    lienzoCombate.fillText(ataqueEnemigo[ronda], 210, 130)
}

function dibujarMapa(){

    mapaBackgroud1.src = './assets/mapa-tierra.png'

    if(mokeponJugador.velocidadX !== 0 || mokeponJugador.velocidadY !== 0 || cargaInicialMapa <= 1){ //Esto para evitar el bucle infinito que produce la función "setInterval() en iniciarMapa()" -> Solo redibuja cuando hay movimiento (velocidadX o Y > 0) y en la carga inicial.

        mokeponJugador.x = mokeponJugador.x + mokeponJugador.velocidadX
        mokeponJugador.y = mokeponJugador.y + mokeponJugador.velocidadY
        //lienzo.clearRect(0, 0, mapa.width, mapa.height) //Esta función "limpia" el lienzo, sin embargo como siempre se está volviendo a dibujar el fondo, no es necesario borrar antes.
        lienzo.drawImage(mapaBackgroud1, 0, 0, mapa.width, mapa.height)
        hipodoge.dibujarMokepon()
        capipepo.dibujarMokepon()
        ratigueya.dibujarMokepon()
        langostelvis.dibujarMokepon()
        tucapalma.dibujarMokepon()
        pydos.dibujarMokepon()
        thoreon.dibujarMokepon()
        gokurry.dibujarMokepon()
        aerokrip.dibujarMokepon()
        lienzo.drawImage(mokeponJugador.mapaFoto, mokeponJugador.x, mokeponJugador.y, mokeponJugador.ancho, mokeponJugador.alto)
        cargaInicialMapa = cargaInicialMapa + 1

        if(revisarColisiones(hipodoge) == 1){

            mokeponEnemigo = hipodoge
            continuarJuego()
        }
        else if(revisarColisiones(capipepo) == 1){

            mokeponEnemigo = capipepo
            continuarJuego()
        }
        else if(revisarColisiones(ratigueya) == 1){
            mokeponEnemigo = ratigueya
            continuarJuego()
        }
        else if(revisarColisiones(langostelvis) == 1){
            mokeponEnemigo = langostelvis
            continuarJuego()
        }
        else if(revisarColisiones(tucapalma) == 1){
            mokeponEnemigo = tucapalma
            continuarJuego()
        }
        else if(revisarColisiones(pydos) == 1){
            mokeponEnemigo = pydos
            continuarJuego()
        }
        else if(revisarColisiones(thoreon) == 1){
            mokeponEnemigo = thoreon
            continuarJuego()
        }
        else if(revisarColisiones(gokurry) == 1){
            mokeponEnemigo = gokurry
            continuarJuego()
        }
        else if(revisarColisiones(aerokrip) == 1){
            mokeponEnemigo = aerokrip
            continuarJuego()
        }
    }  
}

function apagarTecladoMapa(){//Para evitar que la función iniciarMapa() siga escuchando los enventos de teclado.
 
    window.removeEventListener('keydown', clearInterval(intervalo) )
    
}

function continuarJuego(){ //Para continuar el juego cuando Jugador seleccionó mascota en el mapa.

    sectionVerMapa.style.display = 'none'
    tituloRecorreMapa.style.display = 'none'
    tituloAtaques.style.display = 'flex'
    sectionSeleccionarAtaque.style.display = 'flex'  //Enciende section Ataques, para continuar con el juego.
    sectionVerCombate.style.display = 'flex'
    mostrarAtaques(ataquesDisponiblesJugador) //Se llama a la funcion que va a mostrar los botones de ataques del Jugador.
    seleccionarMascotaEnemigo("mapa")
    dibujarMapaCombate()
    secuenciaAtaque ("local") //Es la funcion que permite al jugador ir seleccionando sus ataques de acuerdo a los botones en pantalla.
}

function continuarJuegoOnline(){ //Para continuar el juego cuando servidor confirmó un enemigo.

    tituloAtaques.style.display = 'flex'
    sectionSeleccionarAtaque.style.display = 'flex'  //Enciende section Ataques, para continuar con el juego.
    sectionVerCombate.style.display = 'flex'
    mostrarAtaques(ataquesDisponiblesJugador) //Se llama a la funcion que va a mostrar los botones de ataques del Jugador.
    dibujarMapaCombate()
    secuenciaAtaque("online")
}

function iniciarMapa(){
    mapa.width = 500
    mapa.height = 375
    mokeponJugador.x = 160 //Para posicionar el Mokepon Jugador en el pedestal del Mapa.
    mokeponJugador.y = 55 //Para posicionar el Mokepon Jugador en el pedestal del Mapa.
    intervalo = setInterval(dibujarMapa, 50) //Crea un intervalo para ejecutar la función "dibujarMokeponJugador" cada 50 milisengundos. Esto dado que la velocidad depende de que se esten presionando los botones. Si no se presionan velocidad = 0, y el Mokepon no se mueve.
    window.addEventListener('keydown', pressTeclado) //Esta instrucción espera que se presiones cualquier tecla del teclado para ejecutar la función "pressTeclado"
    window.addEventListener('keyup', detenerMovimiento) //Esta instrucción llama la función "detenerMovimiento" cuando se deja de presionar el teclado.  
}

function moverArriba (){ mokeponJugador.velocidadY =  - 5 }
function moverAbajo (){ mokeponJugador.velocidadY = 5 }
function moverIzquierda (){ mokeponJugador.velocidadX = - 5}
function moverDerecha (){ mokeponJugador.velocidadX = 5 }

function detenerMovimiento(){
    mokeponJugador.velocidadX = 0
    mokeponJugador.velocidadY = 0
}

function pressTeclado(event){

//console.log(event.key) //Imprime en el console la tecla que fue presionada.
 switch (event.key) {

    case 'ArrowUp': moverArriba() 
    break
    case 'ArrowDown': moverAbajo() 
    break
    case 'ArrowLeft': moverIzquierda() 
    break
    case 'ArrowRight': moverDerecha() 
    break
 
    default:
        break
 }

}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function reiniciarJuego() {

    location.reload()
}

function revisarColisiones (enemigo){

    if(colision == 0){ //este condicional resolvió el problema de la duplicacion de botones de ataque porque seguia escuchando el teclado despues de haber seleccionado enemigo en el mapa.
        const correccionX = 40
        const correccionY = 30
        let arribaEnemigo = enemigo.y2 + correccionY
        let abajoEnemigo = enemigo.y2 + enemigo.alto - correccionY
        let derechaEnemigo = enemigo.x2 + enemigo.ancho - correccionX
        let izquierdaEnemigo = enemigo.x2 + correccionX

        let arribaMascota = mokeponJugador.y
        let abajoMascota = mokeponJugador.y + mokeponJugador.alto
        let derechaMascota = mokeponJugador.x + mokeponJugador.ancho
        let izquierdaMascota = mokeponJugador.x

        if( //Si alguna de estas condiciones se cumple, entonces no hay colisión.
            abajoMascota < arribaEnemigo ||
            arribaMascota > abajoEnemigo ||
            derechaMascota < izquierdaEnemigo ||
            izquierdaMascota > derechaEnemigo
        ){ 
            colision = 0     
        }
        else{ //Cuando no se cumple ninguna de las condiciones anteriores, entonces hay colisión.

            detenerMovimiento()
            colision = 1
            sectionVerMapa.style.display = 'none'
            //console.log("Colicion = ", colision)
            //console.log("Hay colision con: ", enemigo.nombre)
        }  
        return colision
    }
}

function buscarEmoji(nombreEmoji){  
    let emojiEncontrado = ''

    if(nombreEmoji === 'FUEGO'){
        emojiEncontrado = '🔥'
    }
    else if(nombreEmoji === 'RAYO'){
        emojiEncontrado = '⚡'
    }
    else if(nombreEmoji === 'VIENTO'){
        emojiEncontrado = '💨'
    }
    else if(nombreEmoji === 'TIERRA'){
        emojiEncontrado = '🪨'
    }
    else if(nombreEmoji === 'AGUA'){
        emojiEncontrado = 'Ô'
    }
   
    return emojiEncontrado
}

function pedirAtaqueOnlineEnemigo(){
    let emoji = null

    fetch(`http://localhost:8080/warkepon/${enemigoOnlineId}/bajar_ataques`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Esta es la cabecera para indicar el tipo de contenido a enviar, en este caso un JSON.
        },
        body: JSON.stringify({  //Es un método de JavaScript que convierte un objeto JavaScript en una cadena de texto en formato JSON.
            ronda: ronda
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })
    .then(data => {
        ataqueEnemigoRonda = data.ataqueEnemigoRonda

        ataqueEnemigo.push(ataqueEnemigoRonda)
        emoji = buscarEmoji(ataqueEnemigoRonda)
        emojiAtaqueEnemigo.push(emoji)
        ataqueEnemigoRecibido = 1
        console.log(`Jugador atacó con ${ataqueJugador[ronda]} y enemigo online atacó con ${ataqueEnemigo[ronda]}`)
        //console.log("Antes de ejecutar la función combate() en fetch bajar_ataques, ronda = " + ronda)
        combate()
        
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud fetch:', error)
    })

    console.log("Entrando en modo recepcion de ataque online...") 
}

function reportarAtaqueOnline() {
    fetch(`http://localhost:8080/warkepon/${jugadorId}/subir_ataques`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Esta es la cabecera para indicar el tipo de contenido a enviar, en este caso un JSON.
        },
        body: JSON.stringify({
            ataque: ataqueJugador[ronda],
            ronda: ronda
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json();
    })
    .then(data => {
        if (data.recibido === 'TimeOut') {
            ataqueJugador[ronda] = 'TimeOut'
            console.log('No se pudo reportar el ataque porque se superó el tiempo límite.')
        } else {
            
            console.log('Ataque recibido por el servidor.')
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud fetch:', error)
    })
    ataqueEnemigoRecibido = 0 //Esta variable monitoreará que se ha recibido el ataque del enemigo y en ese punto se volverá a poner en 1.
}

function obtenerMokeponEnemigoOnline() {
    fetch(`http://localhost:8080/warkepon/${jugadorId}/adversario`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Esta es la cabecera para indicar el tipo de contenido a enviar, en este caso un JSON.
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })
    .then(data => {
        enemigoOnline = data.enemigo
        enemigoOnlineId = data.enemigoId
        pares = data.pares

        if (pares === 2) {
            clearInterval(intervaloEnemigoOnline) // Aquí se detiene la función recurrente
            asignarMokeponOnline()
            console.log(`Enemigo id: ${enemigoOnlineId} escogió: ${enemigoOnline}`)
        } else if (pares === 1) {
            console.log("Servidor reporta que está esperando la conexión de otro adversario online.")
            asignarMokeponOnline()
        }
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud fetch:', error)
    })
}

function pedirAdversarioAlServidor(){

    intervaloEnemigoOnline = setInterval(obtenerMokeponEnemigoOnline, 5000)
    obtenerMokeponEnemigoOnline() // Llamar inmediatamente la primera vez
}

 function asignarMokeponOnline(){

    if(enemigoOnline == "Esperando"){
        mokeponEnemigo = esperando
    }
    else {

        mokepones.forEach((mokepon) => {
        
            if(mokepon.nombre == enemigoOnline) {
                mokeponEnemigo = mokepon
            }
        })
        ataquesDisponiblesEnemigo = extraerAtaques(mokeponEnemigo.nombre) //Guarda en un arreglo " ataquesDisponiblesEnemigo" los ataques del Mokepon Enemigo.  
        
    }
    continuarJuegoOnline()
 }

 function reportarFinalJuego(){

    fetch(`http://localhost:8080/warkepon/${jugadorId}/final`, {
        method:"post",
        headers: {
            "Content-Type": "application/json" //Esta es la cabecera para indicar el tipo de contenido a enciar, en este caso un JSON.
        },
        body: JSON.stringify({  //Es un método de JavaScript que convierte un objeto JavaScript en una cadena de texto en formato JSON.
            reporte: "finalizo"   
        })
    })
}

 function reportarMokeponJugador(mascotaOnline){

    fetch(`http://localhost:8080/warkepon/${jugadorId}`, {
        method:"post",
        headers: {
            "Content-Type": "application/json" //Esta es la cabecera para indicar el tipo de contenido a enciar, en este caso un JSON.
        },
        body: JSON.stringify({  //Es un método de JavaScript que convierte un objeto JavaScript en una cadena de texto en formato JSON.
            mokepon: mascotaOnline,
            ataquesPorPartida: ataquesPorPartida 
        })
    })
}

function cantidadJugadoresOnline(){
    fetch("http://localhost:8080/jugadores")

        .then(function (res){
            
            if(res.ok){
                res.json()
                    .then(function (respuesta){
                        enemigosConectados = respuesta - 1
                        console.log("Enemigos conectados: " + enemigosConectados)
                    })
            }
        })  
}

function unirseAlJuegoOnline(){
    fetch("http://localhost:8080/unirse")

        .then(function (res){
            
            if(res.ok){
                res.text()
                    .then(function (respuesta){
                        jugadorId = respuesta
                        console.log(respuesta)
                    })
            }
        })  
}

window.addEventListener('load', iniciarJuego)

