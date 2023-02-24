/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import IRPODisplay from "../../vox/render/IRPODisplay";
import IRODisplaySorter from "../../vox/render/IRODisplaySorter";
import IRenderProxy from "../../vox/render/IRenderProxy";

/**
 * 在 renderer process 中 通过和摄像机之间的距离, 对可渲染对象渲染先后顺序的排序
 */
export default class CameraDsistanceSorter implements IRODisplaySorter {
    private m_rc: IRenderProxy = null;
    constructor(rc: IRenderProxy) {
        this.m_rc = rc;
    }
    sortRODisplay(nodes: IRPODisplay[], nodesTotal: number): number {
        let camPos = this.m_rc.getCamera().getPosition();
        for (let i = 0; i < nodesTotal; ++i) {
            nodes[i].value = -Vector3D.DistanceSquared(nodes[i].bounds.center, camPos);
            // nodes[i].value = nodes[i].pos.y;
        }
        return 0;
    }
}
