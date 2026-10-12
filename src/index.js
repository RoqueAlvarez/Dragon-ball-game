// importaciones de las imagenes y recursos nesesarios para el juego 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Acciones from "./Acciones.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';

// variables globales de estado
// aqui guardamos el nombre de la carpeta de los personajes 
let personajeJ1 = "";
let personajeJ2 = "";

// estas guardan los objetos de los jugadores con su vida y ataques
let objJugador1;
let objJugador2;

// contador para saber si ya le dieron aceptar los dos jugadores
let jugadoresListos = 0;

// variables para controlar los turnos del ataque especial 
let enfriamientoEsp1 = 2;
let enfriamientoEsp2 = 2;

// informacion sobre cada personaje para sus ataques color o frases de curacion
const ataques = {
    "Veguito": {
        "color":"linear-gradient(255deg, rgba(124,21,21,0.5) 17%, rgba(255,145,33,0.5) 54%, rgba(164,52,52,0.5) 92%)",
        "atk1": "Rafaga de ki",
        "atk2": "Espada Espiritual!!",
        "curar": "¡Estoy listo!"
    },
    "Trunks": {
        "color":"linear-gradient(255deg, rgba(21,123,124,0.5) 17%, rgba(33,255,253,0.5) 54%, rgba(52,164,140,0.5) 92%)",
        "atk1": "Golpe con Espada",
        "atk2": "Ataque Espada de Esperanza!!",
        "curar": "Podrán destruir mi cuerpo y podrán destruir mi mundo, ¡pero jamás podrán destruir mi esperanza!"
    },
    "Gohan": {
        "color":"linear-gradient(255deg, rgba(124,21,82,0.5) 17%, rgba(171,33,255,0.5) 54%, rgba(164,52,122,0.5) 92%)",
        "atk1": "Patada durisima",
        "atk2": "Masenko!!",
        "curar": "¿Pelear contigo? No... Yo quiero matarte."
    },
    "Goku": {
        "color":"linear-gradient(255deg, rgba(24,21,124,0.5) 17%, rgba(43,33,255,0.5) 54%, rgba(59,52,164,0.5) 92%)",
        "atk1": "Rafaga de ki",
        "atk2": "Kamehameha!!!",
        "curar": "¡No me rendiré, porque eso es lo que hacen los Saiyajins!"
    },
    "Veguetta": {
        "color":"linear-gradient(255deg, rgba(111,10,79,0.5) 17%, rgba(176,46,235,0.5) 54%, rgba(149,20,135,0.5) 92%)",
        "atk1": "El Ataque Big Bang",
        "atk2": "Destello... Final!!!",
        "curar": "¡Yo soy Vegeta, el príncipe de todos los Saiyajins!"
    },
    "Pikoro": {
        "color":"linear-gradient(255deg, rgba(20,144,11,0.5) 17%, rgba(209,246,189,0.5) 54%, rgba(84,164,52,0.5) 92%)",
        "atk1": "Látigo Demonio",
        "atk2": "Makankosappo!!!",
        "curar": "Fue un grave error de tu parte darme tiempo para recuperarme. ¡Se acabó el calentamiento!"
    },
    "Gogueta": {
        "color":"linear-gradient(255deg, rgba(141,144,11,0.5) 17%, rgba(224,235,46,0.5) 54%, rgba(181,189,55,0.5) 92%)",
        "atk1": "golpes Castigadores",
        "atk2": "Big Bang Kamehameha!!!",
        "curar": "¡No hay nadie en este universo que pueda derrotarme!"
    },
    "Cell": {
        "color":"linear-gradient(255deg, rgba(34,83,28,0.5) 17%, rgba(75,235,46,0.5) 54%, rgba(36,77,30,0.5) 92%)",
        "atk1": "Golpe Perfecto",
        "atk2": "Kamehamehaaa muere!!!",
        "curar": "¡tu energía me pertenece! ¡Agradece que servirás para mi perfección!"
    }
}

// referencias del dom (agarramos los contenedores y botones del html para controlarlos)
const panelJugador1 = document.getElementById("panel_j1");
const panelJugador2 = document.getElementById("panel_j2");
const inputAlias1 = document.getElementById("input_jugador1");
const inputAlias2 = document.getElementById("input_jugador2");
const btnAceptarJ1 = panelJugador1.querySelector("button");
const btnAceptarJ2 = panelJugador2.querySelector("button");

