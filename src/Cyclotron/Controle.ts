import * as calcul from "../Math/Calculation"

//The function that determines the location of the particle while in a D.
//Its currently determined to always move counter clockwise. 
//In reality its should be able to go the otherway depending on on the directipon of the magnetic power (aka up or down).
//The particle has no accelarition so we can use a constant speed to calculate its constant rotation speed, 
//which inturn can be used to calculate the radians at which the particle is at a certain moment in time
//inside dees particles move in a circle (simply said).
//We can simply use the idea of calculating the point on a circle by using the point at which the particle entered aka the backup.
//this will then give and illusion that it moves in a circle.
export function moveInDees(properties:any){
    properties.radius = calcul.radius(properties.speed,properties.mass,properties.load,properties.magneticflux);
    var orbitspeed = calcul.angle(properties.speed,properties.radius);
    var rad = (properties.rendertime*properties.speedup)* orbitspeed;
    properties.angle += rad;
    
    //the if statements are used to determine in which Dee it is.
    if (properties.obj.x>=(0.5*properties.spacebetween)){

        if(properties.angle>calcul.DegreesToRad(90) && properties.left == false){
            properties.left =true;
        }
        properties.obj.x = properties.backupx + calcul.cos(calcul.DegreesToRad(270)+(properties.angle),properties.radius); 
        properties.obj.y = (properties.backupy + calcul.sin(calcul.DegreesToRad(270),properties.radius)) - calcul.sin(calcul.DegreesToRad(270)+(properties.angle),properties.radius); 

    }
    else if (properties.obj.x<=(-0.5*properties.spacebetween) ){ 
        if(properties.angle>calcul.DegreesToRad(90) && properties.left == true){
            properties.left =false;
        }
        properties.obj.x = properties.backupx + calcul.cos(calcul.DegreesToRad(90)+(properties.angle),properties.radius); 
        properties.obj.y = (properties.backupy + calcul.sin(calcul.DegreesToRad(90),properties.radius)) - calcul.sin(calcul.DegreesToRad(90)+(properties.angle),properties.radius); 
    }
    return properties;
}

//This function will determine how the particle moves while in between the dees.
//The particle moves in a straight line with a constant increase in speed (as the particle has an accelaration in this stage).
//This requires to determine the distance made in a certain time with which we then can calculate what the new position is.

export function moveBetweenDees(properties:any){

    properties.accel = calcul.Accelaration(properties.load,properties.electricfield*0.01,properties.mass);
    properties.speed = calcul.SpeedEndAccel(properties.accel,properties.speed ,0, (properties.rendertime *properties.speedup));
    let distance = calcul.DistAccel(properties.speed,properties.accel,(properties.rendertime*properties.speedup));

    if(properties.left==true){
        properties.obj.x -= distance; 
    }
    else if(properties.left==false){
        properties.obj.x += distance; 
    }

    if (properties.obj.x>=0.5*properties.spacebetween){
        properties.obj.x = 0.5*properties.spacebetween;
    }                    
    else if (properties.obj.x<=-0.5*properties.spacebetween){
        properties.obj.x = -0.5*properties.spacebetween;
    }
    properties.angle = 0;
    properties.backupx = properties.obj.x;
    properties.backupy = properties.obj.y;
    return properties;
}

//This is the function that determines how the particle move after it left the particle accelerator.
//Uses a constant speed and time to determine new location.
//-----TODO take kinetic energie into account
export function moveBehindDees(properties:any){                
    var bspeed = calcul.SpeedEndAccel(properties.accel,properties.speed,0, (properties.rendertime*properties.speedup));
    if(properties.left==false){
        properties.obj.x +=bspeed * (properties.rendertime*properties.speedup); 
    }
    else if(properties.left==true){
        properties.obj.x -=bspeed * (properties.rendertime*properties.speedup); 
    }
    properties.angle = 0;

    return properties;
}