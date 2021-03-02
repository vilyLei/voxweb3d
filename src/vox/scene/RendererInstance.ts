/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRenderStage3DT from "../../vox/render/IRenderStage3D";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderProxyT from "../../vox/render/RenderProxy";

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
import * as DispEntity3DManagerT from "../../vox/scene/DispEntity3DManager";

import IRenderStage3D = IRenderStage3DT.vox.render.IRenderStage3D;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

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
import DispEntity3DManager = DispEntity3DManagerT.vox.scene.DispEntity3DManager;

export namespace vox
{
    export namespace scene
    {
        /**
         * kernal system, it is the renderer instance for the renderer runtime, it is very very very important class.
         */
        export class RendererInstance implements IRenderer
        {
            private m_uid:number = -1;
            private m_entity3DMana:DispEntity3DManager = null;
            private m_processes:RenderProcess[] = [];
            private m_processesLen:number = 0;
            private m_renderProxy:RenderProxy = null;
            private m_adapter:RenderAdapter = null;
            private m_dataBuilder:RODataBuilder = null;
            private m_renderInsContext:RendererInstanceContext = new RendererInstanceContext();
            private m_batchEnabled:boolean = true;
            private m_processFixedState:boolean = true;

            private m_rpoUnitBuilder:RPOUnitBuilder = new RPOUnitBuilder();
            private m_rpoNodeBuilder:RPONodeBuilder = new RPONodeBuilder();
            private m_processBuider:RenderProcessBuider = new RenderProcessBuider();
            private m_roVtxBuild:ROVtxBuilder = null;
            private m_stage3D:IRenderStage3D = null;

            constructor()
            {
            }
            __$setStage3D(stage3D:IRenderStage3D):void
            {
                if(stage3D != null && this.m_stage3D == null)
                {
                    this.m_stage3D = stage3D;
                }
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
            getDataBuilder():RODataBuilder
            {
                return this.m_dataBuilder;
            }
            getRendererContext():RendererInstanceContext
            {
                return this.m_renderInsContext;
            }
            getRenderProxy():RenderProxy
            {
                return this.m_renderProxy;
            }
            
            getStage3D():IRenderStage3D
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
                    
                    this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
                    
                    this.m_dataBuilder = new RODataBuilder();
                    this.m_roVtxBuild = new ROVtxBuilder();

                    this.m_renderInsContext.setCameraParam(param.camProjParam.x,param.camProjParam.y,param.camProjParam.z);
                    this.m_renderInsContext.setMatrix4AllocateSize(param.getMatrix4AllocateSize());
                    this.m_renderInsContext.initialize(param,this.m_stage3D,this.m_dataBuilder,this.m_roVtxBuild);
                    this.m_adapter = this.m_renderProxy.getRenderAdapter();
                    this.m_uid = this.m_renderProxy.getUid();
                    this.m_dataBuilder.initialize(this.m_renderProxy, this.m_rpoUnitBuilder, this.m_processBuider,this.m_roVtxBuild);

                    this.m_renderInsContext.initManager(this.m_dataBuilder);

                    this.m_entity3DMana = new DispEntity3DManager(this.m_uid, this.m_dataBuilder,this.m_rpoUnitBuilder, this.m_processBuider);
                    this.appendProcess(this.m_batchEnabled,this.m_processFixedState);
                }
            }
            /**
             * update all data or status of the renderer runtime
             * should call this function per frame
             */
            update():void
            {
                this.m_renderProxy.Texture.update();
                this.m_renderProxy.Vertex.update();
                this.m_entity3DMana.update(this.m_renderProxy);
            }
            setEntityManaListener(listener:any):void
            {
                this.m_entity3DMana.entityManaListener = listener;
            }
            /**
             * add an entity to the renderer process of the renderer instance
             * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
             * @param processid this destination renderer process id
             * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
             */
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
                        //  else
                        //  {
                        //      console.log("RendererInstance::addEntity(), Error: Don't find processid("+processid+").");
                        //  }
                    }
                    //  else
                    //  {
                    //      console.log("RendererInstance::addEntity(), Warn: this entity has existed in processid("+processid+").");
                    //  }
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
            /**
             * remove entity from the renderer instance
             * @param entity IRenderEntity instance
             */
            removeEntity(entity:IRenderEntity):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    this.m_entity3DMana.removeEntity(entity);
                }
            }
            /**
             * remove entity from the renderer process
             * @param IRenderEntity IRenderEntity instance
             * @param process RenderProcess instance
             */
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
            /**
             * remove entity from the renderer process by process index
             * @param IRenderEntity IRenderEntity instance
             * @param processIndex RenderProcess instance index in renderer instance
             */
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
            /**
             * append a new renderer process instance
             * @param batchEnabled batch renderer runtime resource data
             * @param processFixedState the process is fix renderer state
             */
            appendProcess(batchEnabled:boolean = true,processFixedState:boolean = false):RenderProcess
            {
                this.m_processBuider.setCreateParams(
                    this.m_dataBuilder.getMaterialShader(),
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
            /**
             * append a independent new renderer process instance, and separate the renderer process from the renderer rendering control
             * @param batchEnabled batch renderer runtime resource data
             * @param processFixedState the process is fix renderer state
             */
            createSeparatedProcess(batchEnabled:boolean = true,processFixedState:boolean = false):RenderProcess
            {
                this.m_processBuider.setCreateParams(
                    this.m_dataBuilder.getMaterialShader(),
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
                this.m_dataBuilder.getMaterialShader().useUniformToCurrentShd(material.__$uniform);
            }
            // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
            drawEntityByLockMaterial(entity:IRenderEntity,forceUpdateUniform:boolean = true):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    this.m_processes[ 0 ].drawLockMaterialByDisp(this.m_renderProxy,entity.getDisplay(),forceUpdateUniform);
                }
            }
            /**
             * run the specific renderer process by its index in the renderer instance
             * @param index the renderer process index in the renderer instance
             */
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
            /**
             * run all renderer processes in the renderer instance
             */
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