// esto es una expresion regular, asegura que no pongan arrobas ni simbolos raros en su nombre
const filtroLetrasNumeros = /^[a-zA-Z0-9\s]+$/;

// funcion para quitar estilos de seleccion
// esto sirve para que cuando seleccionen otro personaje, el que habian seleccionado antes se desmarque 
const remover_seleccion = (elementos, claseBase) => {
    elementos.map((elemento) => {
        elemento.classList.remove("bg-warning");
        elemento.classList.add(claseBase);
    });
}

// seleccionar avatar jugador 1
// aqui recorremos todas las fotos de los personajes del p1 y le ponemos un evento click a cada una
[...panelJugador1.querySelectorAll("img")].map((imagen) => {
    imagen.addEventListener('click', (event) => {
        remover_seleccion([...panelJugador1.querySelectorAll("img")], "bg-danger");
        event.target.classList.remove("bg-danger");
        event.target.classList.add("bg-warning"); // pinta el borde amarillo
        personajeJ1 = event.target.getAttribute("alt"); // nos guardamos el nombre del personaje que eligio
    });
});

// seleccionar avatar jugador 2 
[...panelJugador2.querySelectorAll("img")].map((imagen) => {
    imagen.addEventListener('click', (event) => {
        remover_seleccion([...panelJugador2.querySelectorAll("img")], "bg-primary");
        event.target.classList.remove("bg-primary");
        event.target.classList.add("bg-warning");
        personajeJ2 = event.target.getAttribute("alt");
    });
});

// confirmacion jugador 1
btnAceptarJ1.addEventListener('click', () => {
    // sacamos el nombre que escribio y le quitamos los espacios al inicio y final
    const nombre = inputAlias1.value.trim();
    
    // checamos que haya escrito bien, que pase el filtro y que haya elegido foto
    if (nombre === "" || !filtroLetrasNumeros.test(nombre) || personajeJ1 === "") {
        Swal.fire({ icon: 'warning', title: 'Error', text: 'Ingresa un nombre valido y elige un personaje' });
        return; // si entra aqui el return hace que ya no se siga ejecutando el codigo de abajo
    }
    
    // creamos al personaje
    objJugador1 = new Acciones(nombre);
    inputAlias1.disabled = true; // desabilitamos el input para que no lo cambien
    panelJugador1.classList.add("d-none"); // desaparecemos sus fotos
    jugadoresListos++; // ya quedo uno listo
    comprobarInicio(); // checa si ya estan los dos para empezar el combate
});

// confirmacion jugador 2 
btnAceptarJ2.addEventListener('click', () => {
    const nombre = inputAlias2.value.trim();
    if (nombre === "" || !filtroLetrasNumeros.test(nombre) || personajeJ2 === "") {
        Swal.fire({ icon: 'warning', title: 'Error', text: 'Ingresa un nombre valido y elige un personaje' });
        return;
    }
    
    objJugador2 = new Acciones(nombre);
    inputAlias2.disabled = true;
    panelJugador2.classList.add("d-none");
    jugadoresListos++;
    comprobarInicio();
});

// verifica si ambos estan listos para arrancar el combate
const comprobarInicio = () => {
    if (jugadoresListos === 2) {
        // si ya estan listos los dos, escondemos el div completo del registro
        document.getElementById("registro_juego").classList.add("d-none");
        
        let intervaloTiempo; // guardamos el timer aca para poder limpiarlo o detenerlo
        Swal.fire({
            title: "INICIAR COMBATE",
            html: "EN <b>10</b> segundos<br>¡Alerta, prepárense para luchar!",
            timer: 10000,
            timerProgressBar: true,
            allowOutsideClick: false, // para que no puedan darle click afuera
            allowEscapeKey: false, // evita que se lo salten con la tecla de escape
            showConfirmButton: false, // quita el boton de ok para que no le den enter ni tab
            didOpen: () => {
                Swal.showLoading();
                const textoTemporizador = Swal.getPopup().querySelector("b");
                // esto de aqui va restandole los segundos al Swal cada que pasa un segundo
                intervaloTiempo = setInterval(() => {
                    textoTemporizador.textContent = Math.floor(Swal.getTimerLeft() / 1000);
                }, 1000);
            },
            willClose: () => {
                clearInterval(intervaloTiempo);
                prepararArena();
            }
        });
    }
}

