/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染系统的入口, 一个应用中可以有多个 RendererInstance
// DisplayEntity3D 实例只能由 RendererInstance 来管理, 一个DisplayEntity3D 实例只能加入到一个RendererInstance, 
// 一旦DisplayEntity3D实例 从 RendererInstance 中移除，则表明其完全从渲染管理中移除, 
// RenderProcess 只能由 RendererInstance 来创建, 并且一个process只能被一个RendererInstance实例持有, 如果是外面的逻辑自己管理process则不在这个规定的范围内

import * as Stage3DT from "../../vox/display/Stage3D";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import * as ROBufferUpdaterT from "../../vox/render/ROBufferUpdater";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as IRenderMaterialT from "../../vox/render/IRenderMaterial";
import * as IRenderEntityT from "../../vox/render/IRenderEntity";
import * as RODataBuilderT from "../../vox/render/RODataBuilder";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";
import * as ROVtxBuilderT from "../../vox/render/ROVtxBuilder";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";
import * as IRendererT from "../../vox/scene/IRenderer";

import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as TextureSlotT from "../../vox/texture/TextureSlot";
import * as RTTTextureStoreT from "../../vox/texture/RTTTextureStore";
import * as DispEntity3DManagerT from "../../vox/scene/DispEntity3DManager";

import Stage3D = Stage3DT.vox.display.Stage3D;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

import ROBufferUpdater = ROBufferUpdaterT.vox.render.ROBufferUpdater;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import IRenderMaterial = IRenderMaterialT.vox.render.IRenderMaterial;
import IRenderEntity = IRenderEntityT.vox.render.IRenderEntity;
import RODataBuilder = RODataBuilderT.vox.render.RODataBuilder;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
import ROVtxBuilder = ROVtxBuilderT.vox.render.ROVtxBuilder;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import IRenderer = IRendererT.vox.scene.IRenderer;

import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import TextureSlot = TextureSlotT.vox.texture.TextureSlot;
import RTTTextureStore = RTTTextureStoreT.vox.texture.RTTTextureStore;
import DispEntity3DManager = DispEntity3DManagerT.vox.scene.DispEntity3DManager;

export namespace vox
{
    export namespace scene
    {
        export class RendererInstance implements IRenderer
        {
            private m_uid:number = -1;
            private m_entity3DMana:DispEntity3DManager = null;
            private m_processes:RenderProcess[] = [];
            private m_processesLen:number = 0;
            private m_renderProxy:RenderProxy = null;
            private m_adapter:RenderAdapter = null;
            private m_renderInsContext:RendererInstanceContext = null;
            private m_dispBuilder:RODataBuilder = null;
            private m_batchEnabled:boolean = true;
            private m_processFixedState:boolean = true;

            private m_rpoUnitBuilder:RPOUnitBuilder = new RPOUnitBuilder();
            private m_rpoNodeBuilder:RPONodeBuilder = new RPONodeBuilder();
            private m_processBuider:RenderProcessBuider = new RenderProcessBuider();
            private m_roVtxBuild:ROVtxBuilder = null;
            readonly bufferUpdater:ROBufferUpdater = null;
            readonly textureSlot:TextureSlot = null;
            readonly rttStore:RTTTextureStore = null;
            constructor()
            {
            }
            getUid():number
            {
                return this.m_uid;
            }
            /**
             * @returns return renderer context unique id
             */
            getRCUid():number
            {
                return this.m_uid;
            }
            getRPONodeBuilder():RPONodeBuilder
            {
                return this.m_rpoNodeBuilder;
            }
            getDispBuilder():RODataBuilder
            {
                return this.m_dispBuilder;
            }
            getRendererContext():RendererInstanceContext
            {
                if(this.m_renderInsContext != null)
                {
                    return this.m_renderInsContext;
                }
                return null;
            }
            getRenderProxy():RenderProxy
            {
                return this.m_renderProxy;
            }
            
