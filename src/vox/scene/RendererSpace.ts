/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 当前渲染场景空间管理的入口类, 鼠标拾取，摄像机裁剪，空间管理遮挡剔除等都是由这个系统来组织完成的
/*
This relative module was not found:
* ../../vox/scene/SpaceCullingMasK in ./src/vox/scene/RendererSpace.ts
*/
import * as RSEntityFlagT from '../../vox/scene/RSEntityFlag';
import * as Vector3DT from "../../vox/math/Vector3D";
import * as AABBT from "../../vox/geom/AABB";
import * as IRenderStage3DT from "../../vox/render/IRenderStage3D";
import * as CameraBaseT from "../../vox/view/CameraBase";
//import * as SpaceCullingMasKT from "../../vox/space/SpaceCullingMasK";
import * as IRenderEntityT from "../../vox/render/IRenderEntity";
import * as IRendererSpaceT from "../../vox/scene/IRendererSpace";
import * as RPONodeT from "../../vox/render/RPONode";
import * as RPONodeBuilderT from "../../vox/render/RPONodeBuilder";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as EntityNodeQueueT from "../../vox/scene/EntityNodeQueue";
import * as Entity3DNodeLinkerT from "../../vox/scene/Entity3DNodeLinker";
import * as IRendererT from "../../vox/scene/IRenderer";
import * as IRaySelectorT from "../../vox/scene/IRaySelector";
import * as ISpaceCullingorT from "../../vox/scene/ISpaceCullingor";

import RSEntityFlag = RSEntityFlagT.vox.scene.RSEntityFlag;
import Vector3D = Vector3DT.vox.math.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import IRenderStage3D = IRenderStage3DT.vox.render.IRenderStage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;
//import SpaceCullingMasK = SpaceCullingMasKT.vox.space.SpaceCullingMasK;
import IRenderEntity = IRenderEntityT.vox.render.IRenderEntity;
import IRendererSpace = IRendererSpaceT.vox.scene.IRendererSpace;
import RPONode = RPONodeT.vox.render.RPONode;
import RPONodeBuilder = RPONodeBuilderT.vox.render.RPONodeBuilder;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import EntityNodeQueue = EntityNodeQueueT.vox.scene.EntityNodeQueue;
import Entity3DNodeLinker = Entity3DNodeLinkerT.vox.scene.Entity3DNodeLinker;
import IRenderer = IRendererT.vox.scene.IRenderer;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;
import ISpaceCullingor = ISpaceCullingorT.vox.scene.ISpaceCullingor;

export namespace vox
{
    export namespace scene
    {
        class SpaceCullingMasK
        {
            static NONE:number = 0;
            // 需要做摄像机的可见剔除
            static CAMERA:number = 1;
            // project occlusion volume
            static POV:number = 2;
            // 包含在遮挡体内部的不会进行遮挡剔除计算
            static INNER_POV_PASS:number = 4;
            // 摄像机和POV都要做遮挡剔除
            static CAMERA_AND_POV:number = 3;
        }
        export class RendererSpace implements IRendererSpace
        {
            private static s_uid:number = 0;
            private m_uid:number = -1;
            private m_renderer:IRenderer = null;
            private m_camera:CameraBase = null;
            private m_stage3d:IRenderStage3D = null;
            private m_emptyRPONode:RPONode = new RPONode();

            private m_rpoNodeBuilder:RPONodeBuilder = null;

            private m_nodeQueue:EntityNodeQueue = new EntityNodeQueue();
            private m_nodeWLinker:Entity3DNodeLinker = new Entity3DNodeLinker();
            private m_nodeSLinker:Entity3DNodeLinker = new Entity3DNodeLinker();
            private m_cullingor:ISpaceCullingor = null;
            private m_raySelector:IRaySelector = null;
            private m_entitysTotal:number = 0;
            constructor()
            {
                this.m_uid = RendererSpace.s_uid++;
                this.m_nodeQueue.initialize(1);
            }
            getUid():number
            {
                return this.m_uid;
            }
            initialize(renderer:IRenderer,camera:CameraBase = null):void
            {
                if(this.m_renderer == null)
                {
                    this.m_renderer = renderer;
                    this.m_stage3d = renderer.getStage3D();
                    this.m_camera = camera;
                    this.m_rpoNodeBuilder = renderer.getRPONodeBuilder();
                }
            }
            
