/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../..//vox/math/Vector3D";
import * as AABBT from "../../vox/geom/AABB";

import * as IRPODisplayT from "../../vox/render/IRPODisplay";
import * as IRODisplaySorterT from "../../vox/render/IRODisplaySorter";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import Vector3D = Vector3DT.vox.math.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import IRPODisplay = IRPODisplayT.vox.render.IRPODisplay;
import IRODisplaySorter = IRODisplaySorterT.vox.render.IRODisplaySorter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace scene
    {
        /**
         * 在 renderer process 中 通过和摄像机之间的距离, 对可渲染对象渲染先后顺序的排序
         */
        export class CameraDsistanceSorter implements IRODisplaySorter
        {
            private m_rc:RenderProxy = null;
            constructor(rc:RenderProxy)
            {
                this.m_rc = rc;
            }
            sortRODisplay(nodes:IRPODisplay[], nodesTotal:number):number
            {
                let camPos:Vector3D = this.m_rc.getCamera().getPosition();
                for(let i:number = 0; i < nodesTotal; ++i)
                {
                    nodes[i].value = -Vector3D.DistanceSquared(nodes[i].bounds.center,camPos);
                    //nodes[i].value = nodes[i].pos.y;
                }
                return 0;
            }
        }
    }
}