//returns accelaration in speed a second
export function Accelaration(q,e,m){
    var a = (q*e)/m
    return a;
}
//returns time in seconds
export function AccelTime(a,d){
    var t = Math.sqrt((2*d)/a)
    return t;
}

export function SpeedEndAccel(a, vb, tb,te){
    var ve =(a*(te-tb))+vb;
    return ve;
}

export function angle(v,r){
    var w = (v/r);
    return w;
}

export function radius(v,m,q,b){
    //radius
    var r = (v*m)/(q*b);
    return r;
}

export function cos(d,r){
    var y = Math.cos(d)*r;
    return y;
}

export function sin(d,r){
    var x = Math.sin(d)*r;
    return x;
}

export function DegreesToRad(degrees){
    var rad = degrees*(Math.PI/180);
    return rad;
}


export function DistAccel(v,a,t){
var s =(v*t) + (0.5*a*(t**2));
 return s;
}