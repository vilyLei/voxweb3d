/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 对于纯粹的逻辑对象来讲, 只会和逻辑操作相关(同步)，本质和渲染表现和逻辑可以做到分离
// 因此，这里所涉及到的主要是transform和一些逻辑行为
// 和其他渲染相关的沟通，则依赖对应的协议，对协议的解释，则最终决定呈现结果
// 一个此逻辑 DisplayEntity 对象可以对应一个或者多个 RODisplay, 包含对应的transform
// 可支持多线程，也可支持单线程, 模式

import * as SpaceCullingMasKT from '../../vox/scene/SpaceCullingMasK';
import * as Vector3T from "../../vox/geom/Vector3";
import * as AABBT from "../../vox/geom/AABB";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as IEvt3DDispatcherT from "../../vox/event/IEvtDispatcher";
import * as IDisplayEntityContainerT from "../../vox/entity/IDisplayEntityContainer";
import * as RendererStateT from "../../vox/render/RendererState";
import * as MeshBaseT from "../../vox/mesh/MeshBase";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as ROTransformT from "../../vox/display/ROTransform";
import * as RODisplayT from "../../vox/display/RODisplay";
import * as RPOUnitBuiderT from "../../vox/render/RPOUnitBuider";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IRenderBufferT from "../../vox/render/IRenderBuffer";
import * as RenderBufferUpdaterT from "../../vox/render/RenderBufferUpdater";
import * as TextureProxyT from '../../vox/texture/TextureProxy';
import * as RODispBuilderT from '../../vox/render/RODispBuilder';


import SpaceCullingMasK = SpaceCullingMasKT.vox.scene.SpaceCullingMasK;
import Vector3D = Vector3T.vox.geom.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import IEvtDispatcher = IEvt3DDispatcherT.vox.event.IEvtDispatcher;
import IDisplayEntityContainer = IDisplayEntityContainerT.vox.entity.IDisplayEntityContainer;
import RendererState = RendererStateT.vox.render.RendererState;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import ROTransform = ROTransformT.vox.display.ROTransform;
import RODisplay = RODisplayT.vox.display.RODisplay;
import RPOUnitBuider = RPOUnitBuiderT.vox.render.RPOUnitBuider;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IRenderBuffer = IRenderBufferT.vox.render.IRenderBuffer;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RODispBuilder = RODispBuilderT.vox.render.RODispBuilder;

export namespace vox
{
    export namespace entity
    {
        export class DisplayEntity implements IRenderBuffer
        {
            private static __s_uid:number = 0;
            private m_uid:number = 0;
            // the entity is rendered entity or logic entity(doesn't exist in renderer process)
            protected m_isRenderedEntity:boolean = true;
            protected m_transfrom:ROTransform = null;
            protected m_mouseEvtDispatcher:IEvtDispatcher = null;
            constructor(transform:ROTransform = null)
            {
                //this.spaceCullMask = SpaceCullingMasK.CAMERA;
                this.m_uid = DisplayEntity.__s_uid++;
                if(transform == null)
                {
                   this.m_transfrom = ROTransform.Create();
                }
                else
                {
                    this.m_transfrom = transform;
                }
                this.createBounds();
            }
            private m_visible:boolean = true;
            private m_drawEnabled:boolean = true;
            private m_rcolorMask:number = RendererState.ALL_TRUE_COLOR_MASK;
            private m_renderState:number = RendererState.BACK_CULLFACE_NORMAL_STATE;
            private m_display:RODisplay = null;
            protected m_mesh:MeshBase = null;
            // 如果一个entity如果包含了多个mesh,则这个bounds就是多个mesh aabb 合并的aabb
            protected m_globalBounds:AABB = null;
            protected m_parent:IDisplayEntityContainer = null;
            // 自身所在的world的唯一id, 通过这个id可以找到对应的world
            __$wuid:number = -1;
            // 自身在world中被分配的唯一id, 通过这个id就能在world中快速找到自己所在的数组位置
            __$weid:number = -1;
            // 记录自身所在的容器id
            __$contId:number = -1;
            // space id
            __$spaceId:number = -1;

