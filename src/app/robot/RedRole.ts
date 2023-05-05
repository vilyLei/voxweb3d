/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IAttackDst from "../../app/robot/attack/IAttackDst";
import { CampRoleStatus, CampType } from "../../app/robot/camp/Camp";
import Color4 from "../../vox/material/Color4";
export default class RedRole implements IAttackDst {
    
    private m_changed: boolean = true;
    campType: CampType = CampType.Red;
    status: CampRoleStatus = CampRoleStatus.Free;
    lifeTime: number = 150;
    radius: number = 50.0;
    splashRadius: number = 50.0;

    attackPosOffset: Vector3D = new Vector3D(0.0, 50.0, 0.0);
    destroyPosOffset: Vector3D = new Vector3D(0.0, 15.0, 0.0);
    position: Vector3D = new Vector3D();
    dispEntity: DisplayEntity = null;

    attackDis: number = 0;
    color: Color4 = null;

    constructor() { }

    wake(): void {        
    }
    getPosition(pv: Vector3D): void {
        pv.copyFrom(this.position);
    }
    setPosition(pv: Vector3D): void {
        this.position.copyFrom(pv);
        this.m_changed = true;
    }
    setPosXYZ(px: number, py: number, pz: number): void {
        this.position.setXYZ(px, py, pz);
        this.m_changed = true;
    }

    setVisible(visible: boolean): void {
        if (this.dispEntity != null) {
            this.dispEntity.setVisible(visible);
        }
    }
    getHitPos(outPos: Vector3D): void {
        outPos.addVecsTo(this.position, this.attackPosOffset);
    }
    getDestroyedPos(outPos: Vector3D): void {
        outPos.addVecsTo(this.position, this.destroyPosOffset);
    }
    consume(power: number): void {
        this.lifeTime -= power;
    }
    attackTest(): boolean {
        return true;
    }
    run(): void {
        if (this.dispEntity != null && this.lifeTime > 0) {
            if (this.m_changed) {
                this.dispEntity.setPosition(this.position);
                this.dispEntity.update();
                this.m_changed = false;
            }
        }
    }
    // /**
    //  * 复活
    //  */
    // revive(): void {
    // }
}