'use client';
import React,{useRef,useEffect} from "react";
import * as THREE from 'three';
import * as calcul from "../Math/Calculation"
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'

let scene,renderer,camera,render2d; //render components
let particle, sphereleft,sphereright; //3d objects
let p, pspeed,speedslider,testspeed; //ui
let timepassed =0,speed=0,angle=0,rendertime=0,radius=0,distance=0,orbitspeed=0,backupx=0,backupy=0; //variables

var obj={
    x:0.00,
    y:0.00,
    z:0.00
  }

export const ThreeScene =({properties}:any)=>{

    if(typeof window !=='undefined'){
        init();

        createObjects(properties);
        createUI();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
        
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        
            renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);

        const renderScene=()=> {
            pspeed.textContent = 'speed set to : ' + speedslider.slider.value;
            p.textContent = 'current speed : '+ speed;
            properties.speedup = speedslider.slider.value;
            testspeed.textContent = 'current rendertime with speedup : ' + (rendertime*0.001*properties.speedup);

            if (radius>(properties.radius)){
                moveBehindDees(properties);
            }
            else if(obj.x <(0.5*properties.spacebetween) && obj.x >(-0.5*properties.spacebetween)){ 
                moveBetweenDees(properties)

            }
            else{
                moveInDees(properties);
                
            }
            particle.position.x =(obj.x);
            particle.position.z =(obj.y);
            
            render2d.render(scene,camera);
            renderer.render(scene, camera);
            
            requestAnimationFrame(renderScene);
            
        };

        let starttime = performance.now();
        renderScene();
        let endtime = performance.now();
        rendertime = ((endtime-starttime)); //makes it go from miliseconds to seconds time the speedup doesn't update

        
        return () => {
            window.removeEventListener('resize', handleResize);
            };

    }

    return renderer.domElement;
};

function init(){
    scene=new THREE.Scene();

    camera =new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000)
    camera.rotation.x =calcul.DegreesToRad(-90);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.domElement.style.position = 'absolute';

    render2d = new CSS2DRenderer(); 
    render2d.setSize(window.innerWidth,window.innerHeight);
    render2d.domElement.style.position = 'absolute';
    
    document.body.appendChild(render2d.domElement);
    document.body.appendChild(renderer.domElement);
};



function createObjects(properties:any){

    const particlegeometry = new THREE.SphereGeometry(0.05);
    const deeleftgeometry = new THREE.CircleGeometry(properties.radius,32,0,Math.PI);
    const deerightgeometry = new THREE.CircleGeometry(properties.radius,32,Math.PI,Math.PI);
    const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
    const endpointmat = new THREE.MeshBasicMaterial({color : 0xBA0109});
    endpointmat.side = THREE.DoubleSide;
    particle = new THREE.Mesh(particlegeometry, material);
    scene.add (particle);
    sphereleft = new THREE.Mesh(deeleftgeometry, endpointmat);
    scene.add(sphereleft);
    sphereright = new THREE.Mesh(deerightgeometry, endpointmat);
    scene.add(sphereright);

    particle.position.y = -10;
    sphereleft.rotation.x = calcul.DegreesToRad(90);
    sphereright.rotation.x = calcul.DegreesToRad(90);
    sphereleft.rotation.z = calcul.DegreesToRad(90);
    sphereright.rotation.z = calcul.DegreesToRad(90);
    sphereleft.position.y = -10;
    sphereright.position.y = -10;
    sphereleft.position.x = -0.5*properties.spacebetween;
    sphereright.position.x = 0.5*properties.spacebetween;
    
}

function createUI(){
    p = document.createElement('p');
    p.className ='UIText';
    p.textContent = 'im test text';
    const cPointlabel = new CSS2DObject(p);
    scene.add(cPointlabel);
    cPointlabel.position.set(-8,-10,-4)

    pspeed = document.createElement('p');
    pspeed.className ='UIText';
    const speedPointlabel = new CSS2DObject(pspeed);
    scene.add(speedPointlabel);
    speedPointlabel.position.set(-8,-10,-3.25)

    testspeed = document.createElement('p');
    testspeed.className ='UIText';
    const tspeedPointlabel = new CSS2DObject(testspeed);
    scene.add(tspeedPointlabel);
    tspeedPointlabel.position.set(-8,-10,-3)

    speedslider = sliderelement('speedslider','1','20','1');
    const sliderPointlabel = new CSS2DObject(speedslider.slidercontainer);
    scene.add(sliderPointlabel);
    sliderPointlabel.position.set(-8,-10,-3.5)
}

function moveInDees(properties:any){
    radius = calcul.radius(speed,properties.mass,properties.load,properties.magneticflux);
    orbitspeed = calcul.angle(speed,radius);
    var rad = (rendertime*0.001*properties.speedup)* orbitspeed;
    angle += rad;

    if (obj.x>=(0.5*properties.spacebetween)){

        if(angle>calcul.DegreesToRad(90) && properties.left == false){
            properties.left =true;
        }

        obj.x = backupx + calcul.cos(calcul.DegreesToRad(270)+(angle),radius); 
        obj.y = (backupy + calcul.sin(calcul.DegreesToRad(270),radius)) - calcul.sin(calcul.DegreesToRad(270)+(angle),radius); 

    }
    else if (obj.x<=(-0.5*properties.spacebetween) ){
        if(angle>calcul.DegreesToRad(90) && properties.left == true){
            properties.left =false;
        }

        obj.x = backupx + calcul.cos(calcul.DegreesToRad(90)+(angle),radius); 
        obj.y = (backupy + calcul.sin(calcul.DegreesToRad(90),radius)) - calcul.sin(calcul.DegreesToRad(90)+(angle),radius); 
    }
}

function moveBetweenDees(properties:any){
    speed = calcul.SpeedEndAccel(properties.accel,speed,0, (rendertime*0.001*properties.speedup));
    distance = calcul.DistAccel(speed,properties.accel,(rendertime*0.001*properties.speedup));
    if(properties.left==true){
        obj.x -= distance; //test numbers
    }
    else if(properties.left==false){
        obj.x += distance; //test numbers
    }

    if (obj.x>=0.5*properties.spacebetween){
        obj.x = 0.5*properties.spacebetween;
    }                    
    else if (obj.x<=-0.5*properties.spacebetween){
        obj.x = -0.5*properties.spacebetween;
    }

    angle = 0;
    backupx = obj.x;
    backupy = obj.y;
    timepassed = timepassed+(rendertime*0.001*properties.speedup);
}

function moveBehindDees(properties:any){                
    var bspeed = calcul.SpeedEndAccel(properties.accel,speed,0, (rendertime*0.001*properties.speedup));
    if(properties.left==false){
        obj.x +=bspeed * (rendertime*0.001*properties.speedup); 
    }
    else if(properties.left==true){
        obj.x -=bspeed * (rendertime*0.001*properties.speedup); 
    }
    angle = 0;
}


export const sliderelement=(id:any,min:any,max:any,value:any)=>{
    var sliderinfo={
        slider:document.createElement('input'),
        slidercontainer:document.createElement('div'),
    
    }
    const slider = document.createElement('input');
    slider.id = id;
    slider.className ='slider';
    slider.type ='range';
    slider.min =min;
    slider.max =max;
    slider.value =value;
    sliderinfo.slider=slider;

    const slidercontainer = document.createElement('div');
    slidercontainer.className = 'sliderContainer';
    slidercontainer.appendChild(slider);
    sliderinfo.slidercontainer=slidercontainer;

    return sliderinfo;
}