/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被执行对象

import * as RenderConstT from "../../vox/render/RenderConst";
//import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";
import * as VertexRenderObjT from "../../vox/mesh/VertexRenderObj";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as MaterialProgramT from "../../vox/material/MaterialProgram";
import * as TextureRenderObjT from "../../vox/texture/TextureRenderObj";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ShaderUBOT from "../../vox/material/ShaderUBO";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";

import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
//import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;
import VertexRenderObj = VertexRenderObjT.vox.mesh.VertexRenderObj;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import MaterialProgram = MaterialProgramT.vox.material.MaterialProgram;
import ITextureRenderObj = TextureRenderObjT.vox.texture.ITextureRenderObj;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RenderColorMask = RODrawStateT.vox.render.RenderColorMask;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ShaderUBO = ShaderUBOT.vox.material.ShaderUBO;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;

export namespace vox
{
    export namespace render
    {
        export class RPOUnit
        {
            private static __s_uid:number = 0;
            static __$_S_flag:number = 0;
            private m_uid:number = -1;
            constructor()
            {
                if(RPOUnit.__$_S_flag < 1)
                {
                    throw new Error("Fatal Error: Illegal constructor() !!!");
                }
                this.m_uid = RPOUnit.__s_uid++;
            }
            // 记录对应的RODisplay的渲染所需的状态数据
            
            ibufType:number = 0;// UNSIGNED_SHORT or UNSIGNED_INT
            ibufStep:number = 2;// 2 or 4

            ivsIndex:number = 0;
            ivsCount:number = 0;
            insCount:number = 0;
            trisNumber:number = 0;
            visible:boolean = true;
            drawEnabled:boolean = true;
            drawMode:number = 0;
            renderState:number = 0;
            rcolorMask:number = 0;
            vro:VertexRenderObj = null;
            shdp:ShaderProgram = null;
            uniform:IShaderUniform = null;
            // 记录 material 对应的 shader program uid
            shdUid:number = -1;
            vtxUid:number = -1;
            // record tex group
            tro:ITextureRenderObj = null;
            texMid:number = -1;
            ubo:ShaderUBO = null;
            getUid():number
            {
                return this.m_uid;
            }
            setIvsParam(ivsIndex:number, ivsCount:number):void
            {
                this.ivsIndex = ivsIndex;
                this.ivsCount = ivsCount;
                this.drawEnabled = this.visible && this.ivsCount > 0;
            }
            setVisible(boo:boolean):void
            {
                this.visible = boo;
                this.drawEnabled = boo && this.ivsCount > 0;
            }
            drawThis(rc:RenderProxy):void
            {
                ++RendererState.DrawCallTimes;
                RendererState.DrawTrisNumber += this.trisNumber;
                switch(this.drawMode)
                {
                    case RenderDrawMode.ELEMENTS_TRIANGLES:
                        //console.log("RPOUnit::run(), TRIANGLES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, rc.UNSIGNED_SHORT,this.ivsIndex * 2);
                        rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        break;
                    case RenderDrawMode.ELEMENTS_TRIANGLE_STRIP:
                        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, rc.UNSIGNED_SHORT,this.ivsIndex * 2);
                        rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        break;
                    case RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES:
                        //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                        //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, rc.UNSIGNED_SHORT, this.ivsIndex * 2, this.insCount);
                        rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                        break;
                    case RenderDrawMode.ELEMENTS_TRIANGLE_FAN:
                        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, rc.UNSIGNED_SHORT,this.ivsIndex * 2);
                        rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        break;
                    case RenderDrawMode.ARRAYS_LINES:
                        //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        rc.RContext.drawArrays(rc.LINES, this.ivsIndex, this.ivsCount);
                        break;
                    case RenderDrawMode.ARRAYS_LINE_STRIP:
                        //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        rc.RContext.drawArrays(rc.LINE_STRIP, this.ivsIndex, this.ivsCount);
                        break;
                    default:
                        break;
                }
            }
            run2(rc:RenderProxy):void
            {
                if(this.ubo != null)
                {
                    this.ubo.run(rc);
                }
                this.uniform.use(rc);
                RenderStateObject.UseRenderState(this.renderState);
                RenderColorMask.UseRenderState(this.rcolorMask);                
            }
            run(rc:RenderProxy):void
            {
                //console.log("RPOUnit::run(), this.display: "+this.display+", this.drawMode: "+this.drawMode);
                if(this.ubo != null)
                {
                    this.ubo.run(rc);
                }
                this.vro.run(rc);
                this.tro.run(rc);
                this.uniform.use(rc);
                RenderStateObject.UseRenderState(this.renderState);
                RenderColorMask.UseRenderState(this.rcolorMask);

            }
            
            runLockMaterial2(rc:RenderProxy):void
            {
                RenderStateObject.UseRenderState(this.renderState);
                RenderColorMask.UseRenderState(this.rcolorMask);
                MaterialProgram.UpdateUniformToCurrentShd(rc,this.uniform);
            }
            runLockMaterial(rc:RenderProxy):void
            {
                this.vro.run(rc);
                RenderStateObject.UseRenderState(this.renderState);
                RenderColorMask.UseRenderState(this.rcolorMask);
                MaterialProgram.UpdateUniformToCurrentShd(rc,this.uniform);
            }
            reset():void
            {
                this.vro.__$detachThis();
                this.vro = null;
                this.tro.__$detachThis();
                this.tro = null;
                this.texMid = -1;

                this.ubo = null;
                this.shdUid = -1;
                this.vtxUid = -1;
                this.shdp = null;
                this.uniform = null;

                this.ivsIndex = 0;
                this.ivsCount = 0;
                this.insCount = 0;
                this.drawEnabled = true;
                this.drawMode = 0;
                this.renderState = 0;
                this.rcolorMask = 0;
            }
            destroy():void
            {
                this.reset();
            }
            toString():string
            {
                return "[RPOUnit(uid = "+this.m_uid+")]";
            }
        }
    }
}