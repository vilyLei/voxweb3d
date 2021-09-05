
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import MaterialConst from "../../vox/material/MaterialConst";
import IShaderData from "../../vox/material/IShaderData";
import ShdProgram from "../../vox/material/ShdProgram";
import RenderAdapter from "../../vox/render/RenderAdapter";
import IRenderShader from "../../vox/render/IRenderShader";
import IRenderResource from "../../vox/render/IRenderResource";
import IShaderUniform from "../../vox/material/IShaderUniform";

/**
 * 作为渲染器运行时 material shader 资源的管理类
 * renderer runtime material shader resource manager
 */
export default class RenderShader implements IRenderShader,IRenderResource
{
    private m_shdDict:Map<string,ShdProgram> = new Map();
    private m_shdList:ShdProgram[] = [];
    private m_shdListLen:number = 0;
    private m_sharedUniformList:IShaderUniform[] = [];
    private m_unlocked:boolean = true;
    private m_texUnlocked:boolean = false;
    private m_preuid:number = -1;
    private m_currShd:ShdProgram = null;
    private m_fragOutputTotal:number = 1;
    private m_rcuid:number = -1;
    private m_rc:any = null;
    private m_gpuProgram: any = null;
    private m_adapter:RenderAdapter = null;
    private m_guniform:IShaderUniform = null;
    // material相关的uniform,默认不包括transform相关的信息
    private m_uniform:IShaderUniform = null;
    // 只有transform相关的信息uniform
    private m_transformUniform:IShaderUniform = null;
    // 用于记录 renderState(低10位)和ColorMask(高10位) 的状态组合
    drawFlag:number = -1;
    constructor(rcuid:number,gl:any,adapter:RenderAdapter)
    {
        this.m_rcuid = rcuid;
        this.m_adapter = adapter;
        this.m_rc = gl;
    }
    createResByParams3(resUid:number,param0:number,param1:number,param2:number):boolean
    {
        return false;
    }
    /**
     * @returns return system gpu context
     */
    getRC():any
    {
        return this.m_rc;
    }
    /**
     * @returns return current gpu shader  program
     */
    getGPUProgram(): any {
        return this.m_gpuProgram;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid():number
    {
        return this.m_rcuid;
    }
    useTransUniform(transUniform:IShaderUniform):void
    {
        if(this.m_transformUniform != transUniform)
        {
            this.m_transformUniform = transUniform;
            transUniform.use(this);
        }
    }
    useUniform(uniform:IShaderUniform):void
    {
        if(this.m_uniform != uniform)
        {
            this.m_uniform = uniform;
            uniform.use(this);
        }
    }
    create(shdData:IShaderData):ShdProgram
    {
        //console.log("this.Create() begin...");
        let uns:string = shdData.getUniqueShaderName();
        if(this.m_shdDict.has(uns)){return this.m_shdDict.get(uns);}
        let p:ShdProgram = new ShdProgram(this.m_shdListLen);
        p.setShdData(shdData);
        this.m_shdList[p.getUid()] = p;
        this.m_sharedUniformList[p.getUid()] = null;
        ++this.m_shdListLen;
        this.m_shdDict.set(uns,p);
        
        if(RendererDevice.SHADERCODE_TRACE_ENABLED)
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
    findShdProgramByShdData(shdData:IShaderData):ShdProgram
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
        this.__$globalUniform = null;
    }
    isUnLocked():boolean
    {
        return this.m_unlocked;
    }
    lock():void
    {
        this.m_unlocked = false;
    }

    
    textureUnlock():void
    {
        this.m_texUnlocked = true;
    }
    isTextureUnLocked():boolean
    {
        return this.m_texUnlocked;
    }
    textureLock():void
    {
        this.m_texUnlocked = false;
    }
    
    setSharedUniformByShd(shd:ShdProgram, uniform:IShaderUniform):void
    {
        this.m_sharedUniformList[shd.getUid()] = uniform;
    }
    getSharedUniformByShd(shd:ShdProgram):IShaderUniform
    {
        return this.m_sharedUniformList[shd.getUid()];
    }
    getCurrFragOutputTotal():number
    {
        return this.m_fragOutputTotal;
    }
    /**
     * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
     * @param resUid renderer runtime resource unique id
     * @returns has or has not resource by unique id
     */
    hasResUid(resUid:number):boolean
    {
        return this.m_shdList[resUid] != null;
    }
    /**
     * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
     * @param resUid renderer runtime resource unique id
     */
    bindToGpu(resUid:number):void
    {
        if(this.m_unlocked && resUid > -1 && resUid < this.m_shdListLen)
        {
            if(this.m_preuid != resUid)
            {
                this.m_preuid = resUid;
                
                let shd:ShdProgram = this.m_shdList[resUid];
                this.m_fragOutputTotal = shd.getFragOutputTotal();
                if(this.m_fragOutputTotal != this.getActiveAttachmentTotal())
                {
                    //if(RendererDevice.SHOWLOG_ENABLED) {
                        console.log("shd.getUniqueShaderName(): string: "+shd.getUniqueShaderName());
                        console.log("this.m_fragOutputTotal: "+this.m_fragOutputTotal+", rc.getActiveAttachmentTotal(): "+this.getActiveAttachmentTotal());
                        console.error("Error: MRT output amount is not equal to current shader( "+shd.toString()+" ) frag shader output amount !!!");
                    //}
                }
                this.m_gpuProgram = shd.getGPUProgram();
                this.m_rc.useProgram( this.m_gpuProgram );
                shd.useTexLocation();
                //console.log("use a new shader uid: ",shd.getUid(),",uns: ",shd.getUniqueShaderName());
                // use global shared uniform
                let uniform:IShaderUniform = this.m_sharedUniformList[shd.getUid()];
                //  let boo: boolean = false;
                //  if((uniform as any).uns == "u_projMat") {
                //      console.log("only use projMat begin");
                //      boo = true;
                //  }
                this.m_guniform = uniform;
                while(uniform != null)
                {
                    uniform.use(this);
                    uniform = uniform.next;
                }
                this.m_currShd = shd;
                //  if( boo ) {
                //      console.log("only use projMat end");
                //  }
            }
            else if(this.m_guniform == null && this.m_currShd != null){
                let uniform:IShaderUniform = this.m_sharedUniformList[this.m_currShd.getUid()];
                this.m_guniform = uniform;
                while(uniform != null)
                {
                    uniform.use(this);
                    uniform = uniform.next;
                }
            }
        }
    }
    /**
     * get system gpu context resource buf
     * @param resUid renderer runtime resource unique id
     * @returns system gpu context resource buf
     */
    getGpuBuffer(resUid:number):any
    {
        return null;
    }
    getCurrentShd():ShdProgram
    {
        return this.m_currShd;
    }
    getCurrentShdUid():number
    {
        return this.m_preuid;
    }
    resetUniform():void
    {
        this.m_uniform = null;
        this.m_transformUniform = null;
        this.m_guniform = null;
    }
    /**
     * frame begin run this function
     */
    renderBegin():void
    {
        this.m_fragOutputTotal = 1;
        this.m_preuid = -1;
        this.m_currShd = null;
        this.drawFlag = -1;
        //this.resetUniform();
    }
    
    /**
     * frame update
     */
    update():void
    {
    }
    destroy():void
    {
        this.m_rc = null;
        this.m_adapter = null;
    }
    useUniformToCurrentShd(uniform:IShaderUniform):void
    {
        if(this.m_uniform != uniform)
        {
            this.m_uniform != uniform;
            uniform.useByShd(this,this.m_currShd);
        }
    }
    __$globalUniform:IShaderUniform = null;
    useUniform2ToCurrentShd(uniform:IShaderUniform,transUniform:IShaderUniform):void
    {
        if(this.m_uniform != uniform)
        {
            this.m_uniform != uniform;
            uniform.useByShd(this,this.m_currShd);
        }
        if(this.m_transformUniform != transUniform)
        {
            this.m_transformUniform != transUniform;
            transUniform.useByShd(this,this.m_currShd);
        }
    }
    /**
     * 仅仅更新单个matrix4的uniforms数据
    */
    useUniformMat4(ult:any,mat4f32Arr:Float32Array):void
    {
        this.m_rc.uniformMatrix4fv(ult, false, mat4f32Arr);
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
                //console.log("MaterialConst.SHADER_VEC4FV dataSize: ",dataSize);
                //console.log(f32Arr);
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
