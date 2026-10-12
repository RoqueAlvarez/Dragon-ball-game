// importamos la clase padre
import Personaje from "./Personaje.js";

// declaramos acciones que hereda de personaje
class Acciones extends Personaje{
    constructor(nombre){
        // super manda a llamar el constructor de Personaje.js para que inicie con 100 de todo
        super(nombre);
    }
    
    // ataque basico que recibe al objeto del enemigo para restarle vida
    atkBasico(enemigo){
        // restamos energia y ki evitando que bajen de cero
        this.setEnergia(Math.max(0, this.getEnergia() - 10));
        this.setKi(Math.max(0, this.getKi() - 5));
        
        // restamos 15 de vida al rival
        enemigo.setVida(Math.max(0, enemigo.getVida() - 15));
    }
    
    // ataque especial mas fuerte
    atkEspecial(enemigo){
        this.setEnergia(Math.max(0, this.getEnergia() - 20));
        this.setKi(Math.max(0, this.getKi() - 15));
        
        // restamos 30 de vida al rival que es lo doble del normal
        enemigo.setVida(Math.max(0, enemigo.getVida() - 30));
    }
    
    // metodo para recuperar todo al maximo
    curacion(){
        // la curacion sube todo al cien pero nos cuesta una semilla
        this.setVida(100);
        this.setKi(100);
        this.setEnergia(100);
        this.setSemilla(this.getSemilla() - 1);
    }
    
    // recarga de poder cuidando el limite de 100
    cargaEnergia(){
        let nuevaEnergia = this.getEnergia() + 15;
        this.setEnergia(nuevaEnergia > 100 ? 100 : nuevaEnergia);
        
        let nuevoKi = this.getKi() + 15;
        this.setKi(nuevoKi > 100 ? 100 : nuevoKi);
    }
}

export default Acciones;