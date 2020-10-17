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

//import * as Vector3DT from "../../vox/geom/Vector3";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as RODisplayT from "../../vox/display/RODisplay";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RenderBufferUpdaterT from "../../vox/render/RenderBufferUpdater";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as MaterialBaseT from '../../vox/material/MaterialBase';
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as RPOUnitBuiderT from "../../vox/render/RPOUnitBuider";
import * as RODispBuilderT from "../../vox/render/RODispBuilder";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";
//import * as ROUpdateQueueT from "../../vox/render/ROUpdateQueue";
import * as RendererInstanceContextT from "../../vox/scene/RendererInstanceContext";
import * as IRendererT from "../../vox/scene/IRenderer";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as Entity3DNodeLinkerT from "../../vox/scene/Entity3DNodeLinker";


//import Vector3D = Vector3DT.vox.geom.Vector3D;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RODisplay = RODisplayT.vox.display.RODisplay;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RenderBufferUpdater = RenderBufferUpdaterT.vox.render.RenderBufferUpdater;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import RODispBuilder = RODispBuilderT.vox.render.RODispBuilder;
import RCRPObj = RPOUnitBuiderT.vox.render.RCRPObj;
import RPOUnitBuider = RPOUnitBuiderT.vox.render.RPOUnitBuider;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;
//import ROUpdateQueue = ROUpdateQueueT.vox.render.ROUpdateQueue;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import IRenderer = IRendererT.vox.scene.IRenderer;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import Entity3DNodeLinker = Entity3DNodeLinkerT.vox.scene.Entity3DNodeLinker;

export namespace vox
{
    export namespace scene
    {
        export class RendererInstance implements IRenderer
        {
            private static __s_uid:number = 0;
            private m_uid:number = -1;
            private m_entity3DMana:DispEntity3DManager = null;
            private m_processes:RenderProcess[] = [];
            private m_processesLen:number = 0;
            private m_renderProxy:RenderProxy = null;
            private m_adapter:RenderAdapter = null;
            private m_renderInsContext:RendererInstanceContext = null;
            private m_dispBuilder:RODispBuilder = null;
            private m_batchEnabled:boolean = true;
            private m_processFixedState:boolean = true;
            constructor()
            {
                this.m_uid = RendererInstance.__s_uid++;
            }
            getRendererContext():RendererInstanceContext
            {
                if(this.m_renderInsContext != null)
                {
                    return this.m_renderInsContext;
                }
                this.m_renderInsContext = new RendererInstanceContext();
                return this.m_renderInsContext;
            }
            getRenderProxy():RenderProxy
            {
                return this.m_renderProxy;
            }
            