            getStage3D():IRenderStage3D
            {
                return this.m_stage3d;
            }
            getCamera():CameraBase
            {
                return this.m_camera;
            }
            getMouseXYWorldRay(rl_position:Vector3D, rl_tv:Vector3D):void
            {
                this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3d.mouseX,this.m_stage3d.mouseY,rl_position,rl_tv);
            }
            setSpaceCullingor(cullingor:ISpaceCullingor):void
            {
                this.m_cullingor = cullingor;
            }
            setRaySelector(raySelector:IRaySelector):void
            {
                this.m_raySelector = raySelector;
                this.m_raySelector.setRenderer(this.m_renderer);
            }
            getRaySelector():IRaySelector
            {
                return this.m_raySelector;
            }
            // 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
            addEntity(entity:IRenderEntity):void
            {
                if(entity.getGlobalBounds() != null && entity.spaceCullMask > SpaceCullingMasK.NONE)
                {
                    if(RSEntityFlag.TestSpaceEnabled( entity.__$rseFlag ))
                    {
                        entity.update();
                        ++this.m_entitysTotal;

                        let node:Entity3DNode = this.m_nodeQueue.addEntity(entity);
                        node.bounds = entity.getGlobalBounds();
                        node.pcoEnabled = (entity.spaceCullMask & SpaceCullingMasK.POV) == SpaceCullingMasK.POV;

                        let boo:Boolean = entity.isRenderEnabled() || entity.getMaterial() == null;
                        if(boo && ((entity.spaceCullMask & SpaceCullingMasK.POV) == SpaceCullingMasK.POV))
                        {
                            node.rstatus = 1;
                            if(entity.getMaterial() == null)
                            {
                                node.rpoNode = this.m_emptyRPONode;
                            }
                            if(node.rpoNode == null)
                            {
                                node.rpoNode = this.m_rpoNodeBuilder.getNodeByUid(entity.getDisplay().__$rpuid) as RPONode;
                            }
                            this.m_nodeSLinker.addNode(node);
                        }
                        else
                        {
                            if(entity.getMaterial() == null)
                            {
                                node.rstatus = 1;
                                node.rpoNode = this.m_emptyRPONode;
                                this.m_nodeSLinker.addNode(node);
                            }
                            else
                            {
                                node.rstatus = 0;
                                this.m_nodeWLinker.addNode(node);
                            }
                        }
                    }
                }
            }
            removeEntity(entity:IRenderEntity):void
            {
                if(RSEntityFlag.TestSpaceContains( entity.__$rseFlag ))
                {
                    let node:Entity3DNode = this.m_nodeQueue.getNodeByEntity(entity);
                    if(node != null)
                    {
                        if(node.rstatus > 0)
                        {
                            this.m_nodeSLinker.removeNode(node);
                        }
                        else
                        {
                            this.m_nodeWLinker.removeNode(node);
                        }
                        this.m_nodeQueue.removeEntity(entity);
                        --this.m_entitysTotal;
                    }
                }
            }
            updateEntity(entity:IRenderEntity):void
            {
                //  if(RSEntityFlag.TestSpaceContains( entity.__$rseFlag ))
                //  {
                //      let node:Entity3DNode = this.m_nodeQueue.getNodeByEntity(entity);
                //      //  if(node != null)
                //      //  {
                //      //      node.distanceFlag = RSEntityFlag.TestSortEnabled(entity.__$rseFlag);
                //      //  }
                //  }
            }
            update():void
            {
            }
            runBegin():void
            {
            }
            run():void
            {
                let nextNode:Entity3DNode = this.m_nodeWLinker.getBegin();
                if(nextNode != null)
                {
                    let pnode:Entity3DNode = null;
                    while(nextNode != null)
                    {
                        if(nextNode.entity.isRenderEnabled())
                        {
                            pnode = nextNode;
                            pnode.rstatus = 1;
                            nextNode = nextNode.next;
                            this.m_nodeWLinker.removeNode( pnode );
                            this.m_nodeSLinker.addNode( pnode );
                            if(pnode.rpoNode == null)
                            {
                                pnode.rpoNode = this.m_rpoNodeBuilder.getNodeByUid(pnode.entity.getDisplay().__$rpuid) as RPONode;
                            }
                        }
                        else
                        {
                            nextNode = nextNode.next;
                        }
                    }
                }
                nextNode = this.m_nodeSLinker.getBegin();
                if(nextNode != null)
                {
                    if(this.m_cullingor != null)
                    {
                        this.m_cullingor.setCamera(this.m_camera);
                        this.m_cullingor.setCullingNodeHead(nextNode);
                        this.m_cullingor.run();
                    }
                    else
                    {
                        let ab:AABB = null;
                        let cam:CameraBase = this.m_camera;
                        let camPos:Vector3D = cam.getPosition();
                        while(nextNode != null)
                        {
                            if(nextNode.rpoNode.isVsible())
                            {
                                ab = nextNode.bounds;
                                nextNode.drawEnabled = cam.visiTestSphere2(ab.center, ab.radius);
                                nextNode.entity.drawEnabled = nextNode.drawEnabled;
                                nextNode.rpoNode.drawEnabled = nextNode.drawEnabled;
                                //  if(nextNode.drawEnabled && nextNode.distanceFlag)
                                //  {
                                //      nextNode.rpoNode.setValue(-Vector3D.DistanceSquared(camPos,ab.center));
                                //      //console.log((nextNode.entity as any).name,",a runit.value: ",nextNode.rpoNode.unit.value);
                                //  }
                            }
                            else
                            {
                                nextNode.drawEnabled = false;
                                nextNode.entity.drawEnabled = false;
                                nextNode.rpoNode.drawEnabled = false;
                            }
                            nextNode = nextNode.next;
                        }
                    }
                }
            }
            rayTest(rlpv:Vector3D,rltv:Vector3D):void
            {
                if(this.m_raySelector != null)
                {
                    this.m_raySelector.setCamera(this.m_camera);
                    this.m_raySelector.setCullingNodeHead(this.m_nodeSLinker.getBegin());
                    this.m_raySelector.setRay(rlpv,rltv);
                    this.m_raySelector.run();
                }
            }
            runEnd():void
            {
            }
            getCullingNodeHead():Entity3DNode
            {
                return this.m_nodeSLinker.getBegin();
            }
            toString():string
            {
                return "[RendererSpace(uid = "+this.m_uid+")]";
            }
        }
    }
}