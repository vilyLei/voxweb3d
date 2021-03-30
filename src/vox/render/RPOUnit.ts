/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";
import * as AABBT from "../../vox/geom/AABB";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as IVertexRenderObjT from "../../vox/render/IVertexRenderObj";

import * as RenderShaderT from "../../vox/render/RenderShader";
import * as ITextureRenderObjT from "../../vox/render/ITextureRenderObj";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ShaderUBOT from "../../vox/material/ShaderUBO";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as IRPODisplayT from "../../vox/render/IRPODisplay";
import * as IPoolNodeT from "../../vox/base/IPoolNode";

import Vector3D = Vector3DT.vox.math.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
import IVertexRenderObj = IVertexRenderObjT.vox.render.IVertexRenderObj;

import RenderShader = RenderShaderT.vox.render.RenderShader;
import ITextureRenderObj = ITextureRenderObjT.vox.render.ITextureRenderObj;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RenderColorMask = RODrawStateT.vox.render.RenderColorMask;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ShaderUBO = ShaderUBOT.vox.material.ShaderUBO;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import IRPODisplay = IRPODisplayT.vox.render.IRPODisplay;
import IPoolNode = IPoolNodeT.vox.base.IPoolNode;

export namespace vox
{
    export namespace render
    {
        /**
         * 渲染器渲染运行时核心关键执行显示单元,一个unit代表着一个draw call所渲染的所有数据
         * renderer rendering runtime core executable display unit.
         */
        export class RPOUnit implements IPoolNode,IRPODisplay
        {
            uid:number = -1;
            value:number = -1;
            // 记录自身和RPONode的对应关系
            __$rpuid:number = -1;
            // renderProcess uid
            __$rprouid:number = -1;

            shader:RenderShader = null;
            pos:Vector3D = new Vector3D();
            bounds:AABB = null;
            constructor()
            {
            }

            // 记录对应的RODisplay的渲染所需的状态数据
            ibufType:number = 0;                // UNSIGNED_SHORT or UNSIGNED_INT
            ibufStep:number = 2;                // 2 or 4

            ivsIndex:number = 0;
            ivsCount:number = 0;
            insCount:number = 0;
            drawOffset:number = 0;
            
            partTotal:number = 0;               // partTotal = partGroup.length
            partGroup:Uint16Array = null;

            trisNumber:number = 0;
            visible:boolean = true;
            drawEnabled:boolean = true;
            drawMode:number = 0;
            
            renderState:number = 0;
            rcolorMask:number = 0;
            // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
            drawFlag:number = 0;
            vro:IVertexRenderObj = null;
            
