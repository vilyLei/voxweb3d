/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 射线检测拾取代理对象

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as Matrix4T from "../../vox/math/Matrix4";
import * as AABBT from "../../vox/geom/AABB";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as IRenderEntityT from "../../vox/render/IRenderEntity";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as IRaySelectorT from '../../vox/scene/IRaySelector';
import * as RaySelectedNodeT from '../../vox/scene/RaySelectedNode';
import * as IRendererT from "../../vox/scene/IRenderer";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import Matrix4 = Matrix4T.vox.math.Matrix4;
import AABB = AABBT.vox.geom.AABB;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import IRenderEntity = IRenderEntityT.vox.render.IRenderEntity;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;
import RaySelectedNode = RaySelectedNodeT.vox.scene.RaySelectedNode;
import IRenderer = IRendererT.vox.scene.IRenderer;

export namespace vox
{
    export namespace scene
    {
        export class RaySelector implements IRaySelector
        {
            private m_renderer:IRenderer = null;
            private m_camera:CameraBase = null;
            private m_headNode:Entity3DNode = null;
            private m_rsn:RaySelectedNode = null;
            // 最多检测256个对象
            private m_hitList:Uint8Array = new Uint8Array(256);
            private m_rsnList:RaySelectedNode[] = null;
            private m_selectedNode:RaySelectedNode = null;
            private m_selectedTotal:number = 0;
            private m_testMode:number = 0;
            private m_invpv:Vector3D = new Vector3D();
            private m_invtv:Vector3D = new Vector3D();
            private m_rlpv:Vector3D = null;
            private m_rltv:Vector3D = null;
            private m_rlsiv:Uint8Array = new Uint8Array(4);
            private m_rlinvtv:Vector3D = new Vector3D();
            private m_outv:Vector3D = new Vector3D();
            private m_vecs:Vector3D[] = [null,null];
            private m_gpuTestEnabled:boolean = false;

            //  setGPUTestEnabled(enabled:boolean):void
            //  {
            //      this.m_gpuTestEnabled = enabled;
            //  }
            