            getStage3D():Stage3D
            {
                return this.m_renderProxy.getStage3D();
            }
			getViewX():number { return this.m_adapter.getViewX(); }
			getViewY():number { return this.m_adapter.getViewY(); }
			getViewWidth():number { return this.m_adapter.getViewWidth(); }
			getViewHeight():number { return this.m_adapter.getViewHeight(); }
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
                    this.m_dispBuilder = new RODispBuilder();
                    this.m_entity3DMana = new DispEntity3DManager(this.m_uid, this.m_dispBuilder);
                    this.m_renderInsContext.setCameraParam(param.camProjParam.x,param.camProjParam.y,param.camProjParam.z);
                    this.m_renderInsContext.setMatrix4AllocateSize(param.getMatrix4AllocateSize());
                    this.m_renderInsContext.initialize(param);
                    this.m_renderInsContext.setDispBuilder(this.m_dispBuilder);
                    this.m_renderProxy = this.m_renderInsContext.getRenderProxy();
                    this.m_adapter = this.m_renderProxy.getRenderAdapter();
                    this.appendProcess(this.m_batchEnabled,this.m_processFixedState);
                }
            }
            getUid():number
            {
                return this.m_uid;
            }
            update():void
            {
                this.m_entity3DMana.update(this.m_renderProxy);
                RenderBufferUpdater.GetInstance().__$update(this.m_renderProxy);
            }
            setEntityManaListener(listener:any):void
            {
                this.m_entity3DMana.entityManaListener = listener;
            }
            addEntity(entity:DisplayEntity,processid:number = 0,deferred:boolean = true):void
            {
                if(entity != null)
                {
                    if(entity.__$wuid < 0 && entity.__$weid < 0 && entity.__$contId < 0)
                    {
                        if(processid > -1 && processid < this.m_processesLen)
                        {
                            this.m_entity3DMana.addEntity(this.m_renderProxy, entity,processid,deferred);
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
            addEntityToProcess(entity:DisplayEntity,process:RenderProcess,deferred:boolean = true):void
            {
                if(process != null && entity != null && entity.__$wuid < 0 && entity.__$weid < 0 && entity.__$contId < 0)
                {
                    if(process.getWUid() == this.m_uid)
                    {
                        let processid:number = process.getWEid();
                        //  if(processid > -1 && processid < this.m_processesLen)
                        //  {
                        this.m_entity3DMana.addEntity(this.m_renderProxy, entity,processid,deferred);
                        //  }
                        //  else
                        //  {
                        //      console.log("RendererInstance::addEntityToProcess(), Error: Don't find processid("+processid+").");
                        //  }
                    }
                }
            }
            // 这是真正的完全将entity从world中清除
            removeEntity(entity:DisplayEntity):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    this.m_entity3DMana.removeEntity(entity);
                }
            }
            // 只是从对应的process移除这个entity的display
            removeEntityFromProcess(entity:DisplayEntity,process:RenderProcess):void
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
            removeEntityByProcessIndex(entity:DisplayEntity,processIndex:number):void
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
                let process:RenderProcess = RenderProcessBuider.Create(batchEnabled,processFixedState);
                //console.log("RendererInstance::appendProcess(), process: "+process);
                this.m_processes.push( process );
                process.setWOrldParam(this.m_uid, this.m_processesLen);
                ++this.m_processesLen;
                return process;
            }
            createSeparatedProcess(batchEnabled:boolean = true,processFixedState:boolean = false):RenderProcess
            {
                let process:RenderProcess = RenderProcessBuider.Create(batchEnabled,processFixedState);
                //console.log("RendererInstance::createSeparatedProcess(), process: "+process);
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
            // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
            drawEntityByLockMaterial(entity:DisplayEntity):void
            {
                if(entity != null && entity.__$wuid == this.m_uid)
                {
                    this.m_processes[ 0 ].drawLockMaterialByDisp(this.m_renderProxy,entity.getDisplay());
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
            toString():string
            {
                return "[RendererInstance(uid = "+this.m_uid+")]";
            }
        }

        export class DispEntity3DManager
        {
            private m_waitList:DisplayEntity[] = [];
            private m_processUidList:number[] = [];
            private m_wuid:number = -1;            
            private m_dispBuilder:RODispBuilder = null;
            constructor(__$wuid:number, preROMana:RODispBuilder)
            {
                this.m_wuid = __$wuid;
                this.m_dispBuilder = preROMana;
            }

            nodeLinker = new Entity3DNodeLinker();
            entityManaListener:any = null;

            isEmpty():boolean
            {
                return this.nodeLinker.isEmpty();
            }
            removeEntity(entity:DisplayEntity):void
            {
                if(entity.__$wuid == this.m_wuid && entity.__$weid > -1)
                {
                    let node:Entity3DNode = Entity3DNode.GetByUid(entity.__$weid);
                    if(node != null && entity == node.entity)
                    {
                        this.nodeLinker.removeNode(node);
                        // 从所有相关process中移除这个display
                        let display:RODisplay = entity.getDisplay();
                        if(display != null && display.__$ruid > -1)
                        {
                            let puid:number = display.__$ruid;
                            let po:RCRPObj = RPOUnitBuider.GetRCRPObj(puid);
                            let list:Int16Array = po.rcids;
                            let len:number = RCRPObj.RenerProcessMaxTotal;
                            //console.log("list: "+list);
                            for(let i:number = 0; i < len; ++i)
                            {
                                if(list[i] > -1)
                                {
                                    //the value of list[i] is the uid of a node;
                                    this.m_rprocess = RenderProcessBuider.GetProcess(i);
                                    this.m_rprocess.removeDisp(display);
                                }
                            }
                            if(po.count == 0)
                            {
                                //console.log("DispEntity3DManager::removeEntity(), remove a entity from all processes.");
                                if(display.rsign != RODisplay.LIVE_IN_WORLD)
                                if(display.rsign != RODisplay.LIVE_IN_WORLD)
                                {
                                    // error!!!
                                    console.log("DispEntity3DManager::removeEntity(), Error: display.rsign != RODisplay.LIVE_IN_WORLD.");
                                }
                                display.rsign = RODisplay.NOT_IN_WORLD;
                                // 准备移除和当前 display 对应的 RPOUnit
                                RPOUnitBuider.Restore(RPOUnitBuider.GetRPOUnit(puid));
                            }
                            else
                            {
                                console.log("Error: DispEntity3DManager::removeEntity(), remove a entity from all processes failed.");
                            }
                        }
                        Entity3DNode.Restore(node);
                    }
                    entity.__$wuid = -1;
                    entity.__$weid = -1;

                    if(this.entityManaListener != null)
                    {
                        this.entityManaListener.removeFromWorld(entity,this.m_wuid,-1);
                    }
                }
            }
            addEntity(rc:RenderProxy, entity:DisplayEntity, processUid:number,deferred:boolean = false):boolean
            {
                if(entity != null)
                {
                    //console.log("XXXXXXXXXX entity.getUid(): "+entity.getUid());
                    let disp:RODisplay = entity.getDisplay();
                    if(disp != null)
                    {
                        if(disp.rsign == RODisplay.LIVE_IN_WORLD)
                        {
                            if(!RPOUnitBuider.TestRPNodeNotExists(disp.__$ruid,processUid))
                            {
                                //console.log("DispEntity3DManager::addEntity(), A, this display("+disp.__$ruid+") has existed in processid("+processUid+").");
                                return;
                            }                
                        }
                        if(deferred)
                        {
                            if(disp.rsign == RODisplay.NOT_IN_WORLD)
                            {
                                disp.rsign = RODisplay.GO_TO_WORLD;
                            }
                            //entity.update();
                            entity.__$weid = 999999;
                            entity.__$wuid = this.m_wuid;
                            this.m_waitList.push(entity);
                            this.m_processUidList.push(processUid);
                            //console.log("DispEntity3DManager::addEntity(), B, this display("+disp+") has existed in processid("+processUid+").");
                        }
                        else
                        {
                            // 检查数据完整性
                            if(this.testValidData(entity))
                            {
                                entity.update();
                                entity.__$wuid = this.m_wuid;
                                let node:Entity3DNode = Entity3DNode.Create();
                                node.entity = entity;
                                entity.__$weid = node.uid;
                                this.nodeLinker.addNode(node);
                                if(disp.rsign == RODisplay.NOT_IN_WORLD)
                                {
                                    disp.rsign = RODisplay.GO_TO_WORLD;
                                }
                                this.m_rprocess = RenderProcessBuider.GetProcess(processUid);
                                //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                                //this.m_rprocess.addDisp(rc, disp,false);
                                if(disp.__$ruid > -1)
                                {
                                    this.m_rprocess.addDisp(rc, disp,false);
                                }
                                else
                                {
                                    this.m_dispBuilder.addDispToProcess(rc, disp, this.m_rprocess.index);
                                }
                                //
                                if(this.entityManaListener != null)
                                {
                                    this.entityManaListener.addToWorld(entity,this.m_wuid,processUid);
                                }
                            }
                            else
                            {
                                //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                                if(disp.rsign == RODisplay.NOT_IN_WORLD)
                                {
                                    disp.rsign = RODisplay.GO_TO_WORLD;
                                }
                                entity.__$weid = 999999;
                                this.m_waitList.push(entity);
                                this.m_processUidList.push(processUid);
                            }
                        }
                    }
                    else
                    {
                        entity.__$wuid = this.m_wuid;
                    }
                }
                return false;
            }
            private m_material:MaterialBase = null;
            private m_shdp:ShaderProgram = null;
            private m_rprocess:RenderProcess = null;
            testValidData(entity:DisplayEntity):boolean
            {
                this.m_material = entity.getMaterial();
                if(this.m_material != null && entity.getMesh() != null)
                {
                    this.m_shdp = this.m_material.getShaderProgram();
                    if(this.m_shdp != null)
                    {
                        if(this.m_shdp.haveTexture())
                        {
                            if(this.m_material.texDataEnabled())
                            {
                                return true;
                            }
                        }
                        else
                        {
                            return true;
                        }
                    }
                    else if(this.m_material.getCodeBuf() != null)
                    {
                        entity.activeDisplay();
                    }
                }
                return false;
            }
            update(rc:RenderProxy):void
            {
                let len:number = this.m_waitList.length;
                let entity:DisplayEntity = null;
                let node:Entity3DNode = null;
                let disp:RODisplay = null;
                for(let i:number = 0; i < len; ++i)
                {
                    entity = this.m_waitList[i];
                    if(entity.__$weid == 999999)
                    {
                        if(this.testValidData(entity))
                        {
                            disp = entity.getDisplay();
                            if(disp.rsign == RODisplay.LIVE_IN_WORLD)
                            {
                                if(!RPOUnitBuider.TestRPNodeNotExists(disp.__$ruid,this.m_processUidList[i]))
                                {
                                    //console.log("DispEntity3DManager::update(), this display("+disp.__$ruid+") has existed in processid("+m_processUidList[i]+").");
                                    this.m_waitList.splice(i,1);
                                    this.m_processUidList.splice(i,1);
                                    --len;
                                    --i;
                                    continue;
                                }
                            }
                            entity.update();
                            entity.__$wuid = this.m_wuid;
                            node = Entity3DNode.Create();
                            node.entity = entity;
                            entity.__$weid = node.uid;
                            this.nodeLinker.addNode(node);
                            //
                            let prouid = this.m_processUidList[i];
                            this.m_rprocess = RenderProcessBuider.GetProcess(prouid);
                            //console.log("DispEntity3DManager::update(), add a ready ok entity("+entity+") to processid("+prouid+")");
                            if(disp.__$ruid > -1)
                            {
                                this.m_rprocess.addDisp(rc, disp,false);
                            }
                            else
                            {
                                this.m_dispBuilder.addDispToProcess(rc, disp, this.m_rprocess.index);
                            }
                            //
                            this.m_waitList.splice(i,1);
                            this.m_processUidList.splice(i,1);
                            --len;
                            --i;
                            if(this.entityManaListener != null)
                            {
                                this.entityManaListener.addToWorld(entity,this.m_wuid,prouid);
                            }
                        }
                    }
                    else
                    {
                        disp = entity.getDisplay();
                        if(disp != null && disp.rsign == RODisplay.GO_TO_WORLD)
                        {
                            disp.rsign = RODisplay.NOT_IN_WORLD;
                        }
                        console.log("DispEntity3DManager::update(), remove a ready entity.");
                        entity.__$weid = -1;
                        entity.__$wuid = -1;
                        this.m_waitList.splice(i,1);
                        this.m_processUidList.splice(i,1);
                        --len;
                        --i;
                        if(this.entityManaListener != null)
                        {
                            this.entityManaListener.removeFromWorld(entity,this.m_wuid,-1);
                        }
                    }
                }                
                this.m_dispBuilder.update(rc);
            }    
        }
    }
}