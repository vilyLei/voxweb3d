/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 对于纯粹的逻辑对象来讲, 只会和逻辑操作相关(同步)，本质和渲染表现和逻辑可以做到分离
// 因此，这里所涉及到的主要是transform和一些逻辑行为
// 和其他渲染相关的沟通，则依赖对应的协议，对协议的解释，则最终决定呈现结果
// 一个此逻辑 PureEntity 对象可以对应一个或者多个 RODisplay, 包含对应的transform
// 可支持多线程模式(主要支持多线程模式的纯粹的被渲染器接受的渲染对象)，也可支持单线程模式, 此实例不允许加入容器

import * as Vector3DT from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as RendererStateT from "../../vox/render/RendererState";
import * as MeshBaseT from "../../vox/mesh/MeshBase";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as RODisplayT from "../../vox/display/RODisplay";

import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as TextureProxyT from '../../vox/texture/TextureProxy';


import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import RendererState = RendererStateT.vox.render.RendererState;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import RODisplay = RODisplayT.vox.display.RODisplay;

import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

export namespace vox
{
    export namespace entity
    {
        export class EntityBase
        {;
            // local to world spcae matrix
            protected m_omat:Matrix4 = null;
            // word to local matrix
            protected m_invOmat:Matrix4 = null;
            constructor()
            {
            }
            protected m_rcolorMask:number = RendererState.ALL_TRUE_COLOR_MASK;
            protected m_renderState:number = RendererState.BACK_CULLFACE_NORMAL_STATE;
            protected m_display:RODisplay = null;
            protected m_mesh:MeshBase = null;
            // 自身所在的world的唯一id, 通过这个id可以找到对应的world
            __$wuid:number = -1;
            // 自身在world中被分配的唯一id, 通过这个id就能在world中快速找到自己所在的数组位置
            __$weid:number = -1;
            // 记录自身所在的容器id
            __$contId:number = -1;
            // space id
            __$spaceId:number = -1;

            name:string = "PureEntity";
            // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMasK, 默认只会有摄像机裁剪
            spaceCullMask:number = 1;//SpaceCullingMasK.CAMERA;
            //spaceCullMask:number = SpaceCullingMasK.CAMERA;
            // recorde a draw status
            drawEnabled:boolean = false;
            // mouse interaction enabled
            mouseEnabled:boolean = false;
            //
            vbWholeDataEnabled:boolean = true;
            
            // update material texture list
            protected m_texChanged:boolean = false;
            
            protected m_meshChanged:boolean = false;
            /**
             * users need to call this function manually
             * 更新有两种形式, 1: 只是更改资源内部的数据, 2: 替换资源本身
             * 更新过程可以通过DisplayEntity对象来控制，也可以通过资源本身来控制
             */
            updateMeshToGpu(rc:RenderProxy,deferred:boolean = true):void
            {
                if(this.m_display != null && this.m_display.__$ruid > -1)
                {
                    if(this.m_meshChanged)
                    {
                        this.m_meshChanged = false;
                        rc.VtxBufUpdater.updateDispVbuf(this.m_display, deferred);
                    }
                    else
                    {
                        //this.m_display.vbuf.updateToGpu(rc, deferred);
                        rc.VtxBufUpdater.updateVtxDataToGpuByUid(this.m_display.vbuf.getUid(),deferred);
                    }
                }
            }
            /**
             * users need to call this function manually
             * 更新有两种形式, 1: 只是更改资源内部的数据, 2: 替换资源本身
             * 更新过程可以通过DisplayEntity对象来控制，也可以通过资源本身来控制
             */
            updateMaterialToGpu(rc:RenderProxy,deferred:boolean = true):void
            {
                if(this.m_display != null && this.m_display.__$ruid > -1)
                {
                    if(this.m_texChanged)
                    {
                        this.m_texChanged = false;
                        rc.MaterialUpdater.updateDispTRO(this.m_display,deferred);
                    }
                }
            }
            updateTextureList(texList:TextureProxy[],rc:RenderProxy = null):void
            {
                if(this.m_display != null && this.m_display.__$ruid > -1)
                {
                    if(this.m_display.getMaterial() != null)
                    {
                        this.m_display.getMaterial().setTextureList(texList);
                        this.m_texChanged = true;
                        if(rc != null)
                        {
                            this.updateMaterialToGpu(rc);
                        }
                    }
                }
            }
            updateTextureAt(index:number, tex:TextureProxy,rc:RenderProxy = null):void
            {
                if(this.m_display != null && this.m_display.__$ruid > -1)
                {
                    if(this.m_display.getMaterial() != null)
                    {
                        this.m_display.getMaterial().setTextureAt(index,tex);
                        this.m_texChanged = true;
                        if(rc != null)
                        {
                            this.updateMaterialToGpu(rc);
                        }
                    }
                }
                
            }
            updateTexByMaterial(rc:RenderProxy = null):void
            {
                if(this.m_display != null && this.m_display.__$ruid > -1)
                {
                    if(this.m_display.getMaterial() != null)
                    {
                        this.m_texChanged = true;
                        if(rc != null)
                        {
                            this.updateMaterialToGpu(rc);
                        }
                    }
                }
            }
            copyMeshFrom(entity:EntityBase):void
            {
                if(entity != null)
                {
                    this.setMesh( entity.getMesh() );
                }
            }
            
