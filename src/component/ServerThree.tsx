'use client';
import * as THREE from 'three';
import * as calcul from "../Math/Calculation";

let scene,renderer,camera,render2d; //render components
let particle, sphereleft,sphereright, arrowbody, arrowhead, leftcableD, leftcableBat, rightcableD, rightcableBat, batteryshort, batterylong; //3d objects
let redMat, blueMat; //materials
let cameradepth =-10, batteryspace=3; //some changable start variables


//actual component send to the page
export const ThreeScene =({properties}:any)=>{

    if(typeof window !=='undefined'){
        init();
        createObjects(properties);
        
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        const renderScene=()=> {
            if (properties.redleft ==true&&properties.redright ==false){

                sphereright.material = blueMat;
                sphereleft.material = redMat;
        
                arrowhead.rotation.y = calcul.DegreesToRad(180);
                arrowhead.position.x = 0.4*properties.spacebetween;
        
                leftcableBat.material=blueMat;
                leftcableD.material=blueMat;
        
                rightcableBat.material=redMat;
                rightcableD.material=redMat;
        
                batterylong.position.x =-0.05;
                batteryshort.position.x =0.05;
        
            }
            else if (properties.redleft ==false &&properties.redright ==true){
                sphereright.material = redMat;
                sphereleft.material = blueMat;
        
                arrowhead.rotation.y =  calcul.DegreesToRad(0);
                arrowhead.position.x = -0.4*properties.spacebetween;
        
                leftcableBat.material=redMat;
                leftcableD.material=redMat;
        
                rightcableBat.material=blueMat;
                rightcableD.material=blueMat;
        
                batterylong.position.x =0.05;
                batteryshort.position.x =-0.05;
            }

            particle.position.x =(properties.objx);
            particle.position.z =(properties.objy);
            renderer.render(scene, camera);  
        };

        renderScene();

        return () => {
            window.removeEventListener('resize', handleResize);
            };

    }

    return renderer;
};

//initialises three and the renderers
function init(){
    scene=new THREE.Scene();

    camera =new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,10000)
    camera.rotation.x =calcul.DegreesToRad(-90);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    
    document.body.appendChild(renderer.domElement);
};

