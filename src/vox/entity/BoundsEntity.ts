/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是为了做包围体测试或者被空间管理culling test的entity对象的逻辑实体,
// 内部的transform机制是完整的，但是不会构建实际的display对象，不会进入渲染运行时

import Vector3D from "../../vox/math/Vector3D";
import IROTransform from "../../vox/display/IROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import BoundsMesh from "../../vox/mesh/BoundsMesh";
export default class BoundsEntity extends DisplayEntity {
    private m_bm: BoundsMesh = null;
    constructor(transform: IROTransform = null) {
        super(transform);
    }
    setMaterial(m: IRenderMaterial): void {
    }
    protected createDisplay(): void {
    }
    initialize(minV: Vector3D, maxV: Vector3D): void {
        this.mouseEnabled = true;
        if (this.getMesh() == null) {
            this.m_bm = new BoundsMesh();
            this.m_bm.setBounds(minV, maxV);
            this.setMesh(this.m_bm);
        } else if (this.m_bm != null) {
            this.m_bm.setBounds(minV, maxV);
        }
    }
    setBounds(minV: Vector3D, maxV: Vector3D): void {
        this.m_bm.bounds.min.copyFrom(minV);
        this.m_bm.bounds.max.copyFrom(maxV);
        this.m_bm.bounds.updateFast();
    }
    isPolyhedral(): boolean {
        return false;
    }
    destroy(): void {
        super.destroy();
        this.m_bm = null;
    }
}