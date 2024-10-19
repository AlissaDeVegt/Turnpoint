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
    var ve =a*(te-tb)+vb;
    return ve;
}