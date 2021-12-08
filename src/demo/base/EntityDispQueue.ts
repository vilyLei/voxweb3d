import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import ClipsBillboard3DEntity from "../../vox/entity/ClipsBillboard3DEntity";
import { EntityDisp } from "./EntityDisp";
import { BillDisp } from "./BillDisp";
import { ClipsBillDisp } from "./ClipsBillDisp";

class EntityDispQueue {
    private m_list: EntityDisp[] = [];
    constructor() {
    }
    getListAt(i: number): EntityDisp {
        return this.m_list[i];
    }
    getList(): EntityDisp[] {
        return this.m_list;
    }
    getListLength(): number {
        return this.m_list.length;
    }
    setCubeSpaceRange(minV: Vector3D, maxV: Vector3D): void {
        EntityDisp.MinV.copyFrom(minV);
        EntityDisp.MaxV.copyFrom(maxV);
    }
    addEntity(tar: DisplayEntity): EntityDisp {
        let disp: EntityDisp = new EntityDisp();
        disp.setTarget(tar);
        this.m_list.push(disp);
        return disp;
    }
    addBillEntity(tar: Billboard3DEntity, alphaEnabled: boolean = false): BillDisp {
        let disp: BillDisp = new BillDisp();
        disp.setBillboard(tar);
        this.m_list.push(disp);
        return disp;
    }
    addClipsBillEntity(tar: ClipsBillboard3DEntity, alphaEnabled: boolean = false): ClipsBillDisp {
        let disp: ClipsBillDisp = new ClipsBillDisp();
        disp.setBillboard(tar);
        this.m_list.push(disp);
        return disp;
    }
    run(): void {
        let i: number = 0;
        let len: number = this.m_list.length;
        for (; i < len; ++i) {
            this.m_list[i].update();
        }
    }
}
export { EntityDisp, BillDisp, ClipsBillDisp, EntityDispQueue }