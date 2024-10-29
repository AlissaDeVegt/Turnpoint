'use client';
import React,{useRef,useEffect} from "react";
import * as THREE from 'three';
import * as calcul from "../Math/Calculation"


var obj={
    x:0.00,
    y:0.00,
    z:0.00
  }

  var timepassed =0;
  var speed =0;
  var angle =0;
  var rendertime =0;
  var radius=0;
  var distance = 0;

  var backupx = 0;
  var backupy = 0;


  export var text = 'test';

export const ThreeScene =({properties}:any)=>{

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if(typeof window !=='undefined'){
            const scene=new THREE.Scene();
            const camera =new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000)
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth,window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.rotation.x =-90 * (Math.PI / 180);
            //camera.position.z = -15;
            const geometry = new THREE.SphereGeometry();
            const material = new THREE.MeshBasicMaterial({color : 0x00ff00});
            const endpointmat = new THREE.MeshBasicMaterial({color : 0xBA0109});
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            const sphereleft = new THREE.Mesh(geometry, endpointmat);
            scene.add(sphereleft);
            const sphereright = new THREE.Mesh(geometry, endpointmat);
            scene.add(sphereright);

            sphere.position.y = -100;

            sphereleft.position.y = -100;
            sphereright.position.y = -100;
            sphereleft.position.x = -6;
            sphereright.position.x = 6;
            

            const renderScene=(rendert:any)=> {
                //setting all speed times 0.001 as way of tempo Aka 1 milisecond.
                //get render time to fix
                

                text= 'Current speed : ' + speed;
                text = text + '. Current Radius : ' + radius;

                distance = calcul.DistAccel(speed,properties.accel,rendertime);
                if (radius>(properties.radius*0.1)){
                    var bspeed = calcul.SpeedEndAccel(properties.accel,speed,0, rendertime);
                    if(properties.left==false){
                        obj.x +=bspeed * rendertime*0.000001; 
                    }
                    else if(properties.left==true){
                        obj.x -=bspeed * rendertime * 0.000001; 
                    }

                }
                else if(obj.x <(0.5*properties.spacebetween) && obj.x >(-0.5*properties.spacebetween)){ 
                    speed = calcul.SpeedEndAccel(properties.accel,speed,0, rendertime);
                    if(properties.left==true){
                        obj.x -= distance * 0.000001; //test numbers
                    }
                    else if(properties.left==false){
                        obj.x += distance * 0.000001; //test numbers
                    }

                    if (obj.x>=0.5*properties.spacebetween){
                        obj.x = 0.5*properties.spacebetween;
                    }                    
                    else if (obj.x<=-0.5*properties.spacebetween){
                        obj.x = -0.5*properties.spacebetween;
                    }

                    angle =0;
                    backupx = obj.x;
                    backupy = obj.y;
                    timepassed = timepassed+rendertime;
                }
                else{
                    radius = calcul.radius(speed,properties.mass,properties.load,2) * 0.01;
                    var orbitspeed = calcul.angle(speed,radius);
                    var rad = rendertime * orbitspeed;
                    angle +=rad;
                    if (obj.x>=(0.5*properties.spacebetween) ){

                        if(angle<=calcul.DegreesToRad(90)){
                            obj.x = backupx + calcul.sin(angle,radius); 
                            obj.y = backupy - calcul.cos(angle,radius);
                        }
                        else{
                            obj.x = backupx - calcul.sin(angle,radius); 
                            obj.y = backupy - calcul.cos(angle,radius);
                            properties.left = true;
                        }
                    }
                    else if (obj.x<=(-0.5*properties.spacebetween) ){
                        if(angle<=calcul.DegreesToRad(90)){
                            obj.x = backupx - calcul.sin(angle,radius); 
                            obj.y = backupy + calcul.cos(angle,radius);

                        }
                        else{
                            properties.left = false;
                            obj.x = backupx + calcul.sin(angle,radius); 
                            obj.y = backupy + calcul.cos(angle,radius);
                        }
                    }
                    text = text + ' Angle : ' + angle;
                    text = text + ' Going left : ' + properties.left;
                }

                sphere.position.x =(obj.x);
                sphere.position.z =(obj.y);
                //sphere.position.z; camera has top view so z = y in 2d space
                
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            };

            let starttime = performance.now();
            renderScene(rendertime);
            let endtime = performance.now();
            rendertime = endtime-starttime;
            //initialise three.js
        }
    }, []);
    return (<div> 
        <p id="p1"> {text}</p>
        <div ref={containerRef}/>
    </div>)

};

