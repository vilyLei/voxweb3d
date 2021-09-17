
import MathConst from "../../vox/math/MathConst";

class AngleDegreeTween {

    private m_preDegree: number = 0;
    private m_degSpd: number = 0.0;
    private m_degree: number = 0.0;
	
	factor: number = 0.01;
    speed: number = 0.01;
    constructor() {
    }
    
    calcDegree(degree: number): number {
        
        let offsetDegree: number = MathConst.GetMinDegree(this.m_preDegree,degree);

        let tdDeg: number = offsetDegree * this.factor;
        let currDegree: number = this.m_preDegree + this.m_degSpd;
        this.m_preDegree = currDegree;
        
        this.m_degSpd += offsetDegree > 0.0 ? this.speed : -this.speed;
        if( Math.abs(this.m_degSpd) > Math.abs(tdDeg)) {
            this.m_degSpd = tdDeg;
        }
		this.m_degree = this.m_preDegree + this.m_degSpd;
        return this.m_degree;
    }
    getDegree(): number {        
        return this.m_preDegree + this.m_degSpd;
    }
    setDegree(degree: number): void {
        this.m_preDegree = degree;
        this.m_degSpd = 0.0;
		this.m_degree = degree;
    }
}

export {AngleDegreeTween};