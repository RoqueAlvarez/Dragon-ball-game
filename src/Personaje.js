// definimos la clase personaje con sus atributos y metodos 
class Personaje{
    // atributos privados con sus valores maxmos iniciales 
    // el simbolo del gato # sirve pa que las variables sean privadas y nadie las pueda modificar a lo wey desde afuera
    #vida = 100;
    #nombre;
    #ki = 100;
    #energia = 100;
    #semilla = 2;

    // constructor que se ejecuta al crear al personaje
    constructor(nombre){
        this.#nombre = nombre;
    }
    
    // getters para obtener la informacion privada
    // como las variables son privadas, nesesitamos estos metodos para que otros archivos las puedan leer
    getVida(){
        return this.#vida;
    }
    getKi(){
        return this.#ki;
    }
    getEnergia(){
        return this.#energia;
    }
    getSemilla(){
        return this.#semilla;
    }
    getNombre(){
        return this.#nombre;
    }
    
    // setters para modificar las variables
    // igual, si reciben daño los usamos para actualizar la vida, ki
    setVida(vida){
        this.#vida = vida;
    }
    setKi(ki){
        this.#ki = ki;
    }
    setEnergia(energia){
        this.#energia = energia;
    }
    setSemilla(semilla){
        this.#semilla = semilla;
    }
}
// exportamos la clase para usarla en acciones
export default Personaje;