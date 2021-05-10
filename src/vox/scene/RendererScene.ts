/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染场景的入口类

import Vector3D from "../../vox/math/Vector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import Stage3D from "../../vox/display/Stage3D";
import Color4 from "../../vox/material/Color4";
import CameraBase from "../../vox/view/CameraBase";
import RenderAdapter from "../../vox/render/RenderAdapter";
import RenderProxy from "../../vox/render/RenderProxy";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import RendererParam from "../../vox/scene/RendererParam";
import IRenderProcess from "../../vox/render/IRenderProcess";
import RenderProcess from "../../vox/render/RenderProcess";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import EntityNodeQueue from "../../vox/scene/EntityNodeQueue";
import Entity3DNodeLinker from "../../vox/scene/Entity3DNodeLinker";

import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import RendererInstanceContext from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import TextureBlock from "../../vox/texture/TextureBlock";
import IRenderer from "../../vox/scene/IRenderer";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import RendererSpace from "../../vox/scene/RendererSpace";
import RaySelectedNode from "../../vox/scene/RaySelectedNode";
import IRaySelector from "../../vox/scene/IRaySelector";
import RaySelector from "../../vox/scene/RaySelector";
import RayGpuSelector from "../../vox/scene/RayGpuSelector";
import MouseEvt3DController from "../../vox/scene/MouseEvt3DController";
import IEvt3DController from "../../vox/scene/IEvt3DController";
import FBOInstance from "../../vox/scene/FBOInstance";
import IRODisplaySorter from "../../vox/render/IRODisplaySorter";
import CameraDsistanceSorter from "../../vox/scene/CameraDsistanceSorter";
import RendererSubScene from "../../vox/scene/RendererSubScene";

export default class RendererScene implements IRenderer
{
    private static s_uid:number = 0;
    private m_uid:number = -1;
    private m_adapter:RenderAdapter = null;
    private m_renderProxy:RenderProxy = null;
    private m_rcontext:RendererInstanceContext = null;
    private m_renderer:RendererInstance = null;
    private m_processids:Uint8Array = new Uint8Array(128);
    private m_processidsLen:number = 0;
    private m_rspace:IRendererSpace = null;
    private m_mouse_rltv:Vector3D = new Vector3D();
    private m_mouse_rlpv:Vector3D = new Vector3D();
    // event flow control enable
    private m_evtFlowEnabled:boolean = false;
    private m_evt3DCtr:IEvt3DController = null;
    private m_viewX:number = 0.0;
    private m_viewY:number = 0.0;
    private m_viewW:number = 800.0
    private m_viewH:number = 800.0;

    private m_nodeWaitLinker:Entity3DNodeLinker = null;
    private m_nodeWaitQueue:EntityNodeQueue = null;
    private m_camDisSorter:CameraDsistanceSorter = null;
    // recorde renderer sub scenes
    private m_subscList:RendererSubScene[] = [];
    private m_subscListLen:number = 0;
    private m_runFlag:number = -1;
    private m_autoRunning:boolean = true;
    private m_processUpdate:boolean = false;
    private m_tickId:any = -1;
    private m_rparam:RendererParam = null;
    
    readonly textureBlock:TextureBlock = new TextureBlock();
    readonly stage3D:Stage3D = null;
    constructor()
    {
        this.m_uid = RendererScene.s_uid++;
    }
    private tickUpdate():void
    {
        if(this.m_tickId > -1)
        {
            clearTimeout(this.m_tickId);
        }
        this.m_tickId = setTimeout(this.tickUpdate.bind(this),this.m_rparam.getTickUpdateTime());
        this.textureBlock.run();
    }
    getUid():number
    {
        return this.m_uid;
    }
    
    getDiv():any
    {
        return this.m_renderProxy.getDiv();
    }
    getCanvas():any
    {
        return this.m_renderProxy.getCanvas();
    }
    