            getStage3D():Stage3D
            {
                return this.m_renderProxy.getStage3D();
            }
			getViewX():number { return this.m_adapter.getViewportX(); }
			getViewY():number { return this.m_adapter.getViewportY(); }
			getViewWidth():number { return this.m_adapter.getViewportWidth(); }
			getViewHeight():number { return this.m_adapter.getViewportHeight(); }
            getCamera():CameraBase
            {
                if(this.m_renderProxy == null)
                {
                    return this.m_renderInsContext.getCamera();
                }
                return null;
            }
            createCamera():CameraBase
            {
                if(this.m_renderProxy == null)
                {
                    return this.m_renderProxy.createCamera();
                }
            }
            updateCamera():void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.updateCamera();
                }
            }
            initialize(param:RendererParam):void
            {
                if(this.m_renderProxy == null)
                {
                    this.m_batchEnabled = param.batchEnabled;
                    this.m_processFixedState = param.processFixedState;
                    if(this.m_renderInsContext == null)
                    {
                        this.m_renderInsContext = new RendererInstanceContext();
                    }
                    //console.log("param.getMatrix4AllocateSize(): "+param.getMatrix4AllocateSize());
                    this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
                    //this.m_dispBuilder = new RODataBuilder(this.m_renderProxy, this.m_rpoUnitBuilder, this.m_processBuider);
                    this.m_dispBuilder = new RODataBuilder();
                    this.m_roVtxBuild = new ROVtxBuilder();

                    this.m_renderInsContext.setCameraParam(param.camProjParam.x,param.camProjParam.y,param.camProjParam.z);
                    this.m_renderInsContext.setMatrix4AllocateSize(param.getMatrix4AllocateSize());
                    this.m_renderInsContext.initialize(param,this.m_dispBuilder,this.m_roVtxBuild);
                    this.m_adapter = this.m_renderProxy.getRenderAdapter();
                    this.m_uid = this.m_renderProxy.getUid();
                    this.m_dispBuilder.initialize(this.m_renderProxy, this.m_rpoUnitBuilder, this.m_processBuider,this.m_roVtxBuild);

                    this.m_renderInsContext.initManager(this.m_dispBuilder);

                    this.m_entity3DMana = new DispEntity3DManager(this.m_uid, this.m_dispBuilder,this.m_rpoUnitBuilder, this.m_processBuider);
                    this.appendProcess(this.m_batchEnabled,this.m_processFixedState);
                    
                    let roBufUpdater:ROBufferUpdater = new ROBufferUpdater();
                    let texSlot:TextureSlot = new TextureSlot();
                    texSlot.setRenderProxy(this.m_renderProxy);
                    texSlot.setBufferUpdater(roBufUpdater);
                    let selfT:any = this;
                    selfT.bufferUpdater = roBufUpdater;
                    selfT.textureSlot = texSlot;
                    selfT.rttStore = new RTTTextureStore(texSlot);
                }
            }
            update():void
            {
                this.m_renderProxy.Texture.update();
                this.m_renderProxy.Vertex.update();
                this.m_entity3DMana.update(this.m_renderProxy);
                this.bufferUpdater.__$update(this.m_renderProxy);
            }
            setEntityManaListener(listener:any):void
            {
                this.m_entity3DMana.entityManaListener = listener;
            }
            addEntity(entity:IRenderEntity,processid:number = 0,deferred:boolean = true):void
            {
                if(entity != null)
                {
                    if(entity.__$wuid < 0 && entity.__$weid < 0 && entity.__$contId < 0)
                    {
                        if(processid > -1 && processid < this.m_processesLen)
                        {
                            this.m_entity3DMana.addEntity(entity,processid,deferred);
                        }
                        else
                        {
                            console.log("RendererInstance::addEntity(), Error: Don't find processid("+processid+").");
                        }
                    }
                    else
                    {
                        console.log("RendererInstance::addEntity(), Warn: this entity has existed in processid("+processid+").");
                    }
                }
            }
            addEntityToProcess(entity:IRenderEntity,process:RenderProcess,deferred:boolean = true):void
            {
                if(process != null && entity != null && entity.__$wuid < 0 && entity.__$weid < 0 && entity.__$contId < 0)
                {
                    if(process.getWUid() == this.m_uid)
                    {
                        let processid:number = process.getWEid();
                        this.m_entity3DMana.addEntity(entity,processid,deferred);
                    }
                }
            }
            /**
             * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
             * move rendering runtime displayEntity to different renderer process
             */
            moveEntityToProcessAt(entity:IRenderEntity,dstProcessid:number):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    if(entity.isRenderEnabled())
                    {
                        let srcUid:number = entity.getDisplay().__$$runit.getRPROUid();
                        if(srcUid != dstProcessid && dstProcessid > -1 && dstProcessid < this.m_processesLen)
                        {
                            //this.m_entity3DMana.addEntity(this.m_renderProxy, entity,processid);
                            let src:RenderProcess = this.m_processBuider.getNodeByUid(srcUid) as RenderProcess;
                            src.removeDispUnit(entity.getDisplay());
                            let dst:RenderProcess = this.m_processBuider.getNodeByUid(dstProcessid) as RenderProcess;
                            dst.addDisp(entity.getDisplay());
                        }
                    }
                }
            }
            // 这是真正的完全将entity从world中清除
            removeEntity(entity:IRenderEntity):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    this.m_entity3DMana.removeEntity(entity);
                }
            }
            // 只是从对应的process移除这个entity的display
            removeEntityFromProcess(entity:IRenderEntity,process:RenderProcess):void
            {
                if(process != null && process.getWUid() == this.m_uid)
                {
                    if(entity != null && entity.__$wuid == this.m_uid)
                    {
                        process.removeDisp(entity.getDisplay());
                    }
                }
            }
            // 只是通过process在当前RendererInstance实例process数组总的序号,从对应的process移除这个entity的display
            removeEntityByProcessIndex(entity:IRenderEntity,processIndex:number):void
            {
                if(processIndex >= 0 && processIndex < this.m_processesLen)
                {
                    if(entity != null && entity.__$wuid == this.m_uid)
                    {
                        let process:RenderProcess = this.m_processes[processIndex];
                        process.removeDisp(entity.getDisplay());
                    }
                }
            }
            // 生成一个新的process并添加到数组末尾
            appendProcess(batchEnabled:boolean = true,processFixedState:boolean = false):RenderProcess
            {
                this.m_processBuider.setCreateParams(
                    this.m_dispBuilder.getMaterialShader(),
                    this.m_rpoNodeBuilder,
                    this.m_rpoUnitBuilder,
                    this.m_renderProxy.Vertex,
                    batchEnabled,
                    processFixedState
                );
                
                let process:RenderProcess = this.m_processBuider.create() as RenderProcess;
                
                this.m_processes.push( process );
                process.setWOrldParam(this.m_uid, this.m_processesLen);
                ++this.m_processesLen;
                return process;
            }
            createSeparatedProcess(batchEnabled:boolean = true,processFixedState:boolean = false):RenderProcess
            {
                this.m_processBuider.setCreateParams(
                    this.m_dispBuilder.getMaterialShader(),
                    this.m_rpoNodeBuilder,
                    this.m_rpoUnitBuilder,
                    this.m_renderProxy.Vertex,
                    batchEnabled,
                    processFixedState
                );
                let process:RenderProcess = this.m_processBuider.create() as RenderProcess;

                this.m_processes.push( process );
                process.setWOrldParam(this.m_uid, this.m_processesLen);
                return process;
            }
            
            setRendererProcessParam(index:number,batchEnabled:boolean,processFixedState:boolean):void
            {
                if(index > -1 && index < this.m_processesLen)
                {
                    this.m_processes[ index ].setRenderParam(batchEnabled, processFixedState);
                }
            }
            getProcessAt(index:number):RenderProcess
            {
                if(index > -1 && index < this.m_processesLen)
                {
                    return this.m_processes[ index ];
                }
                return null;
            }
            showInfoAt(index:number):void
            {
                if(index > -1 && index < this.m_processesLen)
                {
                    this.m_processes[ index ].showInfo();
                }
            }
            getProcessesTotal():number
            {
                return this.m_processesLen;
            }
            updateMaterialUniformToCurrentShd(material:IRenderMaterial):void
            {
                this.m_dispBuilder.getMaterialShader().useUniformToCurrentShd(material.__$uniform);
            }
            // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
            drawEntityByLockMaterial(entity:IRenderEntity,forceUpdateUniform:boolean = true):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    this.m_processes[ 0 ].drawLockMaterialByDisp(this.m_renderProxy,entity.getDisplay(),forceUpdateUniform);
                }
            }
            runAt(index:number):void
            {
                this.m_processes[index].run(this.m_renderProxy);
            }
            runProcess(process:RenderProcess):void
            {
                if(process.getWUid() == this.m_uid)
                {
                    process.run(this.m_renderProxy);
                }
            }
            runFromIndexTo(index:number):void
            {
                for(let i:number = index; i < this.m_processesLen; ++i)
                {
                    this.m_processes[i].run(this.m_renderProxy);
                }
            }
            run():void
            {
                if(!this.m_entity3DMana.isEmpty())
                {
                    for(let i:number = 0; i < this.m_processesLen; ++i)
                    {
                        this.m_processes[i].run(this.m_renderProxy);
                    }
                }
            }
            getRenderUnitsTotal():number
            {
                let total:number = 0;
                for(let i:number = 0; i < this.m_processesLen; ++i)
                {
                    total += this.m_processes[i].getUnitsTotal();
                }
                return total;
            }
            toString():string
            {
                return "[RendererInstance(uid = "+this.m_uid+")]";
            }
        }
    }
}