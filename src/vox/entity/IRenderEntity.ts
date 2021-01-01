/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 对于纯粹的逻辑对象来讲, 只会和逻辑操作相关(同步)，本质和渲染表现和逻辑可以做到分离
// 因此，这里所涉及到的主要是transform和一些逻辑行为
// 和其他渲染相关的沟通，则依赖对应的协议，对协议的解释，则最终决定呈现结果
// 一个此逻辑 IRenderEntity 对象可以对应一个或者多个 RODisplay, 包含对应的transform
// 可支持多线程，也可支持单线程, 模式

import * as Matrix4T from "../../vox/geom/Matrix4";
import * as AABBT from "../../vox/geom/AABB";
import * as IEvt3DDispatcherT from "../../vox/event/IEvtDispatcher";
import * as MeshBaseT from "../../vox/mesh/MeshBase";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as TextureProxyT from '../../vox/texture/TextureProxy';
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";

import Matrix4 = Matrix4T.vox.geom.Matrix4;
import AABB = AABBT.vox.geom.AABB;
import IEvtDispatcher = IEvt3DDispatcherT.vox.event.IEvtDispatcher;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;

export namespace vox
{
    export namespace entity
    {
        export interface IRenderEntity extends IRenderBuffer
        {
            // 自身所在的world的唯一id, 通过这个id可以找到对应的world
            __$wuid:number;// = -1;
            // 自身在world中被分配的唯一id, 通过这个id就能在world中快速找到自己所在的数组位置
            __$weid:number;// = -1;
            // 记录自身所在的容器id
            __$contId:number;// = -1;
            // space id
            __$spaceId:number;// = -1;

            name:string;// = "IRenderEntity";
            // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMasK, 默认只会有摄像机裁剪
            spaceCullMask:number;// = 1;//SpaceCullingMasK.CAMERA;
            //spaceCullMask:number = SpaceCullingMasK.CAMERA;
            // recorde a draw status
            drawEnabled:boolean;// = false;
            // mouse interaction enabled
            mouseEnabled:boolean;// = false;
            
            
            dispatchEvt(evt:any):void;
            getEvtDispatcher(evtClassType:number):IEvtDispatcher;
            setEvtDispatcher(evtDisptacher:IEvtDispatcher):void;

            getGlobalBounds():AABB;
            getLocalBounds():AABB;
            
            
            __$setDrawEnabled(boo:boolean):void;
            getDrawEnabled():boolean;
            
            __$updateToGpu(rc:RenderProxy):void;
            updateTextureList(texList:TextureProxy[]):void;
            setVisible(boo:boolean):void;
            getVisible():boolean;
            isRenderedEntity():boolean;
            
            copyMeshFrom(entity:IRenderEntity):void;
            copyMaterialFrom(entity:IRenderEntity):void;
            setMesh(m:MeshBase):void;
            setIvsParam(ivsIndex:number,ivsCount:number):void;
            getMesh():MeshBase;
            setMaterial(m:MaterialBase):void;
            getMaterial():MaterialBase;
            getDisplay():IRODisplay;
            getInvMatrix():Matrix4
            getMatrix():Matrix4

            setRenderColorMask(rt:number):void;
            setRenderColorMaskByName(rt_name:string):void;        
            setRenderState(renderState:number):void;    
            setRenderStateByName(renderState_name:string):void;
            
            activeDisplay():void;
            
            getUid():number;
            destroy():void;
            
            isInRenderer():boolean;
            isRenderEnabled():boolean;
            updateBounds():void;
            update():void;
        }
    }
}