            name:string = "DisplayEntity";
            // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMasK, 默认只会有摄像机裁剪
            spaceCullMask:number = 1;//SpaceCullingMasK.CAMERA;
            //spaceCullMask:number = SpaceCullingMasK.CAMERA;
            // recorde a draw status
            drawEnabled:boolean = false;
            // mouse interaction enabled
            mouseEnabled:boolean = false;
            //
            vbWholeDataEnabled:boolean = true;
            __$setParent(parent:IDisplayEntityContainer):void
            {
                if(this.m_parent == null)
                {
                }
                this.m_parent = parent;
            }
            protected createBounds():void
            {
                this.m_globalBounds = new AABB();
            }
            dispatchEvt(evt:any):void
            {
                if(evt.getClassType() == MouseEvent.EventClassType)
                {
                    if(this.m_mouseEvtDispatcher != null)
                    {
                        this.m_mouseEvtDispatcher.dispatchEvt(evt);
                    }
                    //else
                    //{
                    //    this.m_mouseEvtDispatcher = new MouseEvt3DDispatcher();
                    //    this.m_mouseEvtDispatcher.dispatchEvt(evt);
                    //}
                }
            }
            getEvtDispatcher(evtClassType:number):IEvtDispatcher
            {
                return this.m_mouseEvtDispatcher;
            }
            setEvtDispatcher(evtDisptacher:IEvtDispatcher):void
            {
                this.m_mouseEvtDispatcher = evtDisptacher;
            }

            getGlobalBounds():AABB
            {
                return this.m_globalBounds;
            }
            getLocalBounds():AABB
            {
                return this.m_mesh.bounds;
            }
            
            getGlobalBoundsVer():number
            {
                if(this.m_globalBounds != null)
                {
                    return this.m_globalBounds.version;
                }
                return -1;
            }
            __$setDrawEnabled(boo:boolean):void
            {
                if(this.m_drawEnabled != boo)
                {
                    //  console.log("DisplayEntity::__$setDrawEnabled: "+boo);
                    //  if(!this.m_drawEnabled)
                    //  {
                    //      console.log("DisplayEntity::__$setDrawEnabled A: "+boo);
                    //  }
                    this.m_drawEnabled = boo;
                    if(this.m_display != null)
                    {
                        this.m_display.visible = this.m_visible && boo;
                        if(this.m_display.__$ruid > -1)
                        {
                            RPOUnitBuider.__$SynVisibleWithUid(this.m_display.__$ruid, this.m_display.visible);
                        }
                    }
                }
            }
            getDrawEnabled():boolean
            {
                return this.m_drawEnabled;
            }
            // update material texture list
            private m_updateStatus:number = -1;
            protected m_texChanged:boolean = false;
            __$setUpdateStatus(s:number):void
            {
                this.m_updateStatus = s;
            }
            __$getUpdateStatus():number
            {
                return this.m_updateStatus;
            }
            __$updateToGpu(rc:RenderProxy):void
            {
                this.m_texChanged = false;
                RODispBuilder.UpdateDispTRO(rc,this.m_display);
            }
            updateTextureList(texList:TextureProxy[]):void
            {
                if(this.m_display != null && this.m_display.__$ruid > -1)
                {
                    if(this.m_display.getMaterial() != null)
                    {
                        this.m_display.getMaterial().setTextureList(texList);
                        if(!this.m_texChanged)
                        {
                            this.m_texChanged = true;
                            RenderBufferUpdater.GetInstance().__$addBuf(this);
                        }
                    }
                }
            }
            setVisible(boo:boolean):void
            {
                if(this.m_visible != boo)
                {
                    this.m_visible = boo;
                    if(this.m_display != null)
                    {
                        this.m_display.visible = boo && this.m_drawEnabled;
                        if(this.m_display.__$ruid > -1)
                        {
                            RPOUnitBuider.__$SynVisibleWithUid(this.m_display.__$ruid, boo && this.m_drawEnabled);
                        }
                    }
                }
            }
            getVisible():boolean
            {
                return this.m_visible;
            }
            isRenderedEntity():boolean
            {
                return this.m_isRenderedEntity;
            }
            getTransform():ROTransform
            {
                return this.m_transfrom;
            }
            copyPositionFrom(entity:DisplayEntity):void
            {
                if(entity != null)
                {
                    this.m_transfrom.copyPositionFrom(entity.getTransform());
                }
            }
            copyMeshFrom(entity:DisplayEntity):void
            {
                if(entity != null)
                {
                    this.setMesh( entity.getMesh() );
                }
            }
            setMesh(m:MeshBase):void
            {
                if(this.m_mesh == null && m != null)
                {
                    if(!m.isEnabled()){m.rebuild()}
                    if(m.isEnabled())
                    {
                        this.m_mesh = m;
                        m.__$attachThis();
                        if(this.m_display == null)
                        {
                            this.createDisplay();
                        }
                        if(this.m_display != null)
                        {
                            this.m_display.transform = this.m_transfrom;
                            this.m_display.visible = this.m_visible && this.m_drawEnabled;
                            this.m_display.vbuf = m.__$attachVBuf();
                            this.m_display.ivsIndex = 0;
                            this.m_display.ivsCount = m.vtCount;
                            this.m_display.drawMode = m.drawMode;
                            this.m_display.trisNumber = m.trisNumber;
                        }
                        //console.log("DisplayEntity::setMesh(), "+this.m_display.toString()+",m.drawMode: "+m.drawMode);
                        if(this.m_globalBounds != null)
                        {
                            this.m_globalBounds.copyFrom(m.bounds);                     
                        }
                    }
                }
            }
            setIvsParam(ivsIndex:number,ivsCount:number):void
            {
                if(this.m_display != null)
                {
                    this.m_display.ivsIndex = ivsIndex;
                    this.m_display.ivsCount = ivsCount;
                    if(this.m_display.__$ruid > -1)
                    {
                        RPOUnitBuider.__$SynIvsParamWithUid(this.m_display.__$ruid, ivsIndex,ivsCount);
                    }
                }
            }
            getMesh():MeshBase
            {
                return this.m_mesh;
            }
            setMaterial(m:MaterialBase):void
            {
                if(m != null)
                {
                    if(this.m_display == null)
                    {
                        this.m_display = RODisplay.Create();
                        this.m_display.transform = this.m_transfrom;
                        this.m_display.visible = this.m_visible && this.m_drawEnabled;                    
                    }
                    if(this.m_display.getMaterial() != m && this.__$wuid < 0 && this.m_display.__$ruid < 0)
                    {
                        this.m_display.renderState = this.m_renderState;
                        this.m_display.rcolorMask = this.m_rcolorMask;
                        this.m_display.setMaterial(m);
                    }
                }
            }
            getMaterial():MaterialBase
            {
                if(this.m_display != null)
                {
                    return this.m_display.getMaterial();
                }
                return null;
            }
            getDisplay():RODisplay
            {
                return this.m_display;
            }