// monta los personajes y barras iniciales una vez que acaba el timer
const prepararArena = () => {
    document.getElementById("iniciar_juego").classList.remove("d-none"); // prende la vista del ring
    
    // pasa el nombre a mayusculas y lo pega en su texto
    document.getElementById("nombre_j1").innerText = objJugador1.getNombre().toUpperCase();
    document.getElementById("nombre_j2").innerText = objJugador2.getNombre().toUpperCase();
    
    // agarra la ruta de las imagenes dependiendo del personaje seleccionado
    document.getElementById("imagen_avatar1").src = `./public/img/DB/${personajeJ1}/base.png`;
    document.getElementById("imagen_avatar2").src = `./public/img/DB/${personajeJ2}/base.png`;
    
    actualizarBarras();
    gestionarTurno(1); // arranca siempre con el turno del jugador 1
}

// actualiza los porcentajes visuales en pantalla
// esto lo llamamos despues de cada ataque para que la barra si se mueva de color
const actualizarBarras = () => {
    // se actualiza tanto el ancho visual (width) de la barra verde/azul/amarilla como el numero impreso
    document.getElementById("vida_j1").style.width = `${objJugador1.getVida()}%`;
    document.getElementById("vida_j1").innerText = `${objJugador1.getVida()}%`;
    document.getElementById("ki_j1").style.width = `${objJugador1.getKi()}%`;
    document.getElementById("ki_j1").innerText = `${objJugador1.getKi()}%`;
    document.getElementById("energia_j1").style.width = `${objJugador1.getEnergia()}%`;
    document.getElementById("energia_j1").innerText = `${objJugador1.getEnergia()}%`;
    document.getElementById("se_j1").innerText = objJugador1.getSemilla(); // actualiza semilla
    
    // mismo pedo pal jugador 2
    document.getElementById("vida_j2").style.width = `${objJugador2.getVida()}%`;
    document.getElementById("vida_j2").innerText = `${objJugador2.getVida()}%`;
    document.getElementById("ki_j2").style.width = `${objJugador2.getKi()}%`;
    document.getElementById("ki_j2").innerText = `${objJugador2.getKi()}%`;
    document.getElementById("energia_j2").style.width = `${objJugador2.getEnergia()}%`;
    document.getElementById("energia_j2").innerText = `${objJugador2.getEnergia()}%`;
    document.getElementById("se_j2").innerText = objJugador2.getSemilla();
}

// bloquea o desbloquea botones segun de quien sea el turno
// recibe como parametro un numero entero, el 1 o el 2
const gestionarTurno = (turno) => {
    // botones p1 si es el turno 2, esto da true y se desactivan (disabled). Si es turno 1 da false y se prenden
    document.getElementById("btn_atk_j1").disabled = (turno === 2);
    document.getElementById("btn_ermi_j1").disabled = (turno === 2);
    document.getElementById("btn_ki_j1").disabled = (turno === 2);
    
    // logica del contador del p1 para el ataque mamadisimo especial
    if (turno === 1) {
        if (enfriamientoEsp1 > 0) enfriamientoEsp1--; // si habia contador se lo restamos
        // solo se prende el boton si el enfriamiento ya llego a 0
        document.getElementById("btn_esp_j1").disabled = (enfriamientoEsp1 > 0);
    } else {
        // si no es su turno, a webito se apaga
        document.getElementById("btn_esp_j1").disabled = true;
    }

    // botones p2 (hace la misma logica invertida)
    document.getElementById("btn_atk_j2").disabled = (turno === 1);
    document.getElementById("btn_ermi_j2").disabled = (turno === 1);
    document.getElementById("btn_ki_j2").disabled = (turno === 1);
    
    // logica de contador paar ataque fuerte p2
    if (turno === 2) {
        if (enfriamientoEsp2 > 0) enfriamientoEsp2--;
        document.getElementById("btn_esp_j2").disabled = (enfriamientoEsp2 > 0);
    } else {
        document.getElementById("btn_esp_j2").disabled = true;
    }
}

