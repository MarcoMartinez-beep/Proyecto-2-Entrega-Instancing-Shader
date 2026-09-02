import * as THREE from "three";

export class Pez{

    constructor(){

        //---------------------------------
        // NODO PRINCIPAL
        //---------------------------------

        this.group = new THREE.Group();

        //---------------------------------
        // MATERIALES
        //---------------------------------
const color = new THREE.Color();

const tonos = [
    0x4FC3F7,
    0x64B5F6,
    0x42A5F5,
    0x29B6F6,
    0x81D4FA
];

color.setHex(
    tonos[Math.floor(Math.random() * tonos.length)]
);

this.material = new THREE.MeshStandardMaterial({

    color: color,

    roughness:0.45,

    metalness:0.08

});

        this.materialOjo = new THREE.MeshStandardMaterial({

            color:0xffffff

        });

        this.materialPupila = new THREE.MeshStandardMaterial({

            color:0x111111

        });
        //---------------------------------
        // CUERPO
        //---------------------------------

        const cuerpoForma = new THREE.Shape();

        cuerpoForma.moveTo(-1.8,0);

        cuerpoForma.quadraticCurveTo(

            -0.8,

            0.75,

            0.8,

            0.55

        );

        cuerpoForma.quadraticCurveTo(

            1.35,

            0.20,

            1.45,

            0

        );

        cuerpoForma.quadraticCurveTo(

            1.35,

            -0.20,

            0.8,

            -0.55

        );

        cuerpoForma.quadraticCurveTo(

            -0.8,

            -0.75,

            -1.8,

            0

        );

        const cuerpoGeo = new THREE.ExtrudeGeometry(

            cuerpoForma,

            {

                depth:0.28,

                bevelEnabled:false

            }

        );

        this.cuerpo = new THREE.Mesh(

            cuerpoGeo,

            this.material

        );

        this.cuerpo.rotation.y = Math.PI/2;

        this.cuerpo.scale.set(

            0.68,

            0.62,

            0.55

        );

        this.group.add(this.cuerpo);

        //---------------------------------
// CABEZA (Ojos y boca)
//---------------------------------

this.cabeza = new THREE.Group();

this.cabeza.position.set(1.05, 0, 0);

this.group.add(this.cabeza);

// Ojo izquierdo
const ojoGeo = new THREE.SphereGeometry(0.045, 16, 16);

const ojoIzq = new THREE.Mesh(
    ojoGeo,
    this.materialOjo
);

ojoIzq.position.set(

    0.08,

    0.10,

    0.10

);

this.cabeza.add(ojoIzq);

// Pupila izquierda

const pupilaGeo = new THREE.SphereGeometry(0.018, 12, 12);

const pupilaIzq = new THREE.Mesh(
    pupilaGeo,
    this.materialPupila
);

pupilaIzq.position.x = 0.04;

ojoIzq.add(pupilaIzq);

// Ojo derecho

const ojoDer = ojoIzq.clone();

ojoDer.position.z = -0.10;

this.cabeza.add(ojoDer);

// Boca

const boca = new THREE.Mesh(

    new THREE.ConeGeometry(
        0.035,
        0.08,
        16
    ),

    new THREE.MeshStandardMaterial({
        color:0xffb08a
    })

);

boca.rotation.z = -Math.PI/2;

boca.position.set(
    0.18,
    -0.03,
    0
);

this.cabeza.add(boca);

//---------------------------------
// COLA
//---------------------------------

this.cola = new THREE.Group();

this.cola.position.set(
    -1.60,
    0,
    0
);

this.group.add(this.cola);

// Pedúnculo

const pedunculo = new THREE.Mesh(

    new THREE.CylinderGeometry(
        0.08,
        0.14,
        0.55,
        16
    ),

    this.material

);

pedunculo.rotation.z = Math.PI/2;

this.cola.add(pedunculo);

// Aleta

const formaCola = new THREE.Shape();

formaCola.moveTo(0,0);

formaCola.lineTo(-0.55,0.45);

formaCola.lineTo(-0.25,0);

formaCola.lineTo(-0.55,-0.45);

formaCola.lineTo(0,0);

const colaGeo = new THREE.ExtrudeGeometry(

    formaCola,

    {
        depth:0.05,
        bevelEnabled:false
    }

);

this.aletaCaudal = new THREE.Mesh(

    colaGeo,

    this.material

);

this.aletaCaudal.rotation.y = Math.PI/2;

this.aletaCaudal.position.set(
    -0.22,
    0,
    -0.02
);

this.cola.add(this.aletaCaudal);

//---------------------------------
// ALETAS LATERALES
//---------------------------------

const formaAleta = new THREE.Shape();

formaAleta.moveTo(0,0);

formaAleta.lineTo(-0.35,0.18);

formaAleta.lineTo(-0.10,0);

formaAleta.lineTo(-0.35,-0.18);

formaAleta.lineTo(0,0);

const geoAleta = new THREE.ExtrudeGeometry(

    formaAleta,

    {
        depth:0.02,
        bevelEnabled:false
    }

);

// Izquierda

this.aletaIzq = new THREE.Mesh(
    geoAleta,
    this.material
);

this.aletaIzq.rotation.y = Math.PI/2;

this.aletaIzq.position.set(
    -0.10,
    -0.10,
    0.20
);

this.group.add(this.aletaIzq);

// Derecha

this.aletaDer = this.aletaIzq.clone();

this.aletaDer.rotation.y = -Math.PI/2;

this.aletaDer.position.z = -0.20;

this.group.add(this.aletaDer);

// Dorsal

this.aletaDorsal = this.aletaIzq.clone();

this.aletaDorsal.rotation.x = Math.PI/2;

this.aletaDorsal.rotation.y = 0;

this.aletaDorsal.position.set(
    -0.20,
    0.38,
    0
);

this.group.add(this.aletaDorsal);

//---------------------------------
// VARIABLES DE MOVIMIENTO
//---------------------------------

this.speed = 0.025 + Math.random() * 0.02;

this.direction = new THREE.Vector3(

    Math.random() - 0.5,
    Math.random() - 0.3,
    Math.random() - 0.5

).normalize();

this.group.position.set(

    

    (Math.random() - 0.5) * 45,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 45

);
//---------------------------------
// TAMAÑO ALEATORIO
//---------------------------------

const escala = THREE.MathUtils.randFloat(

    0.55,

    1.40

);

this.group.scale.setScalar(escala);

this.offset = Math.random() * Math.PI * 2;

}




//---------------------------------
// UPDATE
//---------------------------------

update(time){

    const onda = Math.sin(time * 6 + this.offset);

    //---------------------------------
    // MOVIMIENTO DEL CUERPO
    //---------------------------------

    this.cuerpo.rotation.y = onda * 0.05;

    this.cola.rotation.y = onda * 0.55;

    this.aletaCaudal.rotation.y = onda * 0.85;

    //---------------------------------
    // ALETAS
    //---------------------------------

    this.aletaIzq.rotation.z =
        0.35 + Math.sin(time * 10 + this.offset) * 0.18;

    this.aletaDer.rotation.z =
        -0.35 - Math.sin(time * 10 + this.offset) * 0.18;

    this.aletaDorsal.rotation.x =
        Math.sin(time * 8 + this.offset) * 0.10;

    //---------------------------------
    // SUBE Y BAJA
    //---------------------------------

    this.group.position.y +=
        Math.sin(time * 2 + this.offset) * 0.002;

    //---------------------------------
    // AVANZAR
    //---------------------------------

    this.group.position.add(

        this.direction.clone().multiplyScalar(

            this.speed

        )

    );

    //---------------------------------
    // MIRAR AL FRENTE
    //---------------------------------

    const destino = this.group.position.clone().add(

        this.direction

    );

    this.group.lookAt(destino);

    //---------------------------------
    // LÍMITES
    //---------------------------------

    const limite = 40;

    if (this.group.position.x > limite) this.group.position.x = -limite;
    if (this.group.position.x < -limite) this.group.position.x = limite;

    if (this.group.position.z > limite) this.group.position.z = -limite;
    if (this.group.position.z < -limite) this.group.position.z = limite;

    if (this.group.position.y > 10) this.group.position.y = -5;
    if (this.group.position.y < -5) this.group.position.y = 10;

}
}
