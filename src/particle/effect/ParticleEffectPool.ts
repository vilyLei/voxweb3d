/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IParticleEffect from "../../particle/effect/IParticleEffect";
import IRenderer from "../../vox/scene/IRenderer";
import IRunnable from "../../vox/base/IRunnable";
export default class ParticleEffectPool implements IRunnable {
    protected m_effList: IParticleEffect[] = [];
    protected m_freeEffList: IParticleEffect[] = [];
    protected m_renderer: IRenderer = null;
    protected m_renderProcessI: number = 0;
    timeSpeed: number = 6.0;
    constructor() { }

    createEffect(pv: Vector3D): void {

    }

    private m_runFlag: number = 0;
    setRunFlag(flag: number): void {
        this.m_runFlag = flag;
    }
    getRunFlag(): number {
        return this.m_runFlag;
    }
    isRunning(): boolean {
        return true;
    }
    isStopped(): boolean {
        return false;
    }
    run(): void {
        let list: IParticleEffect[] = this.m_effList;
        let len: number = list.length;
        let i: number = 0;
        let eff: IParticleEffect;
        for (; i < len; ++i) {
            eff = list[i];
            //console.log("eff.isAwake():",eff.isAwake());
            if (eff.isAwake()) {
                eff.updateTime(this.timeSpeed);
            }
            else {
                eff.setVisible(false);
                list.splice(i, 1);
                i--;
                len--;
                this.m_freeEffList.push(eff);
            }
        }
    }
}