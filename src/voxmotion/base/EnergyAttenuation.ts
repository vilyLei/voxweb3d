
import MathConst from "../../vox/math/MathConst";

class EnergyAttenuation {

    private m_totalEnergy: number = 1.0;
    private m_initEnergy: number = 1.0;
    private m_dEnergy: number = 1.0;
    private m_energy: number = 0.0;
    time: number = 0;
    dTime: number = 2.0;
    velocity: number = 0;
    attenuation: number = 0.50;
    constructor() {
    }
    setEnergy(e: number): void {

        this.m_totalEnergy = e;
        this.m_initEnergy = e;
        //this.m_energy = e;
        this.m_dEnergy = 0.05 * e;
        // if(this.velocity < 0.1) {
        //     this.velocity = 0.1 * this.m_energy;
        // }
        this.time = 0;
    }
    run(): void {
        //if(Math.abs(this.velocity) > 0.001) {
            // 能量聚集和能量释放的过程
            let fk: number = 1.0 / (1.0 + this.time * this.time);
            //let pe: number = 0.1 * this.m_totalEnergy;
            //let dE: number = this.m_totalEnergy - pe;
            //this.m_totalEnergy = pe;
            
            let accelerationVelocity: number = fk * this.m_energy;
            this.velocity += accelerationVelocity;
            this.velocity *= this.attenuation;
            console.log(">>");
            console.log("fk: ",fk);
            console.log("this.velocity: ",this.velocity);
            console.log("this.m_energy: ",this.m_energy);

            if(this.m_totalEnergy > 0.01) {
                this.m_energy += this.m_dEnergy;
                this.m_totalEnergy -= this.m_dEnergy;
                console.log("this.m_totalEnergy: ",this.m_totalEnergy);
                this.m_dEnergy += this.m_dEnergy + 1.5 * this.m_dEnergy;
                if(this.m_energy > this.m_initEnergy) {
                    this.m_energy = this.m_initEnergy;
                }
            }
            else {
                this.time += this.dTime;
            }

        //}
        // else {
        //     console.log(">> stop()...");
        // }
    }
    isMoving(): boolean {
        return this.m_totalEnergy > 0.01 || Math.abs(this.velocity) > 0.001;
    }
    
}

export {EnergyAttenuation};