            setRenderer(renderer:IRenderer):void
            {
                this.m_renderer = renderer;
            }
            setRayTestMode(testMode:number):void
            {
                this.m_testMode = testMode;
            }
            setRay(rlpv:Vector3D,rltv:Vector3D):void
            {
                this.m_rlpv = rlpv;
                this.m_rltv = rltv;
            }
            getRay(out_rlpv:Vector3D,out_rltv:Vector3D):void
            {
                out_rlpv.copyFrom(  this.m_rlpv );
                out_rltv.copyFrom(  this.m_rltv );
            }
            setCamera(cam:CameraBase):void
            {
                this.m_camera = cam;
            }
            setCullingNodeHead(headNode:Entity3DNode):void
            {
                this.m_headNode = headNode;
                if(this.m_rsnList == null)
                {
                    this.m_rsnList = [];
                    let i:number = 0;
                    for(; i < 256; ++i)
                    {
                        this.m_rsnList.push( new RaySelectedNode() );
                    }
                }
            }
            //  setSelectedNode(node:RaySelectedNode):void
            //  {
            //      this.m_selectedNode = node;
            //  }
            getSelectedNode():RaySelectedNode
            {
                return this.m_selectedNode;
            }
            //  setSelectedNodes(nodes:RaySelectedNode[], total:number):void
            //  {
            //      //this.m_rsnList = nodes;
            //  }
            getSelectedNodes():RaySelectedNode[]
            {
                return this.m_rsnList;
            }
            getSelectedNodesTotal():number
            {
                return this.m_selectedTotal;
            }
            private sorting(low:number,high:number):number
            {
                let arr:RaySelectedNode[] = this.m_rsnList;
                //标记位置为待排序数组段的low处也就时枢轴值
                this.m_rsn = arr[low];                
                while(low < high)
                {
                    //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
                    while(low < high && arr[high].dis >= this.m_rsn.dis)
                    {
                        --high;
                    }
                    // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧
                    arr[low] = arr[high];                    
                    while(low < high && arr[low].dis <= this.m_rsn.dis)
                    {
                        ++low;
                    }
                    arr[high] = arr[low];
                }
                arr[low] = this.m_rsn;                
                return low;
            }
            private snsort(low:number,high:number):void
            {
                if(low < high)
                {
                    let pos:number = this.sorting(low, high);
                    this.snsort(low, pos - 1);
                    this.snsort(pos + 1, high);
                }
            }
            run():void
            {
                let nextNode:Entity3DNode = this.m_headNode;
                //console.log("RaySelect run() nextNode != null: "+(nextNode != null));
                if(nextNode != null)
                {
                    let dis:number = 0.0;
                    let rtv:Vector3D = this.m_rltv;
                    let rpv:Vector3D = this.m_rlpv;
                    let outv:Vector3D = this.m_outv;
                    let node:RaySelectedNode = null;
                    let total:number = 0;
                    if(Math.abs(rtv.x) > MathConst.MATH_MIN_POSITIVE)
                    {
                        this.m_rlinvtv.x = 1.0 / rtv.x;
                    }
                    else
                    {
                        this.m_rlinvtv.x = MathConst.MATH_MAX_POSITIVE;
                    }
                    if(Math.abs(rtv.y) > MathConst.MATH_MIN_POSITIVE)
                    {
                        this.m_rlinvtv.y = 1.0 / rtv.y;
                    }
                    else
                    {
                        this.m_rlinvtv.y = MathConst.MATH_MAX_POSITIVE;
                    }
                    if(Math.abs(rtv.z) > MathConst.MATH_MIN_POSITIVE)
                    {
                        this.m_rlinvtv.z = 1.0 / rtv.z;
                    }
                    else
                    {
                        this.m_rlinvtv.z = MathConst.MATH_MAX_POSITIVE;
                    }
                    if(this.m_rlinvtv.x < 0) this.m_rlsiv[0] = 1;
                    else this.m_rlsiv[0] = 0;
                    if(this.m_rlinvtv.y < 0) this.m_rlsiv[1] = 1;
                    else this.m_rlsiv[1] = 0;
                    if(this.m_rlinvtv.z < 0) this.m_rlsiv[2] = 1;
                    else this.m_rlsiv[2] = 0;
                    
                    while(nextNode != null)
                    {
                        if(nextNode.drawEnabled && nextNode.entity.mouseEnabled)
                        {
                            //if(AABB.IntersectionRL2(rtv,rpv, nextNode.bounds, outv))

                            outv.x = nextNode.bounds.center.x - rpv.x;
				            outv.y = nextNode.bounds.center.y - rpv.y;
				            outv.z = nextNode.bounds.center.z - rpv.z;
				            dis = outv.dot(rtv);
				            outv.x -= dis * rtv.x;
				            outv.y -= dis * rtv.y;
				            outv.z -= dis * rtv.z;

                            if (outv.getLengthSquared() <= nextNode.bounds.radius2)
                            {
                                // 如果只是几何检测(例如球体包围体的检测)就不需要在进入后续的aabb检测
                                if(nextNode.rayTestState < 1)
                                {
                                    this.m_vecs[0] = nextNode.bounds.min;
                                    this.m_vecs[1] = nextNode.bounds.max;
                                    if(AABB.IntersectionRL3(this.m_vecs,this.m_rlsiv,this.m_rlinvtv,rtv,rpv, outv))
                                    {
                                        node = this.m_rsnList[total];
                                        node.entity = nextNode.entity;
                                        node.dis = this.m_rlinvtv.w;
                                        node.wpv.copyFrom(outv);
                                        //  console.log("H Hit Dis: "+rtv.dot(outv));
                                        //console.log("Ray hit test a renderNode.");
                                        ++total;
                                    }
                                }
                                //  else
                                //  {
                                //      //其他检测方式
                                //  }
                            }
                        }
                        nextNode = nextNode.next;
                    }
                    this.m_selectedNode = null;
                    let i:number = 0;
                    if(total > 0)
                    {
                        let invpv:Vector3D = this.m_invpv;
                        let invtv:Vector3D = this.m_invtv;
                        let entity:IRenderEntity = null;
                        let flag:number = 0;
                        let hitTotal:number = 0;
                        let mat4:Matrix4 = null;
                        let rayNode:RaySelectedNode = null;
                        let pvdis:number = rtv.dot(rpv);
                        let preDis:number = 0.0;
                        if(total > 1)
                        {
                            this.snsort(0, total - 1);

                            let polyTest:boolean = !this.m_gpuTestEnabled;
                            for(i = 0; i < total; ++i)
                            {
                                rayNode = this.m_rsnList[i];
                                entity = this.m_rsnList[i].entity;
                                if(entity.isPolyhedral())
                                {
                                    if(polyTest)
                                    {
                                        mat4 = entity.getInvMatrix();
                                        mat4.transformOutVector3(rpv,invpv);
                                        mat4.deltaTransformOutVector(rtv,invtv);
                                        flag = entity.testRay(invpv,invtv,outv,true);
                                    }
                                    else
                                    {
                                        flag = 0;
                                    }
                                }
                                else
                                {
                                    mat4 = entity.getInvMatrix();
                                    mat4.transformOutVector3(rpv,invpv);
                                    mat4.deltaTransformOutVector(rtv,invtv);
                                    flag = entity.testRay(invpv,invtv,outv,true);
                                }
                                if(flag > 0)
                                {
                                    rayNode.lpv.copyFrom(outv);
                                    entity.getMatrix().transformOutVector3(outv,rayNode.wpv);
                                    rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
                                    this.m_hitList[hitTotal] = i;
                                    ++hitTotal;
                                    //console.log("YYYYYYYYYYYYYYYes multi Ray hit mesh success.");
                                    if(rayNode.dis > preDis)
                                    {
                                        this.m_selectedNode = rayNode;
                                        break;
                                    }
                                }
                                else if(flag < 0)
                                {
                                    //console.log("NNNNNNNNNNNNNNNNo multi Ray hit mesh 没有做进一步的检测.");
                                    this.m_hitList[hitTotal] = i;
                                    ++hitTotal;
                                    if(rayNode.dis > preDis)
                                    {
                                        this.m_selectedNode = rayNode;
                                        break;
                                    }
                                }
                                preDis = rayNode.dis;
                            }
                            if(this.m_selectedNode == null && hitTotal > 0)
                            {
                                this.m_selectedNode = this.m_rsnList[this.m_hitList[0]];
                            }
                        }
                        else
                        {
                            rayNode = this.m_rsnList[0];
                            entity = this.m_rsnList[0].entity;
                            mat4 = entity.getInvMatrix();
                            mat4.transformOutVector3(rpv,invpv);
                            mat4.deltaTransformOutVector(rtv,invtv);
                            flag = entity.testRay(invpv,invtv,outv,true);
                            //console.log("hit flag: "+flag);
                            if(flag > 0)
                            {
                                rayNode.lpv.copyFrom(outv);
                                entity.getMatrix().transformOutVector3(outv,rayNode.wpv);
                                rayNode.dis = rtv.dot(rayNode.wpv) - pvdis;
                                this.m_selectedNode = rayNode;
                                //console.log("YYYYYYYYYYYYYYYes Ray hit mesh success.");
                            }
                            else if(flag < 0)
                            {
                                //console.log("NNNNNNNNNNNNNNNo Ray hit mesh 没有做进一步的检测.");
                                this.m_selectedNode = rayNode;
                            }
                        }
                        //console.log("YYYYYYYYYYYYYYYes Ray hit success.");
                    }
                    i = total;
                    for(; i < this.m_selectedTotal; ++i)
                    {
                        //console.log("清理多余的 entity i: "+i);
                        if(this.m_selectedNode != this.m_rsnList[i])
                        {
                            this.m_rsnList[i].entity = null;
                        }
                    }
                    this.m_selectedTotal = total;
                    //  else
                    //  {
                    //      console.log("NNNNNNNNNNNNNNNo Ray hit failure.");
                    //  }
                }
            }            
        }
    }
}