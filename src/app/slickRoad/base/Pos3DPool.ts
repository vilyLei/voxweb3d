/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用于视觉表现上的渲染控制, 而和transform或者非渲染的逻辑无关
// 一个 Pos3DPool 和一个 IRPODisplay一一对应, 一个Pos3DPool也只会和一个renderer相关联

import {Pos3D} from "./Pos3D";


class Pos3DPool {
    private static s_uid:number = 0;
    private m_uid:number = 0;
    private constructor() {
        this.m_uid = Pos3DPool.s_uid++;
    }
    getUid(): number {
        return this.m_uid;
    }

    private static s_FLAG_BUSY: number = 1;
    private static s_FLAG_FREE: number = 0;
    private static m_unitFlagList: number[] = [];
    private static m_unitListLen: number = 0;
    private static m_unitList: Pos3D[] = [];
    private static m_freeIdList: number[] = [];
    private static GetFreeId(): number {
        if (Pos3DPool.m_freeIdList.length > 0) {
            return Pos3DPool.m_freeIdList.pop();
        }
        return -1;
    }
    static GetByUid(uid: number): Pos3D {
        return Pos3DPool.m_unitList[uid];
    }
    static IsEnabledByUid(uid: number): boolean {
        return Pos3DPool.m_unitFlagList[uid] == Pos3DPool.s_FLAG_BUSY;
    }
    static CreateList(total: number): Pos3D[] {
        
        let posList: Pos3D[] = new Array( total );
        for(let i: number = 0; i < total; ++i) {
            posList[i] = Pos3DPool.Create();
        }
        return posList;
    }
    static Create(): Pos3D {
        let unit: Pos3D = null;
        let index: number = Pos3DPool.GetFreeId();
        if (index >= 0) {
            unit = Pos3DPool.m_unitList[index];
            Pos3DPool.m_unitFlagList[index] = Pos3DPool.s_FLAG_BUSY;
        }
        else {
            unit = new Pos3D();
            unit.uid = Pos3DPool.m_unitListLen;
            Pos3DPool.m_unitList.push(unit);
            Pos3DPool.m_unitFlagList.push(Pos3DPool.s_FLAG_BUSY);
            Pos3DPool.m_unitListLen ++;
        }
        return unit;
    }

    static Restore(pos: Pos3D): void {
        if (pos != null && pos.uid >= 0 && Pos3DPool.m_unitFlagList[pos.uid] == Pos3DPool.s_FLAG_BUSY) {
            let uid: number = pos.uid;
            Pos3DPool.m_freeIdList.push(uid);
            Pos3DPool.m_unitFlagList[uid] = Pos3DPool.s_FLAG_FREE;
        }
    }
    static RestoreList(list: Pos3D[]): void {
        let pos: Pos3D;
        let uid: number;
        for(let i: number = 0; i < list.length; ++i) {
            pos = list[i];
            uid = pos.uid;
            if (Pos3DPool.m_unitFlagList[uid] == Pos3DPool.s_FLAG_BUSY) {
                Pos3DPool.m_freeIdList.push(uid);
                Pos3DPool.m_unitFlagList[uid] = Pos3DPool.s_FLAG_FREE;
            }
        }
    }
    static RestoreTable(table: Pos3D[][]): void {
        let pos: Pos3D;
        let list: Pos3D[];
        let uid: number;
        for(let k: number = 0; k < table.length; ++k) {
            list = table[k];
            for(let i: number = 0; i < list.length; ++i) {
                pos = list[i];
                uid = pos.uid;
                if (Pos3DPool.m_unitFlagList[uid] == Pos3DPool.s_FLAG_BUSY) {
                    Pos3DPool.m_freeIdList.push(uid);
                    Pos3DPool.m_unitFlagList[uid] = Pos3DPool.s_FLAG_FREE;
                }
            }
        }
    }
}
export {Pos3DPool};