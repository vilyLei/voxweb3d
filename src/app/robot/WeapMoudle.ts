/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IRunnable from "../../vox/base/IRunnable";
import RendererScene from "../../vox/scene/RendererScene";
import RunnableModule from "../../app/robot/scene/RunnableModule";
import BulEntity from "../../app/robot/BulEntity";
import IAttackDst from "../../app/robot/attack/IAttackDst";
import { CampType } from "../../app/robot/camp/Camp";

export default class WeapMoudle implements IRunnable {
    private m_rsc: RendererScene = null;
    private m_freePool: BulEntity[] = [];
    private m_bulList: BulEntity[] = [];
    constructor(rsc: RendererScene) {
        this.m_rsc = rsc;
    }
    createAtt(type: number, pos0: Vector3D, pos1: Vector3D, attDst: IAttackDst, campType: CampType): void {
        let bul: BulEntity;
        if (this.m_bulList.length > 0) {
            bul = this.m_bulList.pop();
            bul.reset();
        }
        else {
            bul = new BulEntity(this.m_rsc);
            bul.initialize(0);
        }
        bul.setPosParam(pos0, pos1, attDst, campType);
        this.m_bulList.push(bul);
        RunnableModule.RunnerQueue.addRunner(this);
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
        let bul: BulEntity;
        for (let i: number = 0, il: number = this.m_bulList.length; i < il; ++i) {
            bul = this.m_bulList[i];
            bul.run();
            if (bul.isHiding()) {
                this.m_bulList.splice(i, 1);
                i--;
                il--;
                this.m_bulList.push(bul);
            }
        }
        if (this.m_bulList.length < 1) {
            RunnableModule.RunnerQueue.removeRunner(this);
        }
    }
}