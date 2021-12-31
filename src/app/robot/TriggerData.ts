/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IAttackDst from "../../app/robot/attack/IAttackDst";
import { CampType } from "../../app/robot/camp/Camp";

export default class TriggerData {
    campType: CampType = CampType.Blue;
    attackDst: IAttackDst = null;
    dstPos: Vector3D = new Vector3D();
    bulType: number = 0;
    delayTime: number = 2;
    value: number = 30;

    status: number = 0;
    constructor() {
    }
    reset(): void {
        this.delayTime = 2;
        this.status = 0;
    }
    trigger(): boolean {
        if (this.delayTime > 0) {
            this.delayTime--;
        }
        return this.delayTime < 1;
    }
}