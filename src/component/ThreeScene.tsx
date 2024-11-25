'use client';
import React,{useRef,useEffect} from "react";
import * as THREE from 'three';
import * as calcul from "../Math/Calculation"
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'

let scene,renderer,camera,render2d; //render components
let particle, sphereleft,sphereright,collisionobject; //3d objects
let p, pspeed,speedslider,testspeed, startbutton,pauzebutton,refreshbutton; //ui
let timepassed =0,speed=0,speedup=0,speedupB=0,angle=0,rendertime=0,radius=0,distance=0,orbitspeed=0,backupx=0,backupy=0; //variables
let running =false; 
let leftside = false;
let leftsideB = false;

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
        
        speedup=properties.speedup;
        leftside = properties.left;

        speedupB=properties.speedup;
        leftsideB = properties.left;
        window.addEventListener('resize', handleResize);

        const renderScene=()=> {

            if(running ==true){
                pspeed.textContent = 'speed set to : ' + speedslider.slider.value;
                p.textContent = 'current speed : '+ speed;
                speedup = speedslider.slider.value; // slider option dissapear later when connected

                if (radius>(properties.radius)){
                    moveBehindDees(properties);
                }
                else if(obj.x <(0.5*properties.spacebetween) && obj.x >(-0.5*properties.spacebetween)){ 
                    moveBetweenDees(properties)
                }
                else{
                    moveInDees(properties);
                    
                }
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
    const collisiongeometry = new THREE.SphereGeometry(0.05);

    //const collisionmaterial = new THREE.MeshBasicMaterial({color : 0x00ff00});
    //collisionobject = new THREE.Mesh(collisiongeometry, collisionmaterial);
    //scene.add(sphereright);

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

    startbutton = buttonElement('start','buttons',-8,-10,-4.25);
    startbutton.addEventListener("click", startCyclotron);

    pauzebutton = buttonElement('pauze','buttons',-7.5,-10,-4.25);
    pauzebutton.addEventListener("click", stopCyclotron);

    refreshbutton = buttonElement('reset','buttons',-8.5,-10,-4.25);
    refreshbutton.addEventListener("click", resetcyclotron) ;


    p = textElement('UIText',-8,-10,-4)
    speedslider = sliderElement('speedslider','1','20','1',-8,-10,-3.5);
    pspeed = textElement('UIText',-8,-10,-3.25);
    testspeed = textElement('UIText',-8,-10,-3);

}

function moveInDees(properties:any){
    radius = calcul.radius(speed,properties.mass,properties.load,properties.magneticflux);
    orbitspeed = calcul.angle(speed,radius);
    var rad = (rendertime*0.001*speedup)* orbitspeed;
    angle += rad;

    if (obj.x>=(0.5*properties.spacebetween)){

        if(angle>calcul.DegreesToRad(90) && leftside == false){
            leftside =true;
        }

        obj.x = backupx + calcul.cos(calcul.DegreesToRad(270)+(angle),radius); 
        obj.y = (backupy + calcul.sin(calcul.DegreesToRad(270),radius)) - calcul.sin(calcul.DegreesToRad(270)+(angle),radius); 

    }
    else if (obj.x<=(-0.5*properties.spacebetween) ){
        if(angle>calcul.DegreesToRad(90) && leftside == true){
            leftside =false;
        }

        obj.x = backupx + calcul.cos(calcul.DegreesToRad(90)+(angle),radius); 
        obj.y = (backupy + calcul.sin(calcul.DegreesToRad(90),radius)) - calcul.sin(calcul.DegreesToRad(90)+(angle),radius); 
    }
}

function moveBetweenDees(properties:any){
    speed = calcul.SpeedEndAccel(properties.accel,speed,0, (rendertime*0.001*speedup));
    distance = calcul.DistAccel(speed,properties.accel,(rendertime*0.001*speedup));
    if(leftside==true){
        obj.x -= distance; //test numbers
    }
    else if(leftside==false){
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
    timepassed = timepassed+(rendertime*0.001*speedup);
}

function moveBehindDees(properties:any){                
    var bspeed = calcul.SpeedEndAccel(properties.accel,speed,0, (rendertime*0.001*speedup));
    if(leftside==false){
        obj.x +=bspeed * (rendertime*0.001*speedup); 
    }
    else if(leftside==true){
        obj.x -=bspeed * (rendertime*0.001*speedup); 
    }
    angle = 0;
}

export const textElement=(classname:any, x:any,y:any,z:any)=>{
    const element = document.createElement('p');
    element.className =classname;
    const cssLabel = new CSS2DObject(element);
    scene.add(cssLabel);
    cssLabel.position.set(x,y,z);
    return element;
}

export const sliderElement=(id:any,min:any,max:any,value:any,x:any,y:any,z:any)=>{
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

    const sliderPointlabel = new CSS2DObject(sliderinfo.slidercontainer);
    scene.add(sliderPointlabel);
    sliderPointlabel.position.set(x,y,z)

    return sliderinfo;
}

export const buttonElement=(value:any,classname:any, x:any,y:any,z:any)=>{
    const button = document.createElement('button');
    button.type ='button';
    button.className = classname;
    button.textContent=value;
    const cssButton = new CSS2DObject(button);
    scene.add(cssButton);
    cssButton.position.set(x,y,z);
    return button;
}

export function startCyclotron(){
    running = true;
}

export function stopCyclotron(){
    running = false;
}

export function resetcyclotron(){
    timepassed =0;
    speed=0;
    angle=0;
    radius=0;
    distance=0;
    orbitspeed=0;
    backupx=0;
    backupy=0;    
    running =false;
    speedup=speedupB;
    leftside=leftsideB;

    obj.x=0.00;
    obj.y=0.00;
    obj.z=0.00;
    
}