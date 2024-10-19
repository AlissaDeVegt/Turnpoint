'use client';
import React,{useRef,useEffect} from "react";
import * as THREE from 'three';

export const ThreeScene =({properties}:any)=>{

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if(typeof window !=='undefined'){
            const scene=new THREE.Scene();
            const camera =new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000)
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth,window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.rotation.x =-90;
            camera.position.y = 50;
            const geometry = new THREE.SphereGeometry();
            const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            sphere.position.z = 30;

            const renderScene=()=> {
                sphere.position.x =(properties.x);
                //sphere.rotation.z +=(properties.z);
                
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            };
           renderScene();

            //initialise three.js
        }
    }, []);
    return <div ref={containerRef}/> 

};