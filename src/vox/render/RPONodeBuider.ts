/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象

import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as TextureRenderObjT from "../../vox/texture/TextureRenderObj";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as RPOUnitBuiderT from "../../vox/render/RPOUnitBuider";

import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import ITextureRenderObj = TextureRenderObjT.vox.texture.ITextureRenderObj;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import RPOUnitBuider = RPOUnitBuiderT.vox.render.RPOUnitBuider;

export namespace vox
{
    export namespace render
    {
        // 为了渲染循环执行中持有RPOUnit和对应的Disp
        export class RPONode
        {
            constructor()
            {
            }
            __$ruid:number = -1;
            drawEnabled:boolean = true;
            uid:number = -1;
            index:number = -1;
            drawMode:number = 0;
            shdUid:number = -1;
            ivsIndex:number = 0;
            ivsCount:number = 0;
            insCount:number = 0;
            vtxUid:number = -1;
            texMid:number = -1;
            prev:RPONode = null;
            next:RPONode = null;
            unit:RPOUnit = null;
            vro:VertexRenderObj = null;
            tro:ITextureRenderObj = null;

            
            rvroI:number = -1;
            rtroI:number = -1;
        
            updateData():void
            {
                let p:RPOUnit = this.unit;
                this.drawMode = p.drawMode;
                this.ivsIndex = p.ivsIndex;
                this.ivsCount = p.ivsCount;
                this.insCount = p.insCount;
                this.vtxUid = p.vtxUid;
                this.vro = p.vro;
                // material info etc.
                this.shdUid = p.shdUid;
                this.texMid = p.texMid;
                this.tro = p.tro;
            }
            reset():void
            {
                this.drawEnabled = true;
                this.uid = -1;
                this.index = -1;
                this.drawMode = 0;
                this.ivsIndex = 0;
                this.ivsCount = 0;
                this.insCount = 0;
                this.shdUid = -1;
                this.vtxUid = -1;
                this.texMid = -1;
                this.unit = null;
                this.vro = null;
                this.tro = null;
                this.prev = null;
                this.next = null;
            }
            toString():string
            {
                return "[Object RPONode(uid = "+this.uid+", index = "+this.index+", shdUid = "+this.shdUid+", vtxUid = "+this.vtxUid+")]";
            }
        }
        export class RPONodeBuider
        {

            private static __S_FLAG_BUSY = 1;
            private static __S_FLAG_FREE = 0;
        
            private static m_nodeListLen:number = 0;
            private static m_nodeList:RPONode[] = [];
            private static m_nodeFlagList:number[] = [];
            private static m_nodeIndexPptFlagList:number[] = [];
            private static m_freeIdList:number[] = [];
        
            static GetFreeId()
            {
                if(RPONodeBuider.m_freeIdList.length > 0)
                {
                    return RPONodeBuider.m_freeIdList.pop();
                }
                return -1; 
            }

            static GetNodeByUid(uid:number):RPONode
            {
                return RPONodeBuider.m_nodeList[uid];
            }
            static Create():RPONode
            {
                let node:RPONode = null;
                let index:number = RPONodeBuider.GetFreeId();
                if(index >= 0)
                {
                    node = RPONodeBuider.m_nodeList[index];
                    node.uid = index;
                    RPONodeBuider.m_nodeFlagList[index] = RPONodeBuider.__S_FLAG_BUSY;
                }
                else
                {
                    // create a new nodeIndex
                    node = new RPONode();
                    RPONodeBuider.m_nodeList.push( node );
                    RPONodeBuider.m_nodeIndexPptFlagList.push(0);
                    RPONodeBuider.m_nodeFlagList.push(RPONodeBuider.__S_FLAG_BUSY);
                    node.uid = RPONodeBuider.m_nodeListLen;
                    RPONodeBuider.m_nodeListLen++;
                }
                return node;
            }
            static Restore(pnode:RPONode):void
            {
                if(pnode != null && pnode.uid >= 0 && RPONodeBuider.m_nodeFlagList[pnode.uid] == RPONodeBuider.__S_FLAG_BUSY)
                {
                    RPONodeBuider.m_freeIdList.push(pnode.uid);
                    RPONodeBuider.m_nodeFlagList[pnode.uid] = RPONodeBuider.__S_FLAG_FREE;
                    RPOUnitBuider.Restore(pnode.unit);
                    pnode.reset();
                }
            }
        }
    }
}