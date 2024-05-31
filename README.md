# Mokepon - Reestructuración del Proyecto

Este juego fue desarrollado por Palinux360 como una reestructuración completa del proyecto Mokepon del curso de programación básica de Platzi. Se utilizaron lenguajes de programación y herramientas vistas en el curso, como HTML, CSS, JavaScript, Canvas, Node.js, Express.js y Cors.js. Todas las optimizaciones y nuevas funciones en el código se realizaron para mejorar la experiencia del usuario y hacer el juego más entretenido. Los principales cambios incorporados son:

## Principales Cambios Incorporados

### Modos de Juego
Se incorporaron diferentes modos de juego, incluyendo Enemigo Aleatorio, Caverna de Enemigos y Enemigo Online.

### Nuevas Mascotas
Se agregaron el resto de las mascotas planteadas en clase, más tres enemigos nuevos.

### Funciones Dinámicas
El código se mejoró para que permita incorporar N mascotas nuevas en pocos pasos.

### Ataques Aleatorios
Se mejoró el código que permite escoger aleatoriamente los ataques, para seleccionar los que realmente tiene la mascota oponente.

### Poderes Adicionales
Se incorporaron dos poderes adicionales para las mascotas (VIENTO y RAYO) y se modificó la lógica para los combates.

### Sonidos
Se agregaron sonidos al escoger opciones "mascota", "modo" y cuando se "dispara" un ataque.

### Animaciones de Ataque
Esta versión del juego muestra una animación de los ataques uno por uno, a diferencia del proyecto original que envía un arreglo de ataques y muestra un texto con el resultado final.

---

## Nota del servicio online
El Back-end del juego está desplegado en render.com en una cuenta de pruebas gratuita. Dado lo anterior, los servicios creados en index.js se ejecutan en una instancia que se apaga automáticamente cuando no está en uso durante un período de tiempo. Cuando alguien visita el servicio después de que la instancia se ha apagado, se debe esperar un tiempo considerable (50 segundos o más) mientras la instancia se vuelve a encender antes de que se pueda manejar la solicitud. Lo anterior afecta solo el modo Online del juego, pues el resto de servicios como Jugador Aleatorio o Caverna de Enemigos son estáticos.

## Tecnologías Utilizadas

- HTML
- CSS
- JavaScript
- Canvas
- Node.js
- Express.js
- Cors.js

## Autor

Desarrollado por [Palinux360](https://github.com/Palinux360).


