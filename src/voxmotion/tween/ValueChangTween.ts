class ValueChangTween {

    private m_preValue: number = 0;
    private m_valueSpd: number = 0.0;
    private m_value: number = 0.0;
	
	factor: number = 0.01;
    speed: number = 0.01;
    constructor() {
    }
    
    calcValue(degree: number): number {
        
        let offsetValue: number = degree - this.m_preValue;

        let tdDeg: number = offsetValue * this.factor;
        let currValue: number = this.m_preValue + this.m_valueSpd;
        this.m_preValue = currValue;
        
        this.m_valueSpd += offsetValue > 0.0 ? this.speed : -this.speed;
        if( Math.abs(this.m_valueSpd) > Math.abs(tdDeg)) {
            this.m_valueSpd = tdDeg;
        }
		this.m_value = this.m_preValue + this.m_valueSpd;
        return this.m_value;
    }
    getValue(): number {        
        return this.m_preValue + this.m_valueSpd;
    }
    setValue(degree: number): void {
        this.m_preValue = degree;
        this.m_valueSpd = 0.0;
		this.m_value = degree;
    }
}

export {ValueChangTween};