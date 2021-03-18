/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是为了做包围体测试或者被空间管理culling test的entity对象的逻辑实体,
// 内部的transform机制是完整的，但是不会构建实际的display对象，不会进入渲染运行时

import * as Vector3DT from "../../vox/math/Vector3D";
import * as ROTransformT from "../../vox/display/ROTransform";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as MeshBaseT from "../../vox/mesh/BoundsMesh";
import * as AABBT from "../../vox/geom/AABB";

import Vector3D = Vector3DT.vox.math.Vector3D;
import ROTransform = ROTransformT.vox.display.ROTransform;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import BoundsMesh = MeshBaseT.vox.mesh.BoundsMesh;
import AABB = AABBT.vox.geom.AABB;

export namespace vox
{
    export namespace entity
    {
        export class BoundsEntity extends DisplayEntity
        {
            private m_boundsMesh:BoundsMesh = null;
            constructor(transform:ROTransform = null)
            {
                super(transform);
            }
            setMaterial(m:MaterialBase):void
            {
            }
            protected createDisplay():void
            {
            }
            initialize(minV:Vector3D, maxV:Vector3D):void
            {
                this.mouseEnabled = true;
                if(this.getMesh() == null)
                {
                    this.m_boundsMesh = new BoundsMesh();
                    this.m_boundsMesh.bounds = new AABB();
                    this.m_boundsMesh.bounds.min.copyFrom(minV);
                    this.m_boundsMesh.bounds.max.copyFrom(maxV);
                    this.m_boundsMesh.bounds.updateFast();
                    this.setMesh(this.m_boundsMesh);
                }
            }
            setBounds(minV:Vector3D, maxV:Vector3D):void
            {
                this.m_boundsMesh.bounds.min.copyFrom(minV);
                this.m_boundsMesh.bounds.max.copyFrom(maxV);
                this.m_boundsMesh.bounds.updateFast();
            }
            toString():string
            {
                return "BoundsEntity(uid = "+this.getUid()+", rseFlag = "+this.__$rseFlag+")";
            }
            destroy():void
            {
                super.destroy();
                this.m_boundsMesh = null;
            }
        }

    }
}