/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是为了做包围体测试或者被空间管理culling test的entity对象的逻辑实体,
// 内部的transform机制是完整的，但是不会构建实际的display对象，不会进入渲染运行时

import Vector3D from "../../vox/math/Vector3D";
import IROTransform from "../../vox/display/IROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IBoundsEntity from "../../vox/entity/IBoundsEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import BoundsMesh from "../../vox/mesh/BoundsMesh";
import IBoundsMesh from "../mesh/IBoundsMesh";
import ITestRay from "../mesh/ITestRay";

export default class BoundsEntity extends DisplayEntity implements IBoundsEntity {
    private m_bm: IBoundsMesh = null;
    constructor(transform: IROTransform = null) {
        super(transform);
    }
    setMaterial(m: IRenderMaterial): BoundsEntity {
        return this;
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
        if(this.m_bm == null) {
            this.initialize(minV, maxV);
        }
        let b = this.m_bm.bounds;
        b.min.copyFrom(minV);
        b.max.copyFrom(maxV);
        b.updateFast();
    }
    
	setRayTester(rayTester: ITestRay): void {
		this.m_bm.setRayTester(rayTester);
	}
    isPolyhedral(): boolean {
        return false;
    }
    destroy(): void {
        super.destroy();
        this.m_bm = null;
    }
}