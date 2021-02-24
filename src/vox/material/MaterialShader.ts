
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as MaterialConstT from "../../vox/material/MaterialConst";
import * as ShaderDataT from "../../vox/material/ShaderData";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as IRenderShaderT from "../../vox/render/IRenderShader";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as MaterialBaseT from "../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import ShaderData = ShaderDataT.vox.material.ShaderData;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import IRenderShader = IRenderShaderT.vox.render.IRenderShader;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export class MaterialShader implements IRenderShader
        {
            private m_shdDict:Map<string,ShdProgram> = new Map();
            private m_shdList:ShdProgram[] = [];
            private m_shdListLen:number = 0;

            private m_sharedUniformList:ShaderUniform[] = [];
            private m_unlocked:boolean = true;
            private m_preuid:number = -1;
            private m_currShd:ShdProgram = null;
            private m_fragOutputTotal:number = 1;
            private m_rc:any = null;
            private m_adapter:RenderAdapter = null;
            // material相关的uniform,默认不包括transform相关的信息
            uniform:IShaderUniform = null;
            // 只有transform相关的信息uniform
            transformUniform:IShaderUniform = null;
            // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
            drawFlag:number = 0x0;


            constructor(rc:RenderProxy)
            {
                this.m_adapter = rc.getRenderAdapter();
                this.m_rc = rc.getRC();
            }
            create(shdData:ShaderData):ShdProgram
            {
                //console.log("this.Create() begin...");
                let uns:string = shdData.getUniqueShaderName();
                if(this.m_shdDict.has(uns)){return this.m_shdDict.get(uns);}
                let p:ShdProgram = new ShdProgram();
                p.setShdData(shdData);

                this.m_shdList[p.getUid()] = p;
                this.m_sharedUniformList[p.getUid()] = null;
                ++this.m_shdListLen;
                this.m_shdDict.set(uns,p);
                
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("this.Create() a new ShdProgram: ",p.toString());
                }
                return p;
            }

            findShdProgramByUid(uid:number):ShdProgram
            {
                return this.m_shdList[uid];
            }
            findShdProgram(unique_name_str:string):ShdProgram
            {
                if(this.m_shdDict.has(unique_name_str)){return this.m_shdDict.get(unique_name_str);}
                return null;
            }
            findShdProgramByShdData(shdData:ShaderData):ShdProgram
            {
                if(shdData != null)
                {
                    if(this.m_shdDict.has(shdData.getUniqueShaderName()))
                    {
                        return this.m_shdDict.get(shdData.getUniqueShaderName());
                    }
                }
                return null;
            }
            unlock():void
            {
                this.m_unlocked = true;
            }
            isUnLocked():boolean
            {
                return this.m_unlocked;
            }
            lock():void
            {
                this.m_unlocked = false;
            }
            
            setSharedUniformByShd(shd:ShdProgram, uniform:ShaderUniform):void
            {
                this.m_sharedUniformList[shd.getUid()] = uniform;
            }
            getSharedUniformByShd(shd:ShdProgram):ShaderUniform
            {
                return this.m_sharedUniformList[shd.getUid()];
            }
            getCurrFragOutputTotal():number
            {
                return this.m_fragOutputTotal;
            }
            useShdByUid(uid:number):void
            {
                if(this.m_unlocked)
                {
                    if(uid > -1 && uid < this.m_shdListLen)
                    {
                        if(this.m_preuid != uid)
                        {
                            this.m_preuid = uid;
                            let shd:ShdProgram = this.m_shdList[uid];
                            this.m_fragOutputTotal = shd.getFragOutputTotal();
                            if(this.m_fragOutputTotal != this.getActiveAttachmentTotal())
                            {
                                console.log("shd.getUniqueShaderName(): "+shd.getUniqueShaderName());
                                console.log("this.m_fragOutputTotal: "+this.m_fragOutputTotal+", rc.getActiveAttachmentTotal(): "+this.getActiveAttachmentTotal());
                                console.log("Error: MRT output amount is not equal to current shader( "+shd.toString()+" ) frag shader output amount !!!");
                            }
                            this.m_rc.useProgram( shd.getProgram() );
                            shd.useTexLocation();
                            // use global shared uniform
                            var uniform:ShaderUniform = this.m_sharedUniformList[shd.getUid()];
                            while(uniform != null)
                            {
                                uniform.use(this);
                                uniform = uniform.next;
                            }
                            this.m_currShd = shd;
                        }
                    }
                }
            }
            getCurrentShd():ShdProgram
            {
                return this.m_currShd;
            }
            getCurrentShdUid():number
            {
                return this.m_preuid;
            }
            reset():void
            {
                this.uniform = null;
                this.transformUniform = null;
                this.m_fragOutputTotal = 1;
                this.m_preuid = -1;
                this.m_currShd = null;
            }
            destroy():void
            {
                this.m_rc = null;
                this.m_adapter = null;
            }
            updateUniformToCurrentShd(uniform:IShaderUniform):void
            {
                uniform.useByShd(this,this.m_currShd);
            }
            updateUniformToCurrentShd2(uniform:IShaderUniform,uniform2:IShaderUniform):void
            {
                uniform.useByShd(this,this.m_currShd);
                uniform2.useByShd(this,this.m_currShd);
            }
            updateMaterialUniformToCurrentShd(m:MaterialBase):void
            {
                m.__$uniform.useByShd(this,this.m_currShd);
            }
            
            useUniformV2(ult:any,type:number, f32Arr:Float32Array,dataSize:number,offset:number):void
            {
                switch(type)
                {
                    case MaterialConst.SHADER_MAT4:
                        if(offset < 1)
                        {
                            this.m_rc.uniformMatrix4fv(ult, false, f32Arr);
                        }
                        else
                        {
                            this.m_rc.uniformMatrix4fv(ult, false, f32Arr,offset,dataSize * 16);
                        }
                    break;
                    case MaterialConst.SHADER_MAT3:
                        this.m_rc.uniformMatrix3fv(ult, false, f32Arr,0, dataSize * 9);
                    break;
                    case MaterialConst.SHADER_VEC4FV:
                        this.m_rc.uniform4fv(ult, f32Arr, offset, dataSize * 4);
                    break;
                    case MaterialConst.SHADER_VEC3FV:
                        this.m_rc.uniform3fv(ult, f32Arr, offset, dataSize * 3);
                    break;
                    case MaterialConst.SHADER_VEC4:
	        		    this.m_rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
                    break;
                    case MaterialConst.SHADER_VEC3:
	        		    this.m_rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
                    break;
                    case MaterialConst.SHADER_VEC2:
	        		    this.m_rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
                    break;
                    default:
                        break;
                }
            }
            
            useUniformV1(ult:any,type:number, f32Arr:Float32Array,dataSize:number):void
            {
                switch(type)
                {
                    case MaterialConst.SHADER_MAT4:
                        this.m_rc.uniformMatrix4fv(ult, false, f32Arr);
                    break;
                    case MaterialConst.SHADER_MAT3:
                        this.m_rc.uniformMatrix3fv(ult, false, f32Arr);
                    break;
                    case MaterialConst.SHADER_VEC4FV:
                        this.m_rc.uniform4fv(ult, f32Arr, dataSize * 4);
                    break;
                    case MaterialConst.SHADER_VEC3FV:
                        this.m_rc.uniform3fv(ult, f32Arr, dataSize * 3);
                    break;
                    case MaterialConst.SHADER_VEC4:
	        		    this.m_rc.uniform4f(ult, f32Arr[0], f32Arr[1], f32Arr[2], f32Arr[3]);
                    break;
                    case MaterialConst.SHADER_VEC3:
	        		    this.m_rc.uniform3f(ult, f32Arr[0], f32Arr[1], f32Arr[2]);
                    break;
                    case MaterialConst.SHADER_VEC2:
	        		    this.m_rc.uniform2f(ult, f32Arr[0], f32Arr[1]);
                    break;
                    default:
                        break;
                }
            }
			getActiveAttachmentTotal():number
			{
                return this.m_adapter.getActiveAttachmentTotal();
            }
        }
    }
}
