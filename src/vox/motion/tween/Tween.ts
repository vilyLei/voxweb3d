/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class Tween_Linear {

    easeIn(t: number,b: number,c: number,d: number): number{
        return c*t/d + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return c*t/d + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        return c*t/d + b;
    }
}
class Tween_Quad {

    easeIn(t: number,b: number,c: number,d: number): number{
        return c*(t/=d)*t + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return -c *(t/=d)*(t-2) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    }
}
class Tween_Cubic {

    easeIn(t: number,b: number,c: number,d: number): number{
        return c*(t/=d)*t*t + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return c*((t=t/d-1)*t*t + 1) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    }
}
class Tween_Quart {

    easeIn(t: number,b: number,c: number,d: number): number{
        return c*(t/=d)*t*t*t + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    }
}
class Tween_Quint {

    easeIn(t: number,b: number,c: number,d: number): number{
        return c*(t/=d)*t*t*t*t + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    }
}

class Tween_Sine {

    easeIn(t: number,b: number,c: number,d: number): number{
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    }
}

class Tween_Expo {

    easeIn(t: number,b: number,c: number,d: number): number{
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
}

class Tween_Circ {

    easeIn(t: number,b: number,c: number,d: number): number{
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }
}

class Tween_Elastic {

    easeIn(t: number,b: number,c: number,d: number, a: number,p: number): number{
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    }
    easeOut(t: number,b: number,c: number,d: number, a: number,p: number): number{
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
    }
    easeInOut(t: number,b: number,c: number,d: number, a: number,p: number): number{
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    }
}

class Tween_Back {

    easeIn(t: number,b: number,c: number,d: number, s: number): number{
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    }
    easeOut(t: number,b: number,c: number,d: number, s: number): number{
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }
    easeInOut(t: number,b: number,c: number,d: number, s: number): number{
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }
}


class Tween_Bounce {

    easeIn(t: number,b: number,c: number,d: number): number{
        return c - this.easeOut(d-t, 0, c, d) + b;
    }
    easeOut(t: number,b: number,c: number,d: number): number{
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    }
    easeInOut(t: number,b: number,c: number,d: number): number{
        if (t < d/2) return this.easeIn(t*2, 0, c, d) * .5 + b;
        else return this.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
}

class Tween {
    constructor() {}
    readonly linear = new Tween_Linear();
    readonly quad = new Tween_Quad();
    readonly quart = new Tween_Quart();
    readonly quint = new Tween_Quint();
    readonly sine = new Tween_Sine();
    readonly expo = new Tween_Expo();
    readonly circ = new Tween_Circ();
    readonly elastic = new Tween_Elastic();
    readonly back = new Tween_Back();
    readonly bounce = new Tween_Bounce();
}