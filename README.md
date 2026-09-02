# Proyecto: Banco de Peces Bioluminiscentes

## Seminario de Tecnologías de la Información II
### Universidad Autónoma Metropolitana – Unidad Cuajimalpa

---

# Segunda Entrega
## Integración de T1 + T2 + T4 + T5

## Objetivo

Desarrollar una simulación tridimensional de un banco de peces utilizando Three.js, incorporando renderizado eficiente mediante InstancedMesh y shaders personalizados para animaciones sobre GPU.

---

# Descripción

El proyecto representa un ecosistema submarino compuesto por un banco de peces bioluminiscentes, medusas y diversos elementos ambientales.

En esta segunda entrega se optimizó el renderizado utilizando InstancedMesh para dibujar 100 agentes con una sola llamada a la GPU, mejorando considerablemente el rendimiento.

Cada pez utiliza un shader personalizado tipo Vertex Wobble que simula el movimiento ondulante del cuerpo durante el nado sin modificar la geometría desde JavaScript.

El escenario incorpora iluminación dinámica, niebla, partículas luminosas, vegetación submarina y rocas para incrementar el realismo de la escena.

---

# Funcionalidades implementadas

## T1
- Escena 3D
- Cámara perspectiva
- Iluminación
- Ambiente submarino

## T2
- Agentes autónomos
- Movimiento independiente
- Organización mediante clases

## T4
- Shader personalizado (Vertex Wobble)
- Animación por vértices utilizando GLSL

## T5
- Renderizado mediante InstancedMesh
- 100 agentes utilizando una sola geometría
- Colores individuales por instancia
- Optimización para GPU

---

# Rendimiento

- 100 agentes simultáneos
- Renderizado mediante InstancedMesh
- Animación por Shader
- FPS mostrados en pantalla mediante Stats.js
- Rendimiento superior a 30 FPS

---

# Tecnologías

- JavaScript
- Three.js
- GLSL
- HTML5
- CSS3
- Visual Studio Code

---

# Estructura del proyecto

```
Proyecto/

│── agentes/
│     ├── Pez.js
│     └── Medusa.js
│
│── escena/
│     ├── Ambiente.js
│
├── main.js
├── index.html
├── style.css
└── README.md
```

---

# Autor Marco Antonio Martinez Cruz

---

# Demostración

La demostración muestra:

- Banco de 100 peces renderizados mediante InstancedMesh.
- Shader Vertex Wobble aplicado a todos los agentes.
- Movimiento autónomo del enjambre.
- Ambiente submarino.
- Medición del rendimiento mediante FPS.