//creates all 3d components
function createObjects(properties:any){

    //#region geometry
    //-------------------------------------sphere--------------------------------------------
    const particlegeometry = new THREE.SphereGeometry(0.05);

    //-------------------------------------circle--------------------------------------------
    const deeleftgeometry = new THREE.CircleGeometry(properties.radiusCycl,32,0,Math.PI);
    const deerightgeometry = new THREE.CircleGeometry(properties.radiusCycl,32,Math.PI,Math.PI);

    //-------------------------------------cylinder-----------------------------------------
    const cableDmesh  = new THREE.CylinderGeometry( 0.02, 0.02, batteryspace, 32 ); 
    const cableBatmesh  = new THREE.CylinderGeometry( 0.02, 0.02, properties.spacebetween, 32 ); 
    const beammesh  = new THREE.CylinderGeometry( 0.01, 0.01, 0.8 * properties.spacebetween, 32 ); 
    const batterylongmesh  = new THREE.CylinderGeometry( 0.02, 0.02, 1, 32 ); 
    const batteryshortmesh  = new THREE.CylinderGeometry( 0.03, 0.03, 0.4, 32 ); 

    //-------------------------------------cone-------------------------------------------
    const headmesh = new THREE.ConeGeometry(0.2, 0.2, 32);
    //#endregion 

    //#region Materials
    const particleMat = new THREE.MeshBasicMaterial({color : 0x00ff00});

    redMat = new THREE.MeshBasicMaterial({color : 0xBA0109}); //+
    blueMat = new THREE.MeshBasicMaterial({color : 0X0000ff}); //-
    redMat.side = THREE.DoubleSide;
    blueMat.side = THREE.DoubleSide;
    //#endregion

    //#region Meshes
    particle = new THREE.Mesh(particlegeometry, particleMat);
    sphereleft = new THREE.Mesh(deeleftgeometry, blueMat);
    sphereright = new THREE.Mesh(deerightgeometry, redMat);

    arrowbody = new THREE.Mesh(beammesh, blueMat);
    arrowhead = new THREE.Mesh(headmesh, blueMat);

    batterylong=new THREE.Mesh(batterylongmesh, redMat); //+
    batteryshort=new THREE.Mesh(batteryshortmesh, blueMat); //-

    leftcableD=new THREE.Mesh(cableDmesh, redMat); //cable into dee
    leftcableBat=new THREE.Mesh(cableBatmesh, redMat); //cable into bat

    rightcableD=new THREE.Mesh(cableDmesh, blueMat); //cable into dee
    rightcableBat=new THREE.Mesh(cableBatmesh, blueMat); //cable into bat
    //#endregion

    //#region Add to scene
    scene.add(particle);
    scene.add(sphereleft);
    scene.add(sphereright);
    scene.add(arrowbody);
    scene.add(arrowhead);
    scene.add(batterylong);
    scene.add(batteryshort);
    scene.add(leftcableBat);
    scene.add(leftcableD);
    scene.add(rightcableBat);
    scene.add(rightcableD);
    //#endregion

    //#region Ypos
    particle.position.y = cameradepth;
    
    sphereleft.position.y = cameradepth;
    sphereright.position.y = cameradepth;

    arrowbody.position.y = cameradepth;
    arrowhead.position.y = 2*cameradepth;
    
    batteryshort.position.y = cameradepth;
    batterylong.position.y = cameradepth;

    leftcableD.position.y=cameradepth;
    leftcableBat.position.y=cameradepth;

    rightcableD.position.y=cameradepth;
    rightcableBat.position.y=cameradepth;
    //#endregion

    //#region Rotation
    sphereright.rotation.x = calcul.DegreesToRad(90);
    sphereright.rotation.z = calcul.DegreesToRad(90);
    
    sphereleft.rotation.x = calcul.DegreesToRad(90);
    sphereleft.rotation.z = calcul.DegreesToRad(90);

    arrowbody.rotation.x = calcul.DegreesToRad(90);
    arrowbody.rotation.z = calcul.DegreesToRad(90);

    arrowhead.rotation.x = calcul.DegreesToRad(90);
    arrowhead.rotation.z = calcul.DegreesToRad(90);
    arrowhead.rotation.y = calcul.DegreesToRad(180);

    leftcableD.rotation.z = calcul.DegreesToRad(90);
    leftcableD.rotation.y = calcul.DegreesToRad(90);

    leftcableBat.rotation.z = calcul.DegreesToRad(90);

    rightcableD.rotation.z = calcul.DegreesToRad(90);
    rightcableD.rotation.y = calcul.DegreesToRad(90);

    rightcableBat.rotation.z = calcul.DegreesToRad(90);

    //#endregion

    //#region positions
    sphereleft.position.x = -0.4*properties.spacebetween;
    sphereright.position.x = 0.4*properties.spacebetween;

    arrowhead.position.x = 0.5*properties.spacebetween;

    batterylong.position.z = batteryspace;
    batterylong.position.x = 0.05;
    batteryshort.position.z = batteryspace;
    batteryshort.position.x = -0.05;

    leftcableD.position.x=0.05 + properties.spacebetween;
    leftcableD.position.z = 0.5 * batteryspace;
    leftcableBat.position.z = batteryspace;
    leftcableBat.position.x = 0.05 + 0.5*properties.spacebetween;

    rightcableD.position.x=-0.05 - properties.spacebetween;
    rightcableD.position.z = 0.5 * batteryspace;
    rightcableBat.position.z = batteryspace;
    rightcableBat.position.x = -0.05 - 0.5*properties.spacebetween;
    //#endregion
    
}