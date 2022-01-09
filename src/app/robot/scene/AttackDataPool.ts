/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import TriggerData from "../../../app/robot/TriggerData";
export default class AttackDataPool {
    private static s_ins: AttackDataPool = null;
    dataList: TriggerData[] = [];
    private constructor() {
        if (AttackDataPool.s_ins != null) {
            throw Error("Error!");
        }
        AttackDataPool.s_ins = this;
    }
    static GetInstance(): AttackDataPool {
        if (AttackDataPool.s_ins != null) {
            return AttackDataPool.s_ins;
        }
        return new AttackDataPool();
    }
    addTriggerData(data: TriggerData): void {
        if (data.status == 0) {
            //console.log("add a TriggerData ins.");
            data.status = 1;
            this.dataList.push(data);
        }
    }
}