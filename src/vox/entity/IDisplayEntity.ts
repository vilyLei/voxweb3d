/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../../vox/geom/AABB";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import MeshBase from "../../vox/mesh/MeshBase";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRODisplay from "../../vox/display/IRODisplay";


export default interface IDisplayEntity {

    // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
    spaceCullMask: SpaceCullingMask; // the default value is SpaceCullingMask.CAMERA.
    // recorde a draw status
    drawEnabled: boolean;// = false;
    // mouse interaction enabled
    mouseEnabled: boolean;// = false;

    getEvtDispatcher(evtClassType: number): IEvtDispatcher;
    setEvtDispatcher(evtDisptacher: IEvtDispatcher): void;

    getGlobalBounds(): AABB;
    getLocalBounds(): AABB;


    __$setDrawEnabled(boo: boolean): void;
    isDrawEnabled(): boolean;

    setVisible(boo: boolean): void;
    getVisible(): boolean;

    setMesh(m: MeshBase): void;
    getMesh(): MeshBase;
    setIvsParam(ivsIndex: number, ivsCount: number): void;

    /**
     * @return 返回true表示包含有mesh对象,反之则没有
     */
    hasMesh(): boolean;
    /**
     * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)
     */
    isPolyhedral(): boolean;
    /**
     * 只允许在加入渲染器之前设置 IRenderMaterial 实例
     */
    setMaterial(m: IRenderMaterial): void;
    getMaterial(): IRenderMaterial;
    getDisplay(): IRODisplay;

    getUid(): number;

    isInRenderer(): boolean;
    isRenderEnabled(): boolean;
    updateBounds(): void;
    update(): void;
}