/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象


import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as ITextureRenderObjT from "../../vox/texture/ITextureRenderObj";
import * as RPOUnitT from "../../vox/render/RPOUnit";
import * as IPoolNodeT from "../../vox/utils/IPoolNode";


import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import ITextureRenderObj = ITextureRenderObjT.vox.texture.ITextureRenderObj;
import RPOUnit = RPOUnitT.vox.render.RPOUnit;
import IPoolNode = IPoolNodeT.vox.utils.IPoolNode;

export namespace vox
{
    export namespace render
    {
        // 为了渲染循环执行中持有RPOUnit和对应的Disp
        export class RPONode implements IPoolNode
        {
            constructor()
            {
            }
            __$ruid:number = -1;
            drawEnabled:boolean = true;
            uid:number = -1;
            index:number = -1;
            // only for show info
            drawMode:number = 0;
            ivsIndex:number = 0;
            ivsCount:number = 0;
            insCount:number = 0;

            shdUid:number = -1;
            vtxUid:number = -1;
            texMid:number = -1;
            rtokey:number = -1;
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

                p.drawOffset = p.ivsIndex * p.ibufStep;
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
                this.rtokey = -1;
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
    }
}