            /**
             * 设置几何相关的数据,必须是构建完备的mesh才能被设置进来
             * 这个设置函数也可以动态运行时更新几何相关的顶点数据
             */
            setMesh(m:MeshBase):void
            {
            }
            setIvsParam(ivsIndex:number,ivsCount:number):void
            {
                if(this.m_display != null)
                {
                    this.m_display.ivsIndex = ivsIndex;
                    this.m_display.ivsCount = ivsCount;
                    if(this.m_display.__$ruid > -1)
                    {
                        this.m_display.__$$runit.setIvsParam(ivsIndex, ivsCount);
                    }
                }
            }
            getMesh():MeshBase
            {
                return this.m_mesh;
            }
            hasMesh():boolean
            {
                return this.m_mesh != null;
            }
            /**
             * @return 返回true是则表示这是基于三角面的多面体, 返回false则是一个数学方程描述的几何体(例如球体)
             */
            isPolyhedral():boolean
            {
                return this.m_mesh.isPolyhedral();
            }
            /**
             * @boundsHit       表示是否包围盒体已经和射线相交了
             * @rlpv            表示物体坐标空间的射线起点
             * @rltv            表示物体坐标空间的射线朝向
             * @outV            如果检测相交存放物体坐标空间的交点
             * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
             */
            testRay(rlpv:Vector3D,rltv:Vector3D,outV:Vector3D,boundsHit:boolean):number
            {
                return this.m_mesh.testRay(rlpv,rltv,outV,boundsHit);
            }
            getMaterial():MaterialBase
            {
                if(this.m_display != null)
                {
                    return this.m_display.getMaterial();
                }
                return null;
            }
            getDisplay():IRODisplay
            {
                return this.m_display;
            }

            getMatrix():Matrix4
            {
                return this.m_omat;
            }
            
            setRenderColorMask(rt:number):void
            {
                this.m_rcolorMask = rt;
                if(this.m_display != null)
                {
                    this.m_display.rcolorMask = this.m_rcolorMask;
                    if(this.m_display.__$$runit != null)
                    {
                        this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
                    }
                }
            }

            setRenderColorMaskByName(rt_name:string):void
            {
                this.m_rcolorMask = RendererState.GetRenderColorMaskByName(rt_name);
                if(this.m_display != null)
                {
                    this.m_display.rcolorMask = this.m_rcolorMask;
                    if(this.m_display.__$$runit != null)
                    {
                        this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
                    }
                }
            }
        
            setRenderState(renderState:number):void
            {
                this.m_renderState = renderState;
                if(this.m_display != null)
                {
                    this.m_display.renderState = this.m_renderState;
                    if(this.m_display.__$$runit != null)
                    {
                        this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
                    }
                }
            }
    
            setRenderStateByName(renderState_name:string):void
            {
                this.m_renderState = RendererState.GetRenderStateByName(renderState_name);
                if(this.m_display != null)
                {
                    this.m_display.renderState = this.m_renderState;
                    if(this.m_display.__$$runit != null)
                    {
                        this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
                    }
                }
            }
            protected createDisplay():void
            {
                this.m_display = RODisplay.Create();
            }
            isInRenderer():boolean
            {
                return this.__$wuid >= 0;
            }
            isRenderEnabled():boolean
            {
                return this.m_display != null && this.m_display.__$rpuid > -1;
            }
        }
    }
}