    getRPONodeBuilder():RPONodeBuilder
    {
        return null;
    }
    getRenderProxy():RenderProxy
    {
        return this.m_renderProxy;
    }
    // set new view port rectangle area
    setViewPort(px:number,py:number,pw:number,ph:number):void
    {
        if(this.m_renderProxy != null)
        {
            this.m_viewX = px;
            this.m_viewY = py;
            this.m_viewW = pw;
            this.m_viewH = ph;
            this.m_renderProxy.setViewPort(px,py,pw,ph);
        }
    }
    // apply new view port rectangle area
    reseizeViewPort():void
    {
        this.m_renderProxy.reseizeRCViewPort();
    }
    lockViewport():void
    {
        this.m_adapter.lockViewport();
    }
    unlockViewport():void
    {
        this.m_adapter.unlockViewport();
    }
    getRendererAdapter():RenderAdapter
    {
        return this.m_adapter;
    }
    getRenderer():RendererInstance
    {
        return this.m_renderer;
    }
    getRendererContext():RendererInstanceContext
    {
        return this.m_rcontext;
    }
    getStage3D():IRenderStage3D
    {
        return this.m_renderProxy.getStage3D();
    }
    getCamera():CameraBase
    {
        return this.m_renderProxy.getCamera();
    }
    cameraLock():void
    {
        this.m_renderProxy.cameraLock();
    }
    cameraUnlock():void
    {
        this.m_renderProxy.cameraUnlock();
    }
    getMouseXYWorldRay(rl_position:Vector3D, rl_tv:Vector3D):void
    {
        this.m_renderProxy.getMouseXYWorldRay(rl_position,rl_tv);
    }
    createCamera():CameraBase
    {
        return this.m_renderProxy.createCamera();
    }
    createFBOInstance():FBOInstance
    {
        return new FBOInstance(this, this.textureBlock.getRTTStrore());
    }
    setClearUint24Color(colorUint24:number,alpha:number = 1.0):void
    {
        this.m_renderProxy.setClearUint24Color(colorUint24, alpha);
    }
    setClearRGBColor3f(pr:number,pg:number,pb:number)
    {
        this.m_renderProxy.setClearRGBColor3f(pr,pg,pb);
    }
    setClearRGBAColor4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_renderProxy.setClearRGBAColor4f(pr,pg,pb,pa);
    }
    setClearColor(color:Color4):void
    {
        this.m_renderProxy.setClearRGBAColor4f(color.r,color.g,color.b,color.a);
    }
    setRenderToBackBuffer():void
    {
        this.m_rcontext.setRenderToBackBuffer();
    }
    
    updateRenderBufferSize():void
    {
        this.m_adapter.updateRenderBufferSize();
    }
    setEvt3DController(evt3DCtr:IEvt3DController):void
    {
        if(evt3DCtr != null)
        {
            evt3DCtr.initialize(this.getStage3D());
            evt3DCtr.setRaySelector(this.m_rspace.getRaySelector());
        }
        this.m_evt3DCtr = evt3DCtr;
    }
    private m_mouseEvtEnabled:boolean = true;
    enableMouseEvent(gpuTestEnabled:boolean = true):void
    {
        if(this.m_evt3DCtr == null)
        {
            if(gpuTestEnabled)
            {
                this.m_rspace.setRaySelector(new RayGpuSelector());
            }
            else
            {
                this.m_rspace.setRaySelector(new RaySelector());
            }
            this.setEvt3DController(new MouseEvt3DController());
        }
        this.m_mouseEvtEnabled = true;                
    }
    disableMouseEvent():void
    {
        this.m_mouseEvtEnabled = false; 
    }
    getEvt3DController():IEvt3DController
    {
        return this.m_evt3DCtr;
    }
    getSpace():IRendererSpace
    {
        return this.m_rspace;
    }
    getDevicePixelRatio():number
    {
        return this.m_adapter.getDevicePixelRatio();
    }
    /**
     * very important renderer scene system function
     */
    createSubScene():RendererSubScene
    {
        if(this.m_renderer != null)
        {
            let subsc:RendererSubScene = new RendererSubScene(this.m_renderer,this.m_evtFlowEnabled);
            this.m_subscList.push(subsc);
            this.m_subscListLen++;
            return subsc;
        }
        return null;
    }
    addEventListener(type:number,target:any,func:(evt:any)=>void,captureEnabled:boolean = true,bubbleEnabled:boolean = true):void
    {
        this.stage3D.addEventListener(type, target, func, captureEnabled,bubbleEnabled);
    }
    removeEventListener(type:number,target:any,func:(evt:any)=>void):void
    {
        this.stage3D.removeEventListener(type, target, func);
    }
    initialize(rparam:RendererParam,renderProcessTotal:number = 1):void
    {
        if(this.m_renderer == null && rparam != null)
        {
            this.m_rparam = rparam;
            let selfT:any = this;
            selfT.stage3D = new Stage3D(this.getUid(),document);
            if(renderProcessTotal < 1)
            {
                renderProcessTotal = 1;
            }
            if(renderProcessTotal > 8)
            {
                renderProcessTotal = 8;
            }
            this.m_evtFlowEnabled = rparam.evtFlowEnabled;
            this.m_renderer = new RendererInstance();
            
            this.m_renderer.__$setStage3D(this.stage3D);
            this.m_renderer.initialize(rparam);
            this.m_processids[0] = 0;
            this.m_processidsLen++;
            let process:RenderProcess = null;
            for(; renderProcessTotal >= 0; )
            {
                process = this.m_renderer.appendProcess(rparam.batchEnabled,rparam.processFixedState) as RenderProcess;
                this.m_processids[this.m_processidsLen] = process.getRPIndex();
                this.m_processidsLen++;
                --renderProcessTotal;
            }
            this.m_rcontext = this.m_renderer.getRendererContext();
            this.m_renderProxy = this.m_rcontext.getRenderProxy();
            this.m_adapter = this.m_renderProxy.getRenderAdapter();
            let stage3D:IRenderStage3D = this.m_renderProxy.getStage3D();
            this.m_viewW = stage3D.stageWidth;
            this.m_viewH = stage3D.stageHeight;

            this.textureBlock.setRenderer(this.m_renderer);
            this.m_camDisSorter = new CameraDsistanceSorter(this.m_renderProxy);
            if(this.m_rspace == null)
            {
                let space:RendererSpace = new RendererSpace();
                space.initialize(this.m_renderer,this.m_renderProxy.getCamera());
                this.m_rspace = space;
            }
            this.tickUpdate();
        }
    }
    setRendererProcessParam(index:number,batchEnabled:boolean,processFixedState:boolean):void
    {
        this.m_renderer.setRendererProcessParam(this.m_processids[index],batchEnabled, processFixedState);
    }
    appendARendererProcess(batchEnabled:boolean = true, processFixedState:boolean = false):void
    {
        let process:RenderProcess = this.m_renderer.appendProcess(batchEnabled, processFixedState) as RenderProcess;
        this.m_processids[this.m_processidsLen] = process.getRPIndex();
        this.m_processidsLen++;
    }
    private m_children:DisplayEntityContainer[] = [];
    private m_childrenTotal:number = 0;
    addContainer(child:DisplayEntityContainer,processIndex:number = 0):void
    {
        if(processIndex < 0)
        {
            processIndex = 0;
        }
        if(child != null && child.__$wuid < 0 && child.__$contId < 1)
        {
            let i:number = 0;
            for(; i < this.m_childrenTotal; ++i)
            {
                if(this.m_children[i] == child)
                {
                    return;
                }
            }
            if(i >= this.m_childrenTotal)
            {
                child.__$wuid = this.m_uid;
                child.wprocuid = this.m_processids[processIndex];
                child.__$setRenderer( this );
                this.m_children.push(child);
                this.m_childrenTotal++;
            }
        }
    }
    removeContainer(child:DisplayEntityContainer):void
    {
        if(child != null && child.__$wuid == this.m_uid && child.getRenderer() == this.m_renderer)
        {
            let i:number = 0;
            for(; i < this.m_childrenTotal; ++i)
            {
                if(this.m_children[i] == child)
                {
                    child.__$wuid = -1;
                    child.wprocuid = -1;
                    child.__$setRenderer( null );
                    this.m_children.splice(i,1);
                    --this.m_childrenTotal;
                    break;
                }
            }
        }
    }
    setAutoRunning(autoRunning:boolean):void
    {
        this.m_autoRunning = autoRunning;
    }
    setAutoRenderingSort(sortEnabled:boolean):void
    {
        this.m_processUpdate = sortEnabled;
    }
    setProcessSortEnabledAt(processIndex:number,sortEnabled:boolean,sorter:IRODisplaySorter = null):void
    {
        this.m_renderer.setProcessSortEnabledAt(processIndex, sortEnabled);
        if(sortEnabled)
        {
            let process:IRenderProcess = this.m_renderer.getProcessAt(processIndex);
            sorter = sorter != null?sorter:this.m_camDisSorter;
            if(process != null)
            {
                process.setSorter(sorter);
            }
        }
    }
    setProcessSortEnabled(process:IRenderProcess,sortEnabled:boolean,sorter:IRODisplaySorter = null):void
    {
        this.m_renderer.setProcessSortEnabled(process, sortEnabled);
        if(sortEnabled && process != null && !process.hasSorter())
        {
            sorter = sorter != null?sorter:this.m_camDisSorter;
            process.setSorter(sorter);
        }
    }
    /**
     * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
     * move rendering runtime displayEntity to different renderer process
     */
    moveEntityTo(entity:IRenderEntity,processindex:number):void
    {
        this.m_renderer.moveEntityToProcessAt(entity,this.m_processids[processindex]);
    }
    drawEntity(entity:IRenderEntity):void
    {
        this.m_renderer.drawEntity(entity);
    }
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity:IRenderEntity,processindex:number = 0,deferred:boolean = true):void
    {
        if(entity.__$testSpaceEnabled())
        {
            if(entity.isPolyhedral())
            {
                if(entity.hasMesh())
                {
                    this.m_renderer.addEntity(entity,this.m_processids[processindex],deferred);
                    if(this.m_rspace != null)
                    {
                        this.m_rspace.addEntity(entity);
                    }
                }
                else
                {
                    // 这里的等待队列可能会和加入容器的操作冲突
                    // wait queue
                    if(this.m_nodeWaitLinker == null)
                    {
                        this.m_nodeWaitLinker = new Entity3DNodeLinker();
                        this.m_nodeWaitQueue = new EntityNodeQueue();
                    }
                    let node:Entity3DNode = this.m_nodeWaitQueue.addEntity(entity);                            
                    node.rstatus = processindex;
                    this.m_nodeWaitLinker.addNode(node);
                }
            }
            else
            {
                this.m_renderer.addEntity(entity,this.m_processids[processindex],deferred);
                if(this.m_rspace != null)
                {
                    this.m_rspace.addEntity(entity);
                }
            }
        }
    }
    // 这是真正的完全将entity从world中清除
    removeEntity(entity:IRenderEntity):void
    {
        let node:Entity3DNode = null;
        if(this.m_nodeWaitLinker != null)
        {
            let node:Entity3DNode = this.m_nodeWaitQueue.getNodeByEntity(entity);
            if(node != null)
            {
                this.m_nodeWaitLinker.removeNode(node);
                this.m_nodeWaitQueue.removeEntity(entity);
            }
        }
        if(node == null)
        {
            this.m_renderer.removeEntity(entity);
            if(this.m_rspace != null)
            {
                this.m_rspace.removeEntity(entity);
            }
        }
    }
    
    updateMaterialUniformToCurrentShd(material:IRenderMaterial):void
    {
        this.m_renderer.updateMaterialUniformToCurrentShd(material);
    }
    // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
    drawEntityByLockMaterial(entity:IRenderEntity):void
    {
        this.m_renderer.drawEntityByLockMaterial(entity);
    }
    showInfoAt(index:number):void
    {
        this.m_renderer.showInfoAt(index);
    }
    
    getRenderUnitsTotal():number
    {
        return this.m_renderer.getRenderUnitsTotal();
    }
    runBegin():void
    {
        if(this.m_autoRunning)
        {
            if(this.m_runFlag >= 0) this.runEnd();
            this.m_runFlag = 0;
        }

        this.m_adapter.unlockViewport();
        if(!this.m_renderProxy.isAutoSynViewAndStage())
        {
            this.m_renderProxy.setViewPort(this.m_viewX,this.m_viewY,this.m_viewW,this.m_viewH);
        }
        this.m_renderProxy.getCamera().update();
        this.m_rcontext.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
        this.m_rcontext.renderBegin();
        if(this.m_rspace != null)
        {
            this.m_rspace.runBegin();
        }
    }
    /**
     * the function resets the renderer instance rendering status.
     * you should use it on the frame starting time.
     */
    renderBegin():void
    {
        this.m_adapter.unlockViewport();
        if(!this.m_renderProxy.isAutoSynViewAndStage())
        {
            this.m_renderProxy.setViewPort(this.m_viewX,this.m_viewY,this.m_viewW,this.m_viewH);
        }
        this.m_renderProxy.updateCamera();
        this.m_rcontext.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
        this.m_rcontext.renderBegin();
        if(this.m_rspace != null)
        {
            this.m_rspace.runBegin();
        }
    }
    synFBOSizeWithViewport():void
    {
        this.m_rcontext.synFBOSizeWithViewport();
    }
    private m_mouseTestBoo:boolean = true;
    private m_cullingTestBoo:boolean = true;
    private m_rayTestBoo:boolean = true;
    // @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
    // @param       status: 1(default process),1(deselect ray pick target)
    // @return      1 is send evt yes,0 is send evt no,-1 is event nothing
    runMouseTest(evtFlowPhase:number,status:number):number
    {
        let flag:number = -1;
        if(this.m_evt3DCtr != null && this.m_mouseEvtEnabled)
        {
            if(this.m_rayTestBoo && this.m_evt3DCtr.getEvtType() > 0)
            {
                this.mouseRayTest();
                // 是否对已经获得的拾取列表做进一步的gpu拾取
                let selector:IRaySelector = this.m_rspace.getRaySelector();
                if(selector != null)
                {
                    // 如果有gpu拾取则进入这个管理器, 这个管理器得到最终的拾取结果再和前面的计算结果做比较
                    let total:number = selector.getSelectedNodesTotal();
                    if(total > 1)
                    {
                        let i:number = 0;
                        let list:RaySelectedNode[] = selector.getSelectedNodes();
                        let node:RaySelectedNode = null;
                        for(; i < total; ++i)
                        {
                            node = list[i];
                            if(node.entity.isPolyhedral())
                            {
                                //this.m_renderer.drawEntityByLockMaterial(node.entity);
                            }
                        }
                    }
                }
                this.m_rayTestBoo = false;
            }
            flag = this.m_evt3DCtr.run(evtFlowPhase,status);
        }
        this.m_mouseTestBoo = false;
        return flag;
    }
    
    /**
     * update all data or status of the renderer runtime
     * should call this function per frame
     */
    update():void
    {
        if(this.m_autoRunning)
        {
            if(this.m_runFlag != 0) this.runBegin();
            this.m_runFlag = 1;
        }


        // camera visible test, ray cast test, Occlusion Culling test

        this.m_mouseTestBoo = true;
        this.m_cullingTestBoo = true;
        this.m_rayTestBoo = true;

        // wait mesh data ready to finish
        if(this.m_nodeWaitLinker != null)
        {
            let nextNode:Entity3DNode = this.m_nodeWaitLinker.getBegin();
            if(nextNode != null)
            {
                let pnode:Entity3DNode;
                let entity:IRenderEntity;
                let status:number;
                while(nextNode != null)
                {
                    if(nextNode.entity.hasMesh())
                    {
                        pnode = nextNode;
                        nextNode = nextNode.next;
                        entity = pnode.entity;
                        status = pnode.rstatus;
                        this.m_nodeWaitLinker.removeNode(pnode);
                        this.m_nodeWaitQueue.removeEntity(pnode.entity);
                        //console.log("RenderScene::update(), ready a mesh data that was finished.");
                        this.addEntity(entity,status);
                    }
                    else
                    {
                        nextNode = nextNode.next;
                    }
                }
            }
        }
        
        let i:number = 0;
        for(; i < this.m_childrenTotal; ++i)
        {
            this.m_children[i].update();
        }
        this.m_renderer.update();
        // space update
        if(this.m_rspace != null)
        {
            this.m_rspace.update();
            if(this.m_cullingTestBoo)
            {
                if(this.m_evt3DCtr != null || this.m_processUpdate || this.m_rspace.getRaySelector() != null)
                {
                    this.m_rspace.run();
                }
            }
        }
        if(this.m_processUpdate)
        {
            this.m_renderer.updateAllProcess();
        }
        if(this.m_mouseTestBoo && !this.m_evtFlowEnabled)
        {
            this.runMouseTest(1,0);
        }
    }
    // 运行渲染可见性裁剪测试，射线检测等空间管理机制
    cullingTest():void
    {
        if(this.m_rspace != null)
        {
            this.m_rspace.run();
        }
        this.m_cullingTestBoo = false;
    }
    // 鼠标位置的射线拾取测试
    mouseRayTest():void
    {
        if(this.m_rspace != null)
        {
            this.m_renderProxy.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
            this.m_rspace.rayTest(this.m_mouse_rlpv, this.m_mouse_rltv);
        }
    }
    
    /**
     * run all renderer processes in the renderer instance
     */
    run(autoCycle:boolean = false):void
    {
        if(this.m_autoRunning)
        {
            if(this.m_runFlag != 1) this.update();
            this.m_runFlag = 2;
        }

        if(this.m_subscListLen > 0)
        {
            for(let i:number = 0; i < this.m_processidsLen; ++i)
            {
                this.m_renderer.runAt(this.m_processids[i]);
            }
        }
        else
        {
            this.m_renderer.run();
        }
        if(autoCycle)
        {
            this.runEnd();
        }
    }
    /**
     * run the specific renderer process by its index in the renderer instance
     * @param index the renderer process index in the renderer instance
     */
    runAt(index:number):void
    {
        this.m_renderer.runAt(this.m_processids[index]);
    }
    runEnd():void
    {
        if(this.m_evt3DCtr != null)
        {
            this.m_evt3DCtr.runEnd();
        }
        this.m_rcontext.runEnd();
        
        if(this.m_rspace != null)
        {
            this.m_rspace.runEnd();
        }
        if(this.m_autoRunning)
        {
            this.m_runFlag = -1;
        }
    }
    updateCamera():void
    {
        if(this.m_renderProxy != null)
        {
            this.m_renderProxy.updateCamera();
        }
    }
    toString():string
    {
        return "[RendererScene(uid = "+this.m_uid+")]";
    }
}