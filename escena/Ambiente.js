import * as THREE from "three";

export function crearAmbiente(scene){

    //--------------------------
    // ROCAS
    //--------------------------

    for(let i=0;i<15;i++){

        const roca = new THREE.Mesh(

            new THREE.DodecahedronGeometry(

                Math.random()*1+0.5

            ),

            new THREE.MeshStandardMaterial({

                color:0x4d5b63,

                roughness:1

            })

        );

        roca.position.set(

            (Math.random()-0.5)*90,

            -9,

            (Math.random()-0.5)*90

        );

        roca.rotation.y=Math.random()*Math.PI;

        scene.add(roca);

    }

    //--------------------------
    // PLANTAS
    //--------------------------

    for(let i=0;i<35;i++){

        const planta=new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.05,

                0.12,

                Math.random()*2+1.5,

                8

            ),

            new THREE.MeshStandardMaterial({

                color:0x1fb56d

            })

        );

        planta.position.set(

            (Math.random()-0.5)*90,

            -8,

            (Math.random()-0.5)*90

        );

        scene.add(planta);

    }

}