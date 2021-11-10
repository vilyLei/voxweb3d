
import MathConst from "../../vox/math/MathConst";

class EnergyAttenuation {

    private m_totalEnergy: number = 1.0;
    private m_initEnergy: number = 1.0;
    private m_dEnergy: number = 1.0;
    private m_energy: number = 0.0;
    /**
     * 能量转化效率
     */
    conversionEfficiency: number = 0.1;
    time: number = 0;
    dTime: number = 1.0;
    velocity: number = 0;
    maxVelocity: number = 0.5;
    attenuation: number = 0.50;
    constructor() {
    }
    reset(): void {
        this.time = 0;
        this.velocity = 0;
        this.m_energy = 0.0;
    }

    setEnergy(energy: number): void {

        this.m_initEnergy = energy;        
        
        let fk: number = 1.0 / (1.0 + this.time * this.time);
        this.m_energy *= fk;
        
        this.m_initEnergy = this.m_energy + energy;
        this.m_totalEnergy = this.m_initEnergy;

        this.m_dEnergy = this.conversionEfficiency * this.m_initEnergy;
        this.time = 0;
    }
    run(): void {
        if( this.isMoving() ) {
            // 随着时间的推移，能转化为动能的能量比率越来越低
            let fk: number = 1.0 / (1.0 + this.time * this.time);
                        
            let accelerationVelocity: number = fk * this.m_energy;
            // 化学能转化为动能
            this.velocity += accelerationVelocity;
            // 阻力消耗动能
            this.velocity *= this.attenuation;
            if(this.velocity > this.maxVelocity) {
                this.velocity = this.maxVelocity;
            }
            // console.log(">>");
            // console.log("fk: ",fk);
            // console.log("this.velocity: ",this.velocity);
            // console.log("this.m_energy: ",this.m_energy);

            if(this.m_totalEnergy > 0.01) {
                this.m_energy += this.m_dEnergy;
                if(this.m_totalEnergy > this.m_dEnergy) {
                    this.m_totalEnergy -= this.m_dEnergy;
                } else {
                    this.m_dEnergy = this.m_totalEnergy;
                    this.m_totalEnergy = 0.0;
                }
                //console.log("E release >>, this.m_dEnergy: ",this.m_dEnergy);
                // 模拟能量释放过程, 可以是多种曲线拟合形式
                this.m_dEnergy += this.m_dEnergy;
                if(this.m_energy > this.m_initEnergy) {
                    this.m_energy = this.m_initEnergy;
                }
                //console.log("this.m_totalEnergy: ",this.m_totalEnergy,", this.m_energy",this.m_energy);
            }
            else {
                this.time += this.dTime;
            }
        }
    }
    isMoving(): boolean {
        return this.m_totalEnergy > 0.01 || Math.abs(this.velocity) > 0.001;
    }
    
}

export {EnergyAttenuation};