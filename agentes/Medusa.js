import * as THREE from "three";

export class Medusa {
    constructor() {
        this.group = new THREE.Group();

        //------------------------------------
        // Material
        //------------------------------------
        const material = new THREE.MeshStandardMaterial({
            color: 0x88ffff,
            transparent: true,
            opacity: 0.75,
            emissive: 0x33ffff,
            emissiveIntensity: 1.2
        });

        //------------------------------------
        // Campana
        //------------------------------------
        this.campana = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 20, 20),
            material
        );
        this.campana.scale.y = 0.6;
        this.group.add(this.campana);

        //------------------------------------
        // Tentáculos
        //------------------------------------
        this.tentaculos = []; // Guardamos los tentáculos en un arreglo para animarlos después

        for(let i=0; i<8; i++){
            // Creamos un grupo extra (pivote) para que el tentáculo rote desde arriba y no desde el centro
            const pivote = new THREE.Group();
            
            const tentaculo = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.05, 1.8, 6),
                new THREE.MeshStandardMaterial({
                    color: 0x99ffff,
                    emissive: 0x22ffff,
                    emissiveIntensity: 0.8
                })
            );

            // Bajamos el cilindro para que su inicio quede en el centro del pivote
            tentaculo.position.y = -0.9; 
            pivote.add(tentaculo);

            const angulo = (i / 8) * Math.PI * 2;
            pivote.position.set(
                Math.cos(angulo) * 0.45,
                -0.1, // Ajustamos la altura de donde nacen
                Math.sin(angulo) * 0.45
            );

            this.group.add(pivote);
            this.tentaculos.push(pivote); // Guardamos el pivote para la animación
        }

        //------------------------------------
        // Movimiento Inicial
        //------------------------------------
        this.offset = Math.random() * 10;
        this.velocidad = 0.004 + Math.random() * 0.004;
        this.group.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 10,
            (Math.random() - 0.5) * 40
        );
    }

   //------------------------------------
    // UPDATE (Ciclo de Animación)
    //------------------------------------
    update(time) {
        // 1. Movimiento de traslación
        this.group.position.y += Math.sin(time + this.offset) * 0.003;
        this.group.rotation.y += 0.002;

        if (this.group.position.y > 10) {
            this.group.position.y = -2;
        }

        // 2. Animación Orgánica (Pulsación)
        // Usamos una potencia (Math.pow) para que la contracción sea más rápida y el regreso más lento
        const ritmo = time * 2.0 + this.offset; 
        const pulso = 1.0 + Math.abs(Math.sin(ritmo)) * 0.25; 
        
        // Aplicamos el pulso a la campana
        this.campana.scale.set(pulso, 0.6 * pulso, pulso);

        // 3. Movimiento de los tentáculos (más suave)
        this.tentaculos.forEach((pivote, index) => {
            // Rotación más pequeña y suave
            pivote.rotation.x = Math.sin(ritmo + (index * 0.2)) * 0.2;
            pivote.rotation.z = Math.cos(ritmo + (index * 0.2)) * 0.2;
        });
    }
}