            // transform uniform
            transUniform:IShaderUniform = null;
            // materiall uniform
            uniform:IShaderUniform = null;
            // 记录 material 对应的 shader program uid
            shdUid:number = -1;
            vtxUid:number = -1;
            // record tex group
            tro:ITextureRenderObj = null;
            texMid:number = -1;
            ubo:ShaderUBO = null;
            private testDrawFlag():void
            {
                if(this.shader.drawFlag != this.drawFlag)
                {
                    this.shader.drawFlag = this.drawFlag;
                    RenderStateObject.UseRenderState(this.renderState);
                    RenderColorMask.UseRenderState(this.rcolorMask);
                }
            }
            getUid():number
            {
                return this.uid;
            }
            getRPOUid():number
            {
                return this.__$rpuid;
            }
            getRPROUid():number
            {
                return this.__$rprouid;
            }
            getShaderUid():number
            {
                return this.shdUid;
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
            setDrawFlag(renderState:number,rcolorMask:number):void
            {
                this.renderState = renderState;
                this.rcolorMask = rcolorMask;
                this.drawFlag = (rcolorMask<<10) + renderState;
            }
            drawThis(rc:RenderProxy):void
            {
                ++RendererState.DrawCallTimes;
                RendererState.DrawTrisNumber += this.trisNumber;
                switch(this.drawMode)
                {
                    case RenderDrawMode.ELEMENTS_TRIANGLES:
                        //console.log("RPOUnit::run(), TRIANGLES drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+"),drawOffset: "+this.drawOffset);
                        //rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        rc.RContext.drawElements(rc.TRIANGLES, this.ivsCount, this.ibufType, this.drawOffset);
                        break;
                    case RenderDrawMode.ELEMENTS_TRIANGLE_STRIP:
                        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType, this.drawOffset);
                        break;
                    case RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES:
                        //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                        //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                        rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.drawOffset, this.insCount);
                        break;
                    case RenderDrawMode.ELEMENTS_TRIANGLE_FAN:
                        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType, this.drawOffset);
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
            
            drawPart(rc:RenderProxy):void
            {
                ++RendererState.DrawCallTimes;
                RendererState.DrawTrisNumber += this.trisNumber;
                let i:number = 0;
                let gl:any = rc.RContext;
                switch(this.drawMode)
                {
                    case RenderDrawMode.ELEMENTS_TRIANGLES:
                        for(; i < this.partTotal;)
                        {
                            // 这里面可以增加一个回调函数,这个回调函数可以对uniform(或者transformUniform)做一些数据改变，进而来控制相应的状态
                            // 因此可以通过改变uniform实现大量的显示绘制
                            //  let count:number = this.partGroup[i++];
                            //  let offset:number = this.partGroup[i++];
                            //  gl.drawElements(rc.TRIANGLES, count, this.ibufType, offset);
                            gl.drawElements(rc.TRIANGLES, this.partGroup[i++], this.ibufType, this.partGroup[i++]);
                        }
                        break;
                    case RenderDrawMode.ELEMENTS_TRIANGLE_STRIP:
                        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        gl.drawElements(rc.TRIANGLE_STRIP, this.ivsCount, this.ibufType, this.drawOffset);
                        break;
                    case RenderDrawMode.ELEMENTS_INSTANCED_TRIANGLES:
                        //console.log("RPOUnit::run(), drawElementsInstanced(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+", insCount: "+this.insCount+")");
                        //rc.RContext.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.ivsIndex * this.ibufStep, this.insCount);
                        gl.drawElementsInstanced(rc.TRIANGLES,this.ivsCount, this.ibufType, this.drawOffset, this.insCount);
                        break;
                    case RenderDrawMode.ELEMENTS_TRIANGLE_FAN:
                        //console.log("RPOUnit::run(), TRIANGLE_STRIP drawElements(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        //rc.RContext.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType,this.ivsIndex * this.ibufStep);
                        gl.drawElements(rc.TRIANGLE_FAN, this.ivsCount, this.ibufType, this.drawOffset);
                        break;
                    case RenderDrawMode.ARRAYS_LINES:
                        //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        gl.drawArrays(rc.LINES, this.ivsIndex, this.ivsCount);
                        break;
                    case RenderDrawMode.ARRAYS_LINE_STRIP:
                        //console.log("RPOUnit::run(), drawArrays(ivsCount="+this.ivsCount+", ivsIndex="+this.ivsIndex+")");
                        gl.drawArrays(rc.LINE_STRIP, this.ivsIndex, this.ivsCount);
                        break;
                    default:
                        break;
                }
            }
            run2(rc:RenderProxy):void
            {
                //console.log("RPOUnit::run2(), this.tro: "+this.tro+", this.drawMode: "+this.drawMode);
                if(this.ubo != null)
                {
                    this.ubo.run(rc);
                }
                if(this.shader == null)
                {
                    console.log("this.shader == null unit this.uid: ",this.uid);
                }
                this.shader.useTransUniform(this.transUniform);
                this.shader.useUniform(this.uniform);
                this.testDrawFlag();
            }
            run(rc:RenderProxy):void
            {
                //console.log("RPOUnit::run(), this.tro: "+this.tro+", this.drawMode: "+this.drawMode);
                if(this.ubo != null)
                {
                    this.ubo.run(rc);
                }
                this.vro.run();
                this.tro.run();
                this.shader.useTransUniform(this.transUniform);
                this.shader.useUniform(this.uniform);
                this.testDrawFlag();
            }
            
            runLockMaterial2():void
            {
                this.testDrawFlag();                
                this.shader.useUniform2ToCurrentShd(this.uniform,this.transUniform);
            }
            runLockMaterial():void
            {
                this.vro.run();
                this.testDrawFlag();
                this.shader.useUniform2ToCurrentShd(this.uniform,this.transUniform);
            }
            reset():void
            {
                this.vro.__$detachThis();
                this.vro = null;
                this.tro.__$detachThis();
                this.tro = null;
                this.texMid = -1;
                this.__$rprouid = -1;

                this.ubo = null;
                this.shdUid = -1;
                this.vtxUid = -1;
                this.uniform = null;
                this.transUniform = null;
                this.partGroup = null;

                this.ivsIndex = 0;
                this.ivsCount = 0;
                this.insCount = 0;
                this.partTotal = 0;
                this.drawMode = 0;
                this.drawFlag = 0x0;
                this.renderState = 0;
                this.rcolorMask = 0;

                this.drawEnabled = true;
                this.shader = null;
                this.bounds = null;
            }
            destroy():void
            {
                this.reset();
            }
            toString():string
            {
                return "[RPOUnit(uid = "+this.uid+")]";
            }
        }
    }
}