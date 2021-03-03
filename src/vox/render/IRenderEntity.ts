/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as AABBT from "../../vox/geom/AABB";
import * as IEvt3DDispatcherT from "../../vox/event/IEvtDispatcher";
import * as IRenderMaterialT from "../../vox/render/IRenderMaterial";
import * as IRODisplayT from "../../vox/display/IRODisplay";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import AABB = AABBT.vox.geom.AABB;
import IEvtDispatcher = IEvt3DDispatcherT.vox.event.IEvtDispatcher;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;

export namespace vox
{
    export namespace render
    {
        /**
         * to be used by renderer runtime
         */
        export interface IRenderEntity
        {
            //  // 自身所在的 RendererInstance unique id, 通过这个id可以找到对应的renderer instance
            //  __$wuid:number;// = -1;
            //  // 自身在 RendererInstance 中被分配的唯一id, 通过这个id就能在world中快速找到自己所在的数组位置
            //  __$weid:number;// = -1;
            //  // 记录自身所在的容器id
            //  __$contId:number;// = -1;
            // space id
            __$spaceId:number;// = -1;
            //renderer scene entity flag, value default is RSEntityFlag.DEFAULT
            __$rseFlag:number;
            //  name:string;// = "IRenderEntity";
            // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMasK, 默认只会有摄像机裁剪
            spaceCullMask:number;// = 1;//SpaceCullingMasK.CAMERA;
            // recorde a draw status
            drawEnabled:boolean;// = false;
            // mouse interaction enabled
            mouseEnabled:boolean;// = false;
            __$testSpaceEnabled():boolean;
            __$testContainerEnabled():boolean;
            __$testRendererEnabled():boolean;
            getRendererUid():number;

            dispatchEvt(evt:any):void;
            getEvtDispatcher(evtClassType:number):IEvtDispatcher;

            getGlobalBounds():AABB;
            getLocalBounds():AABB;
            
            /**
             * @return 返回true表示当前DisplayEntity能被绘制
             */
            getDrawEnabled():boolean;
            
            setVisible(boo:boolean):void;
            getVisible():boolean;
            
            /**
             * @boundsHit       表示是否包围盒体已经和射线相交了
             * @rlpv            表示物体坐标空间的射线起点
             * @rltv            表示物体坐标空间的射线朝向
             * @outV            如果检测相交存放物体坐标空间的交点
             * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
             */
            testRay(rlpv:Vector3D,rltv:Vector3D,outV:Vector3D,boundsHit:boolean):number
            /**
             * @return 返回true表示包含有mesh对象,反之则没有
             */
            hasMesh():boolean;
            /**
             * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)
             */
            isPolyhedral():boolean;
            
            getMaterial():IRenderMaterial;
            getDisplay():IRODisplay;
            getInvMatrix():Matrix4
            getMatrix():Matrix4

            activeDisplay():void;
            
            getUid():number;
            /**
             * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
             */
            isInRenderer():boolean;
            /**
             * @returns 是否处在渲染运行时中
             */
            isRenderEnabled():boolean;
            
            updateBounds():void;
            update():void;
        }
    }
}