// evalua si alguien perdio el juego, si retorna true significa que ya mamo alguien
const revisarGanador = () => {
    if (objJugador1.getVida() <= 0) {
        // pasamos el personaje 2 por que fue el wey que gano
        mostrarDerrota(personajeJ2, objJugador2.getNombre());
        return true;
    } else if (objJugador2.getVida() <= 0) {
        mostrarDerrota(personajeJ1, objJugador1.getNombre());
        return true;
    }
    return false; // todavia andan vivos
}

// pantalla final de victoria
const mostrarDerrota = (imgGanador, nombreGanador) => {
    Swal.fire({
        title: `¡${nombreGanador} GANA!`,
        text: "Despues de un intenso combate haz podido ganar la batalla, ¡Felicidades pide un deseo a las esferas del dragon!",
        imageUrl: `./public/img/DB/${imgGanador}/base.png`, // ponemos la imagen del compa ganador
        imageWidth: 250,
        imageHeight: 250,
        backdrop: `rgba(0,0,0,0.8)`, // le oscurecemos la pantallita de atras
        showCancelButton: true, // boton extra para decidir si quiere menu o revancha
        confirmButtonText: "Revancha", // si le da aqui, juega de nuevo con los mismos monos
        cancelButtonText: "Ir al menú", // si le da aca, reiniciamos todo el pex
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            // revancha: simplemente volvemos a instanciar los objetos para que tengan la vida llena otra vez
            objJugador1 = new Acciones(objJugador1.getNombre());
            objJugador2 = new Acciones(objJugador2.getNombre());
            enfriamientoEsp1 = 2;
            enfriamientoEsp2 = 2;
            actualizarBarras();
            gestionarTurno(1);
        } else {
            // menu: escondemos la arena, mostramos el registro y limpiamos las variables a mano
            document.getElementById("iniciar_juego").classList.add("d-none");
            document.getElementById("registro_juego").classList.remove("d-none");
            
            jugadoresListos = 0;
            personajeJ1 = "";
            personajeJ2 = "";
            
            // limpiamos la pantalla del jugador 1
            inputAlias1.disabled = false;
            inputAlias1.value = "";
            panelJugador1.classList.remove("d-none");
            remover_seleccion([...panelJugador1.querySelectorAll("img")], "bg-danger");
            
            // limpiamos la pantalla del jugador 2
            inputAlias2.disabled = false;
            inputAlias2.value = "";
            panelJugador2.classList.remove("d-none");
            remover_seleccion([...panelJugador2.querySelectorAll("img")], "bg-primary");
        }
    });
}

// ================= ACCIONES JUGADOR 1 =================

