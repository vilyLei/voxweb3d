/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAABB from "../../vox/geom/IAABB";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IMeshBase from "../../vox/mesh/IMeshBase";
// import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRODisplay from "../../vox/display/IRODisplay";
import IRenderEntity from "../../vox/render/IRenderEntity";


export default interface IDisplayEntity extends IRenderEntity {

    // // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
    // spaceCullMask: number; // the default value is SpaceCullingMask.CAMERA.
    // // recorde a draw status
    // drawEnabled: boolean;// = false;
    // mouse interaction enabled
    mouseEnabled: boolean;// = false;

    getEvtDispatcher(evtClassType: number): IEvtDispatcher;
    setEvtDispatcher(evtDisptacher: IEvtDispatcher): void;

    getGlobalBounds(): IAABB;
    getLocalBounds(): IAABB;


    __$setDrawEnabled(boo: boolean): void;
    // isDrawEnabled(): boolean;

    setVisible(boo: boolean): IDisplayEntity;
    getVisible(): boolean;

    setMesh(m: IMeshBase): IDisplayEntity;
    getMesh(): IMeshBase;
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
    setMaterial(m: IRenderMaterial): IDisplayEntity;
    getMaterial(): IRenderMaterial;
    getDisplay(): IRODisplay;

    getUid(): number;
    /**
     * 表示没有加入任何渲染场景或者渲染器
     */
    isRFree(): boolean;
    isInRenderer(): boolean;
    isRenderEnabled(): boolean;
    updateBounds(): void;
    update(): void;
}
