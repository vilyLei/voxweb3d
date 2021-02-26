/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as AABBT from "../../vox/geom/AABB";
import * as IEvt3DDispatcherT from "../../vox/event/IEvtDispatcher";
import * as MeshBaseT from "../../vox/mesh/MeshBase";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as IRODisplayT from "../../vox/display/IRODisplay";

import AABB = AABBT.vox.geom.AABB;
import IEvtDispatcher = IEvt3DDispatcherT.vox.event.IEvtDispatcher;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;

export namespace vox
{
    export namespace entity
    {
        export interface IDisplayEntity
        {
            // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMasK, 默认只会有摄像机裁剪
            spaceCullMask:number;// = 1;//SpaceCullingMasK.CAMERA;
            // recorde a draw status
            drawEnabled:boolean;// = false;
            // mouse interaction enabled
            mouseEnabled:boolean;// = false;
            
            
            //  dispatchEvt(evt:any):void;
            getEvtDispatcher(evtClassType:number):IEvtDispatcher;
            setEvtDispatcher(evtDisptacher:IEvtDispatcher):void;

            getGlobalBounds():AABB;
            getLocalBounds():AABB;
            
            
            __$setDrawEnabled(boo:boolean):void;
            getDrawEnabled():boolean;
            
            setVisible(boo:boolean):void;
            getVisible():boolean;
            
            setMesh(m:MeshBase):void;
            getMesh():MeshBase;
            setIvsParam(ivsIndex:number,ivsCount:number):void;

            isHaveMesh():boolean;
            /**
             * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)
             */
            isPolyhedral():boolean;
            /**
             * 只允许在加入渲染器之前设置 MaterialBase 实例
             */
            setMaterial(m:MaterialBase):void;
            getMaterial():MaterialBase;
            getDisplay():IRODisplay;

            getUid():number;
            
            isInRenderer():boolean;
            isRenderEnabled():boolean;
            updateBounds():void;
            update():void;
        }
    }
}