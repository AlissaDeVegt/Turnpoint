//---------------------------------------index ------------------
// a = Accelaration m/s^2
// b = magneticflux
// d = distance meter
// e = electric field
// m = mass kilogram
// q = particle load (+/-)
// r = radius meter
// R = radians 
// t = time seconds
// tb = begin time
// te = end time
// v = speed m/s
// vb = begin speed
// ve = end speed
// w = anglespeed m/s

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

//returns final speed after time
export function SpeedEndAccel(a, vb, tb,te){
    var ve =(a*(te-tb))+vb;
    return ve;
}

//calculation anglespeed
export function angle(v,r){
    var w = (v/r);
    return w;
}

//calculate radius using mass speed magnetic flux and load
export function radius(v,m,q,b){
    var r = (v*m)/(q*b);
    return r;
}

//calculate y point on circle using rads
export function cos(R,r){
    var y = Math.cos(R)*r;
    return y;
}

//calculate x point on circle using rads
export function sin(R,r){
    var x = Math.sin(R)*r;
    return x;
}

//turn degrees in to radians
export function DegreesToRad(degrees){
    var R = degrees*(Math.PI/180);
    return R;
}

//calculate the distance object had moved withing a time frame while accalerating.
export function DistAccel(v,a,t){
    var d =(v*t) + (0.5*a*(t**2));
    return d;
}