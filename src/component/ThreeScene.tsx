'use client';
import * as THREE from 'three';
import * as calcul from "../Math/Calculation"
import * as cyclotron from "../Cyclotron/Controle"
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'

//#region variables
let scene,renderer,camera,render2d; //render components
let particle, sphereleft,sphereright, arrowbody, arrowhead, leftcableD, leftcableBat, rightcableD, rightcableBat, batteryshort, batterylong; //3d objects
let redMat, blueMat; //materials
let p, pspeed,speedslider, startbutton,pauzebutton,refreshbutton; //ui that stays
let electricfield, electricfieldT, magneticflux,magneticfluxT; //ui sliders and the text of the sliders that hides when its running 
let running =false, cameradepth =-10, batteryspace=3; //some changable start variables
//#endregion

//starting
var prop={
    accel:0,
    rendertime:0.01,
    spacebetween:0.5,
    radiusCycl:1.2,
    left:false,
    load:1,
    mass:1,
    collisionpoint:0,
    magneticflux:2,
    speedup:1,
    electricfield: 1,
    obj: {
        x:0.00,
        y:0.00,
        z:0.00
    },
    backupx : 0,
    backupy :0,
    radius:0,
    angle:0,
    speed:0,
}

//the actual component that the client gets
export const ThreeScene =()=>{

    if(typeof window !=='undefined'){

        init();

        createObjects();
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
            electricfieldT.textContent = "electricfield set to : " + electricfield.slider.value;
            magneticfluxT.textContent = "magneticflux set to : " + magneticflux.slider.value;

            prop.electricfield = electricfield.slider.value;
            prop.magneticflux = magneticflux.slider.value;
            prop.speedup = speedslider.slider.value; 
            
            prop.accel = calcul.Accelaration(prop.load,prop.electricfield*0.01,prop.mass);

            if(running ==true){

                //hide certain aspectchange
                hide();
                p.textContent = prop.speed + "meter per seconde";

                if (prop.radius>(prop.radiusCycl)){
                    prop = cyclotron.moveBehindDees(prop);
                }
                else if(prop.obj.x <(0.5*prop.spacebetween) && prop.obj.x >(-0.5*prop.spacebetween)){ 
                    change();
                    prop = cyclotron.moveBetweenDees(prop)
                }
                else{
                    prop = cyclotron.moveInDees(prop);
                    
                }
            }
            else{
                //show aspects
                show();
            }
            particle.position.x =(prop.obj.x);
            particle.position.z =(prop.obj.y);
            
            render2d.render(scene,camera);
            renderer.render(scene, camera);
            
            requestAnimationFrame(renderScene);
            
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
    camera.rotation.x =calcul.DegreesToRad(-90); //rotates downwards to get top view. requires all objects to have lower than the camera or the camera higher than the objects.

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.domElement.style.position = 'absolute';

    render2d = new CSS2DRenderer(); 
    render2d.setSize(window.innerWidth,window.innerHeight);
    render2d.domElement.style.position = 'absolute';
    
    document.body.appendChild(render2d.domElement);
    document.body.appendChild(renderer.domElement);
};

//creates all 3d components
function createObjects(){
    //#region geometry
    //-------------------------------------sphere--------------------------------------------
    const particlegeometry = new THREE.SphereGeometry(0.05);

    //-------------------------------------circle--------------------------------------------
    const deeleftgeometry = new THREE.CircleGeometry(prop.radiusCycl,32,0,Math.PI);
    const deerightgeometry = new THREE.CircleGeometry(prop.radiusCycl,32,Math.PI,Math.PI);

    //-------------------------------------cylinder-----------------------------------------
    const cableDmesh  = new THREE.CylinderGeometry( 0.02, 0.02, batteryspace, 32 ); 
    const cableBatmesh  = new THREE.CylinderGeometry( 0.02, 0.02, prop.spacebetween, 32 ); 
    const beammesh  = new THREE.CylinderGeometry( 0.01, 0.01, 0.8 * prop.spacebetween, 32 ); 
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
    sphereleft.position.x = -0.4*prop.spacebetween;
    sphereright.position.x = 0.4*prop.spacebetween;

    arrowhead.position.x = 0.5*prop.spacebetween;

    batterylong.position.z = batteryspace;
    batterylong.position.x = 0.05;
    batteryshort.position.z = batteryspace;
    batteryshort.position.x = -0.05;

    leftcableD.position.x=0.05 + prop.spacebetween;
    leftcableD.position.z = 0.5 * batteryspace;
    leftcableBat.position.z = batteryspace;
    leftcableBat.position.x = 0.05 + 0.5*prop.spacebetween;

    rightcableD.position.x=-0.05 - prop.spacebetween;
    rightcableD.position.z = 0.5 * batteryspace;
    rightcableBat.position.z = batteryspace;
    rightcableBat.position.x = -0.05 - 0.5*prop.spacebetween;
    //#endregion
}

//creates ui and calls all element functions
function createUI(){

    startbutton = buttonElement('start','buttons',-8,-10,-4.25);
    startbutton.addEventListener("click", startCyclotron);

    pauzebutton = buttonElement('pauze','buttons',-7.5,-10,-4.25);
    pauzebutton.addEventListener("click", stopCyclotron);

    refreshbutton = buttonElement('reset','buttons',-8.5,-10,-4.25);
    refreshbutton.addEventListener("click", resetcyclotron) ;


    p = textElement('UIText',-8,-10,-4)

    speedslider = sliderElement('speedslider','1','20','1',-8,-10,-3.5);
    pspeed = textElement('UIText',-6.5,-10,-3.7);
    electricfield = sliderElement('speedslider','1','20','1',-8,-10,-3.3);
    electricfieldT = textElement('UIText',-6.4,-10,-3.5);
    magneticflux = sliderElement('speedslider','1','20','1',-8,-10,-3.1);
    magneticfluxT = textElement('UIText',-6.4,-10,-3.3);
}

//creates a new ui textelement for in Three
export const textElement=(classname:any, x:any,y:any,z:any)=>{
    const element = document.createElement('p');
    element.className =classname;
    const cssLabel = new CSS2DObject(element);
    scene.add(cssLabel);
    cssLabel.position.set(x,y,z);
    return element;
}

//creates a new ui sliderelement for in Three
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

//creates a new ui buttonelement for in Three
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

//starts teh sm
export function startCyclotron(){
    running = true;
}

//stops the sim
export function stopCyclotron(){
    running = false;
}

//resets the sim
export function resetcyclotron(){

    prop.speed=0;
    prop.angle=0;
    prop.radius=0;
    prop.backupx=0;
    prop.backupy=0;    
    running =false;
    prop.speedup=1;
    prop.left=false;

    prop.obj.x=0.00;
    prop.obj.y=0.00;
    prop.obj.z=0.00;
    
}

//hides sliders that bugs out during running of sim
function hide(){
    electricfield.slider.style.display = 'none';
    electricfieldT.style.display =  'none';
    magneticflux.slider.style.display = 'none';
    magneticfluxT.style.display = 'none';
}

//Shows sliders that bugs out during running of sim
function show(){
    electricfield.slider.style.display = 'block';
    electricfieldT.style.display = 'block';
    magneticflux.slider.style.display = 'block';
    magneticfluxT.style.display = 'block';
}

//Showcases the direction and change in flow of electric power
function change () {
    if (prop.left ==false){

        sphereright.material = blueMat;
        sphereleft.material = redMat;

        arrowhead.rotation.y = calcul.DegreesToRad(180);
        arrowhead.position.x = 0.4*prop.spacebetween;

        leftcableBat.material=blueMat;
        leftcableD.material=blueMat;

        rightcableBat.material=redMat;
        rightcableD.material=redMat;

        batterylong.position.x =-0.05;
        batteryshort.position.x =0.05;

    }
    else{
        sphereright.material = redMat;
        sphereleft.material = blueMat;

        arrowhead.rotation.y = 0;
        arrowhead.position.x = -0.4*prop.spacebetween;

        leftcableBat.material=redMat;
        leftcableD.material=redMat;

        rightcableBat.material=blueMat;
        rightcableD.material=blueMat;

        batterylong.position.x =0.05;
        batteryshort.position.x =-0.05;
    }
}