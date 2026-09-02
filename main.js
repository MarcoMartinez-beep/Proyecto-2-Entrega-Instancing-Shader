import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { Medusa } from "./agentes/Medusa.js";
import { crearAmbiente } from "./escena/Ambiente.js";

//==================================
// ESCENA, CÁMARA Y RENDER
//==================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00111d);
scene.fog = new THREE.Fog(0x00111d, 25, 90);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 500);
camera.position.set(0, 12, 35);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

//==================================
// MÉTRICAS DE FPS (Requisito 4)
//==================================
const stats = new Stats();
stats.showPanel(0); 
document.body.appendChild(stats.dom);

//==================================
// LUCES
//==================================
const hemiLight = new THREE.HemisphereLight(0x6bdcff, 0x001122, 2);
scene.add(hemiLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4);
directionalLight.position.set(15, 25, 15);
directionalLight.castShadow = true;
scene.add(directionalLight);

const blueLight = new THREE.PointLight(0x00bfff, 8, 100);
blueLight.position.set(0, 10, 0);
scene.add(blueLight);

const cyanLight = new THREE.PointLight(0x00ffee, 10, 80);
cyanLight.position.set(-20, 5, -10);
scene.add(cyanLight);

//==================================
// PISO
//==================================
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(250, 250),
    new THREE.MeshStandardMaterial({ color: 0x153b3b, roughness: 1 })
);
floor.rotation.x = -Math.PI/2;
floor.position.y = -10;
floor.receiveShadow = true;
scene.add(floor);

//==================================
// ENJAMBRE INSTANCED MESH (Requisito 1)
//==================================
const cantidadEnjambre = 100;
const dummy = new THREE.Object3D();
const datosEnjambre = [];

// 1. Reconstruir tu Pez original para Instanciarlo
const cuerpoForma = new THREE.Shape();
cuerpoForma.moveTo(-1.8, 0);
cuerpoForma.quadraticCurveTo(-0.8, 0.75, 0.8, 0.55);
cuerpoForma.quadraticCurveTo(1.35, 0.20, 1.45, 0);
cuerpoForma.quadraticCurveTo(1.35, -0.20, 0.8, -0.55);
cuerpoForma.quadraticCurveTo(-0.8, -0.75, -1.8, 0);

const cuerpoGeo = new THREE.ExtrudeGeometry(cuerpoForma, { depth: 0.28, bevelEnabled: false });
cuerpoGeo.translate(0, 0, -0.14); // Centrar en el eje Z

const formaCola = new THREE.Shape();
formaCola.moveTo(0, 0);
formaCola.lineTo(-0.55, 0.45);
formaCola.lineTo(-0.25, 0);
formaCola.lineTo(-0.55, -0.45);
formaCola.lineTo(0, 0);

const colaGeo = new THREE.ExtrudeGeometry(formaCola, { depth: 0.05, bevelEnabled: false });
colaGeo.translate(-1.85, 0, -0.025); // Colocar al final del cuerpo

// Fusionar las geometrías en una sola para que la tarjeta gráfica lo dibuje de golpe
const pezGeoCompleta = BufferGeometryUtils.mergeGeometries([cuerpoGeo, colaGeo]);
pezGeoCompleta.rotateY(-Math.PI / 2); // Orientar para que miren hacia el frente (+Z)
pezGeoCompleta.scale(0.65, 0.65, 0.65);

// 2. Material con Shader Avanzado (Requisito 2: Vertex Wobble)
const materialEnjambre = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, // Se deja blanco para poder teñirlos individualmente después
    roughness: 0.45, 
    metalness: 0.08 
});

materialEnjambre.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = `uniform float uTime;\n` + shader.vertexShader;
    
    shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `
        #include <begin_vertex>
        // Animación de nado: deformación ondulante en el eje X
        float wobble = sin(position.z * 3.0 - uTime * 12.0) * 0.15;
        // smoothstep asegura que la cabeza (z>1) no se mueva, pero la cola (z<-2) se mueva mucho
        float damp = smoothstep(1.0, -2.0, position.z); 
        transformed.x += wobble * damp;
        `
    );
    materialEnjambre.userData.shader = shader;
};

// 3. Crear el banco de peces
const instancedPeces = new THREE.InstancedMesh(pezGeoCompleta, materialEnjambre, cantidadEnjambre);
instancedPeces.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(instancedPeces);

// 4. Tu paleta de colores original y lógica de movimiento
const color = new THREE.Color();
const tonos = [0x4FC3F7, 0x64B5F6, 0x42A5F5, 0x29B6F6, 0x81D4FA];

for(let i = 0; i < cantidadEnjambre; i++){
    datosEnjambre.push({
        posicion: new THREE.Vector3(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 80
        ),
        velocidad: 0.04 + Math.random() * 0.05,
        angulo: Math.random() * Math.PI * 2, // Hacia dónde miran
        anguloY: (Math.random() - 0.5) * 0.2
    });
    
    // Pintar cada pez de un color distinto
    color.setHex(tonos[Math.floor(Math.random() * tonos.length)]);
    instancedPeces.setColorAt(i, color);
}
instancedPeces.instanceColor.needsUpdate = true;

//==================================
// MEDUSAS
//==================================
const medusas = [];
for(let i=0; i<6; i++){
    const medusa = new Medusa();
    scene.add(medusa.group);
    medusas.push(medusa);
}

crearAmbiente(scene);

//==================================
// ESFERAS LUMINOSAS
//==================================
for(let i=0; i<35; i++){
    const esfera = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x66ffff, emissive: 0x00ffff, emissiveIntensity: 2 })
    );
    esfera.position.set((Math.random()-0.5)*120, Math.random()*35, (Math.random()-0.5)*120);
    scene.add(esfera);
}

//==================================
// RESIZE
//==================================
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//==================================
// LOOP DE ANIMACIÓN
//==================================
function animate(){
    requestAnimationFrame(animate);
    
    stats.begin();

    const tiempo = performance.now() * 0.001;

    // Actualizar shader del enjambre
    if(materialEnjambre.userData.shader){
        materialEnjambre.userData.shader.uniforms.uTime.value = tiempo;
    }

    // Movimiento Coherente Dirigido (Requisito 3)
    for(let i = 0; i < cantidadEnjambre; i++){
        const datos = datosEnjambre[i];
        
        datos.angulo += 0.003; // Nado en un círculo gigante cohesivo
        const direccion = new THREE.Vector3(Math.sin(datos.angulo), datos.anguloY, Math.cos(datos.angulo)).normalize();
        
        datos.posicion.addScaledVector(direccion, datos.velocidad);
        
        // Mantener al cardumen dentro de los límites
        if(datos.posicion.length() > 50) datos.angulo += Math.PI; // Dar vuelta al llegar al borde
        if(datos.posicion.y > 10) datos.anguloY = -0.1;
        if(datos.posicion.y < -5) datos.anguloY = 0.1;
        
        dummy.position.copy(datos.posicion);
        const objetivo = dummy.position.clone().add(direccion);
        dummy.lookAt(objetivo);
        dummy.updateMatrix();
        
        instancedPeces.setMatrixAt(i, dummy.matrix);
    }
    instancedPeces.instanceMatrix.needsUpdate = true;

    medusas.forEach(medusa => {
        medusa.update(tiempo);
    });

    renderer.render(scene, camera);
    
    stats.end();
}

animate();