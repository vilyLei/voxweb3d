/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RSEntityFlagT from '../../vox/scene/RSEntityFlag';
import * as RenderConstT from "../../vox/render/RenderConst";
import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as IRenderEntityT from "../../vox/render/IRenderEntity";
import * as RPOUnitBuilderT from "../../vox/render/RPOUnitBuilder";
import * as RODataBuilderT from "../../vox/render/RODataBuilder";

import * as RenderProcessT from "../../vox/render/RenderProcess";
import * as RenderProcessBuiderT from "../../vox/render/RenderProcessBuider";

import RSEntityFlag = RSEntityFlagT.vox.scene.RSEntityFlag;
import DisplayRenderSign = RenderConstT.vox.render.DisplayRenderSign;
import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import IRenderEntity = IRenderEntityT.vox.render.IRenderEntity;
import RODataBuilder = RODataBuilderT.vox.render.RODataBuilder;
import RCRPObj = RPOUnitBuilderT.vox.render.RCRPObj;
import RPOUnitBuilder = RPOUnitBuilderT.vox.render.RPOUnitBuilder;

import RenderProcess = RenderProcessT.vox.render.RenderProcess;
import RenderProcessBuider = RenderProcessBuiderT.vox.render.RenderProcessBuider;

export namespace vox
{
    export namespace scene
    {
        export class DispEntity3DManager
        {
            //private m_nodeLinker:Entity3DNodeLinker = new Entity3DNodeLinker();
            private m_rpoUnitBuilder:RPOUnitBuilder = null;
            private m_processBuider:RenderProcessBuider = null;
            private m_waitList:IRenderEntity[] = [];
            private m_processUidList:number[] = [];
            private m_wuid:number = -1;            
            private m_dispBuilder:RODataBuilder = null;
            private m_maxFlag:number = 0x7;//0xfffff;// 也就是最多只能展示1048575个entitys
            private m_existencetotal:number = 0;
            private m_rprocess:RenderProcess = null;
            entityManaListener:any = null;
            constructor(wuid:number, dispBuilder:RODataBuilder, rpoUnitBuilder:RPOUnitBuilder, processBuider:RenderProcessBuider)
            {
                this.m_wuid = wuid;
                this.m_dispBuilder = dispBuilder;
                this.m_rpoUnitBuilder = rpoUnitBuilder;
                this.m_processBuider = processBuider;
            }
            isEmpty():boolean
            {
                return this.m_existencetotal < 1;
            }
            isHaveEntity():boolean
            {
                return this.m_existencetotal > 0;
            }
            removeEntity(entity:IRenderEntity):void
            {
                this.m_existencetotal--;
                // 从所有相关process中移除这个display
                let display:IRODisplay = entity.getDisplay();
                if(display != null && display.__$ruid > -1)
                {
                    let puid:number = display.__$ruid;
                    let po:RCRPObj = this.m_rpoUnitBuilder.getRCRPObj(puid);
                    if(po.count > 0)
                    {
                        if(po.count < 2)
                        {
                            if(po.rprocessUid > -1)
                            {
                                this.m_rprocess = this.m_processBuider.getNodeByUid(po.rprocessUid) as RenderProcess;
                                this.m_rprocess.removeDisp(display);
                                po.rprocessUid = -1;
                            }
                        }
                        else
                        {
                            let len:number = RCRPObj.RenerProcessMaxTotal;
                            for(let i:number = 0; i < len; ++i)
                            {
                                if((po.idsFlag&(1<<i)) > 0)
                                {
                                    // the value of list[i] is the uid of a node;
                                    this.m_rprocess = this.m_processBuider.getNodeByUid(i) as RenderProcess;
                                    this.m_rprocess.removeDisp(display);
                                }
                            }
                        }
                    }
                    if(po.count == 0)
                    {
                        //console.log("DispEntity3DManager::removeEntity(), remove a entity from all processes.");
                        if(display.__$$rsign != DisplayRenderSign.LIVE_IN_WORLD)
                        {
                            // error!!!
                            console.error("DispEntity3DManager::removeEntity(), Error: display.__$$rsign != RODisplay.LIVE_IN_WORLD.");
                        }
                        display.__$$rsign = DisplayRenderSign.NOT_IN_WORLD;
                        // 准备移除和当前 display 对应的 RPOUnit
                        this.m_rpoUnitBuilder.restoreByUid(puid);
                    }
                    else
                    {
                        console.warn("Error: DispEntity3DManager::removeEntity(), remove a entity from all processes failed.");
                    }
                }
                entity.__$rseFlag = RSEntityFlag.RemoveRendererUid(entity.__$rseFlag);
                entity.__$rseFlag = RSEntityFlag.RemoveRendererLoad(entity.__$rseFlag);
                if(this.entityManaListener != null)
                {
                    this.entityManaListener.removeFromWorld(entity,this.m_wuid,-1);
                }
            }
            addEntity(entity:IRenderEntity, processUid:number,deferred:boolean = false):boolean
            {
                if(entity != null)
                {
                    //console.log("add entity into entity 3d manager.");
                    let disp:IRODisplay = entity.getDisplay();
                    if(disp != null)
                    {
                        if(disp.__$$rsign == DisplayRenderSign.LIVE_IN_WORLD)
                        {
                            if(!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid,processUid))
                            {
                                //console.log("DispEntity3DManager::addEntity(), A, this display("+disp.__$ruid+") has existed in processid("+processUid+").");
                                return;
                            }                
                        }
                        if(deferred)
                        {
                            if(disp.__$$rsign == DisplayRenderSign.NOT_IN_WORLD)
                            {
                                disp.__$$rsign = DisplayRenderSign.GO_TO_WORLD;
                            }
                            entity.__$rseFlag = RSEntityFlag.AddRendererLoad(entity.__$rseFlag);
                            entity.__$rseFlag = RSEntityFlag.AddRendererUid(entity.__$rseFlag, this.m_wuid);
                            this.m_waitList.push(entity);
                            this.m_processUidList.push(processUid);
                            //console.log("DispEntity3DManager::addEntity(), B, this display("+disp+") has existed in processid("+processUid+").");
                        }
                        else
                        {
                            // 检查数据完整性
                            if(this.testValidData(entity))
                            {
                                this.ensureAdd(entity, disp,processUid);
                            }
                            else
                            {
                                //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                                if(disp.__$$rsign == DisplayRenderSign.NOT_IN_WORLD)
                                {
                                    disp.__$$rsign = DisplayRenderSign.GO_TO_WORLD;
                                }
                                entity.__$rseFlag = RSEntityFlag.AddRendererLoad(entity.__$rseFlag);
                                this.m_waitList.push(entity);
                                this.m_processUidList.push(processUid);
                            }
                        }
                    }
                    else
                    {
                        entity.__$rseFlag = RSEntityFlag.AddRendererUid(entity.__$rseFlag, this.m_wuid);
                    }
                }
                return false;
            }
            testValidData(entity:IRenderEntity):boolean
            {
                if(entity.getMaterial() != null && entity.hasMesh())
                {
                    if(entity.getMaterial().hasShaderData())
                    {
                        return true;
                    }
                    else if(entity.getMaterial().getCodeBuf() != null)
                    {
                        entity.activeDisplay();
                    }
                }
                return false;
            }
            ensureAdd(entity:IRenderEntity, disp:IRODisplay, processUid:number):void
            {
                entity.update();
                //entity.__$wuid = this.m_wuid;
                entity.__$rseFlag = RSEntityFlag.AddRendererUid(entity.__$rseFlag, this.m_wuid);
                //  let node:Entity3DNode = Entity3DNode.Create();
                //  node.entity = entity;
                //  entity.__$weid = node.uid;
                //  this.m_nodeLinker.addNode(node);

                //entity.__$weid = 2;
                entity.__$rseFlag = RSEntityFlag.RemoveRendererLoad(entity.__$rseFlag);

                this.m_existencetotal++;

                if(disp.__$$rsign == DisplayRenderSign.NOT_IN_WORLD)
                {
                    disp.__$$rsign = DisplayRenderSign.GO_TO_WORLD;
                }
                this.m_rprocess = this.m_processBuider.getNodeByUid(processUid) as RenderProcess;
                //console.log("DispEntity3DManager::addEntity(), add a ready ok entity to process.");
                //this.m_rprocess.addDisp(rc, disp,false);
                if(disp.__$ruid > -1)
                {
                    this.m_rprocess.addDisp(disp);
                }
                else
                {
                    if(this.m_dispBuilder.buildGpuDisp(disp))
                    {
                        this.m_rprocess.addDisp(disp);
                    }
                }
                
                if(this.entityManaListener != null)
                {
                    this.entityManaListener.addToWorld(entity,this.m_wuid,processUid);
                }
            }
            private updateWaitList():void
            {
                let len:number = this.m_waitList.length;
                let entity:IRenderEntity = null;
                //let node:Entity3DNode = null;
                let disp:IRODisplay = null;
                for(let i:number = 0; i < len; ++i)
                {
                    entity = this.m_waitList[i];
                    //if(entity.__$weid == this.m_maxFlag)
                    if((RSEntityFlag.RENDERER_LOAD_FLAT & entity.__$rseFlag) == RSEntityFlag.RENDERER_LOAD_FLAT)
                    {
                        if(this.testValidData(entity))
                        {
                            disp = entity.getDisplay();
                            if(disp.__$$rsign == DisplayRenderSign.LIVE_IN_WORLD)
                            {
                                if(!this.m_rpoUnitBuilder.testRPNodeNotExists(disp.__$ruid,this.m_processUidList[i]))
                                {
                                    //console.log("DispEntity3DManager::update(), this display("+disp.__$ruid+") has existed in processid("+m_processUidList[i]+").");
                                    this.m_waitList.splice(i,1);
                                    this.m_processUidList.splice(i,1);
                                    --len;
                                    --i;
                                    continue;
                                }
                            }
                            this.ensureAdd(entity, disp, this.m_processUidList[i]);
                            this.m_waitList.splice(i,1);
                            this.m_processUidList.splice(i,1);
                            --len;
                            --i;
                        }
                    }
                    else
                    {
                        disp = entity.getDisplay();
                        if(disp != null && disp.__$$rsign == DisplayRenderSign.GO_TO_WORLD)
                        {
                            disp.__$$rsign = DisplayRenderSign.NOT_IN_WORLD;
                        }
                        //console.log("DispEntity3DManager::update(), remove a ready entity.");
                        entity.__$rseFlag = RSEntityFlag.RemoveRendererLoad(entity.__$rseFlag);
                        entity.__$rseFlag = RSEntityFlag.RemoveRendererUid(entity.__$rseFlag);
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
            }
            
            update():void
            {
                if(this.m_waitList.length > 0)
                {
                    this.updateWaitList();
                }
                this.m_dispBuilder.update();
            }
        }
    }
}