document.getElementById("btn_atk_j1").addEventListener('click', async () => {
    // checa que nos alcanze la estamina y el ki
    if (objJugador1.getKi() < 5 || objJugador1.getEnergia() < 10) {
        Swal.fire({ icon: 'warning', title: 'Sin energia', text: 'Recarga para atacar' });
        return; // lo saca del metodo para que no ataque y pierda turno
    }
    // le manda el ataque
    objJugador1.atkBasico(objJugador2);
    // el async / await hace que el script se espere hasta que acabe el tiempo del popup pa que siga fluyendo
    // le puse allowEscapeKey y showConfirmButton en falso pa que no se salten la animacion de los putazos
    await Swal.fire({
        title: ataques[personajeJ1]["atk1"],
        imageUrl: `./public/img/DB/${personajeJ1}/basico.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ1]["color"],
        timer: 1500, // tarda segundo y medio en quitarse solo
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras(); // refrezcamos numeros visuales
    // el if (!revisarGanador) dice "si NO acabo el juego, pasale el turno al bato 2"
    if (!revisarGanador()) gestionarTurno(2);
});

document.getElementById("btn_esp_j1").addEventListener('click', async () => {
    if (objJugador1.getKi() < 10 || objJugador1.getEnergia() < 15) {
        Swal.fire({ icon: 'warning', title: 'Sin energia', text: 'Recarga para atacar' });
        return;
    }
    objJugador1.atkEspecial(objJugador2);
    // bloqueamos especial por dos turnos 
    enfriamientoEsp1 = 2; 
    await Swal.fire({
        title: ataques[personajeJ1]["atk2"],
        imageUrl: `./public/img/DB/${personajeJ1}/especial.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ1]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    if (!revisarGanador()) gestionarTurno(2);
});

document.getElementById("btn_ermi_j1").addEventListener('click', async () => {
    // que no haya gastado todo
    if (objJugador1.getSemilla() <= 0) {
        Swal.fire({ icon: 'warning', title: 'Sin semillas', text: 'Ya no te quedan semillas' });
        return;
    }
    // validamos que no se ande comiendo una semilla si ya tiene la vida entera
    if (objJugador1.getVida() === 100 && objJugador1.getKi() === 100 && objJugador1.getEnergia() === 100) {
        Swal.fire({ icon: 'info', title: 'Poder al maximo', text: 'No puedes gastar semillas si tienes salud perfecta' });
        return;
    }
    objJugador1.curacion();
    await Swal.fire({
        title: "¡Recuperacion total!",
        text: ataques[personajeJ1]["curar"],
        imageUrl: `./public/img/DB/${personajeJ1}/curar.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ1]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    gestionarTurno(2);
});

document.getElementById("btn_ki_j1").addEventListener('click', async () => {
    objJugador1.cargaEnergia(); // se sube su barra
    await Swal.fire({
        title: "¡Aumentando ki!",
        imageUrl: `./public/img/DB/${personajeJ1}/energia.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ1]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    gestionarTurno(2); // no ataco, solo cargo, tons pasa turno
});

// ================= ACCIONES JUGADOR 2 =================
// es identico en todo al jugador 1, nada mas cambian los objetos de objJugador2 que le ataca al 1

document.getElementById("btn_atk_j2").addEventListener('click', async () => {
    if (objJugador2.getKi() < 5 || objJugador2.getEnergia() < 10) {
        Swal.fire({ icon: 'warning', title: 'Sin energia', text: 'Recarga para atacar' });
        return;
    }
    objJugador2.atkBasico(objJugador1);
    await Swal.fire({
        title: ataques[personajeJ2]["atk1"],
        imageUrl: `./public/img/DB/${personajeJ2}/basico.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ2]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    if (!revisarGanador()) gestionarTurno(1);
});

document.getElementById("btn_esp_j2").addEventListener('click', async () => {
    if (objJugador2.getKi() < 10 || objJugador2.getEnergia() < 15) {
        Swal.fire({ icon: 'warning', title: 'Sin energia', text: 'Recarga para atacar' });
        return;
    }
    objJugador2.atkEspecial(objJugador1);
    enfriamientoEsp2 = 2; // bloqueamos especial por dos turnos
    await Swal.fire({
        title: ataques[personajeJ2]["atk2"],
        imageUrl: `./public/img/DB/${personajeJ2}/especial.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ2]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    if (!revisarGanador()) gestionarTurno(1);
});

document.getElementById("btn_ermi_j2").addEventListener('click', async () => {
    if (objJugador2.getSemilla() <= 0) {
        Swal.fire({ icon: 'warning', title: 'Sin semillas', text: 'Ya no te quedan semillas' });
        return;
    }
    if (objJugador2.getVida() === 100 && objJugador2.getKi() === 100 && objJugador2.getEnergia() === 100) {
        Swal.fire({ icon: 'info', title: 'Poder al maximo', text: 'No puedes gastar semillas si tienes salud perfecta' });
        return;
    }
    objJugador2.curacion();
    await Swal.fire({
        title: "¡Recuperacion total!",
        text: ataques[personajeJ2]["curar"],
        imageUrl: `./public/img/DB/${personajeJ2}/curar.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ2]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    gestionarTurno(1);
});

document.getElementById("btn_ki_j2").addEventListener('click', async () => {
    objJugador2.cargaEnergia();
    await Swal.fire({
        title: "¡Aumentando ki!",
        imageUrl: `./public/img/DB/${personajeJ2}/energia.png`,
        imageWidth: 250,
        backdrop: ataques[personajeJ2]["color"],
        timer: 1500,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
    });
    actualizarBarras();
    gestionarTurno(1);
});