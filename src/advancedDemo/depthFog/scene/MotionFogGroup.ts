/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { MotionFogUnit } from "../../../advancedDemo/depthLight/scene/MotionFogUnit";

export class MotionFogGroup {
    constructor() {
    }
    units: MotionFogUnit[] = null;
    private m_aliveList: MotionFogUnit[] = [];
    private m_freeList: MotionFogUnit[] = [];
    runBegin(): void {
    }
    run(): void {
        let i = 0;
        let len = this.m_aliveList.length;
        let unit: MotionFogUnit;
        for (; i < len; ++i) {
            unit = this.m_aliveList[i];
            if (unit.isAlive()) {
                unit.run();
            }
            else {
                this.m_aliveList.splice(i, 1);
                --i;
                --len;
            }
        }
    }
    create(): MotionFogUnit {
        let unit: MotionFogUnit;
        if (this.m_freeList.length > 0) {
            unit = this.m_freeList.pop();
            this.m_aliveList.push(unit);
            return unit;
        }
        unit = new MotionFogUnit();
        this.m_aliveList.push(unit);
        return unit;
    }
}