            setRenderColorMask(rt:number):void
            {
                this.m_rcolorMask = rt;
                if(this.m_display != null)
                {
                    this.m_display.rcolorMask = this.m_rcolorMask;
                }
            }

            setRenderColorMaskByName(rt_name:string):void
            {
                this.m_rcolorMask = RendererState.GetRenderColorMaskByName(rt_name);
                if(this.m_display != null)
                {
                    this.m_display.rcolorMask = this.m_rcolorMask;
                }
            }
        
            setRenderState(renderState:number):void
            {
                this.m_renderState = renderState;
                if(this.m_display != null)
                {
                    this.m_display.renderState = this.m_renderState;
                }
            }
    
            setRenderStateByName(renderState_name:string):void
            {
                this.m_renderState = RendererState.GetRenderStateByName(renderState_name);
                if(this.m_display != null)
                {
                    this.m_display.renderState = this.m_renderState;
                }
            }
            protected createDisplay():void
            {
                this.m_display = RODisplay.Create();
            }
            activeDisplay():void
            {
                if(this.m_display != null)
                {
                    let material:MaterialBase = this.m_display.getMaterial();
                    if(material != null && material.getShaderProgram() == null)
                    {
                        if(material.getCodeBuf() != null)
                        {
                            if(material.getShaderProgram() == null)
                            {
                                let texList:TextureProxy[] = material.getTextureList();
                                let texEnabled:boolean = (texList != null && texList.length > 0);
                                material.initializeByCodeBuf(texEnabled);
                            }
                            this.__activeMesh(material);
                            // for debug
                            this.m_display.name = this.name;
                            this.m_display.ivsIndex = 0;
                            this.m_display.ivsCount = this.m_mesh.vtCount;
                            this.m_display.drawMode = this.m_mesh.drawMode;
                        }
                    }
                }
            }
            // for sub class override
            protected __activeMesh(material:MaterialBase):void
            {
            }
            getUid():number{return this.m_uid;}
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_transfrom.setXYZ(px,py,pz);
            }
            setPosition(pv:Vector3D):void
            {             
                this.m_transfrom.setPosition(pv);
            }
            getPosition(pv:Vector3D):void
            {
                this.m_transfrom.getPosition(pv);
            }
            setRotationXYZ(rx:number,ry:number,rz:number):void
            {
                this.m_transfrom.setRotationXYZ(rx,ry,rz);
            }
            setScaleXYZ(sx:number,sy:number,sz:number):void
            {
                this.m_transfrom.setScaleXYZ(sx,sy,sz);
            }
            destroy():void
            {
                // 当自身被完全移出RenderWorld之后才能执行自身的destroy
                console.log("DisplayEntity::destroy(), this.__$wuid: "+this.__$wuid+", this.__$spaceId: "+this.__$spaceId);
                if(this.m_mouseEvtDispatcher != null)
                {
                    this.m_mouseEvtDispatcher.destroy();
                    this.m_mouseEvtDispatcher = null; 
                }
                if(this.m_transfrom != null && this.__$wuid < 0 && this.__$spaceId < 0)
                {
                    // 这里要保证其在所有的process中都被移除
                    if(this.m_display != null)
                    {
                        this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                        RODisplay.Restore(this.m_display);
                        this.m_display = null;
                    }
                    ROTransform.Restore(this.m_transfrom);
                    this.m_transfrom = null;
                    if(this.m_mesh != null)
                    {
                        this.m_mesh.__$detachThis();
                        this.m_mesh = null;
                    }
                    this.__$setParent(null);
                    this.m_visible = true;
                    this.m_drawEnabled = true;
                }
            }
            private static s_boundsInVS:Float32Array = new Float32Array(24);
            private static s_boundsOutVS:Float32Array = new Float32Array(24);
            private static s_pos:Vector3D = new Vector3D();
            isInRenderer():boolean
            {
                return this.__$wuid >= 0;
            }
            isRenderEnabled():boolean
            {
                return this.m_display != null && this.m_display.__$rpuid > -1;
            }
            updateBounds():void
            {
                if(this.m_transfrom != null)
                {
                    this.m_transfrom.setX(this.m_transfrom.getX());
                    this.update();
                }
            }
            update():void
            {
                if(this.m_transfrom.updateStatus != ROTransform.UPDATE_NONE)
                {
                    if(this.m_globalBounds != null && this.m_mesh != null)
                    {
                        // 这里的逻辑也有问题,需要再处理，为了支持摄像机等的拾取以及支持遮挡计算等空间管理计算
                        if(this.m_transfrom.updatedStatus > ROTransform.UPDATE_POSITION)
                        {
                            this.m_transfrom.update();
                            let pminV:Vector3D = this.m_mesh.bounds.min;
                            let pmaxV:Vector3D = this.m_mesh.bounds.max;
                            let pvs:Float32Array = DisplayEntity.s_boundsInVS;
                            pvs[0] = pminV.x;pvs[1] = pminV.y;pvs[2] = pminV.z;
                            pvs[3] = pmaxV.x;pvs[4] = pminV.y;pvs[5] = pminV.z;
                            pvs[6] = pminV.x;pvs[7] = pminV.y;pvs[8] = pmaxV.z;
                            pvs[9] = pmaxV.x;pvs[10] = pminV.y;pvs[11] = pmaxV.z;
                            pvs[12] = pminV.x;pvs[13] = pmaxV.y;pvs[14] = pminV.z;
                            pvs[15] = pmaxV.x;pvs[16] = pmaxV.y;pvs[17] = pminV.z;
                            pvs[18] = pminV.x;pvs[19] = pmaxV.y;pvs[20] = pmaxV.z;
                            pvs[21] = pmaxV.x;pvs[22] = pmaxV.y;pvs[23] = pmaxV.z;            
                            this.m_transfrom.getMatrix().transformVectors(pvs,24,DisplayEntity.s_boundsOutVS);
                            this.m_globalBounds.reset();
                            this.m_globalBounds.addXYZFloat32Arr(DisplayEntity.s_boundsOutVS);
                            this.m_globalBounds.update();
                        }
                        else
                        {
                            this.m_transfrom.update();
                            this.m_globalBounds.radius = this.m_mesh.bounds.radius;
                            this.m_globalBounds.radius2 = this.m_mesh.bounds.radius2;
                            this.m_globalBounds.center.copyFrom(this.m_mesh.bounds.center);
                            this.m_transfrom.getPosition(DisplayEntity.s_pos);
                            this.m_globalBounds.center.addBy(DisplayEntity.s_pos);
                            this.m_globalBounds.min.copyFrom(this.m_mesh.bounds.min);
                            this.m_globalBounds.min.addBy(DisplayEntity.s_pos);
                            this.m_globalBounds.max.copyFrom(this.m_mesh.bounds.max);
                            this.m_globalBounds.max.addBy(DisplayEntity.s_pos);
                            ++this.m_globalBounds.version;
                        }
                    }
                    else
                    {
                        this.m_transfrom.update();
                    }
                }
            }
            toString():string
            {
                return "DisplayEntity(name="+this.name+",uid = "+this.m_uid+", __$wuid = "+this.__$wuid+", __$weid = "+this.__$weid+")";
            }
        }
    }
}