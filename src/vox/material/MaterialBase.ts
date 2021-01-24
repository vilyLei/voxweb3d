/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as MaterialProgramT from "../../vox/material/MaterialProgram";
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderGlobalUniformT from "../../vox/material/ShaderGlobalUniform";
import * as TextureProxyT from '../../vox/texture/TextureProxy';
import * as TextureRenderObjT from '../../vox/texture/TextureRenderObj';
import * as ShaderCodeBufferT from "../../vox/material/ShaderCodeBuffer";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import MaterialProgram = MaterialProgramT.vox.material.MaterialProgram;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureRenderObj = TextureRenderObjT.vox.texture.TextureRenderObj;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export class MaterialBase
        {
            private static ___s_codeBuffer:ShaderCodeBuffer = null;
            constructor()
            {
            }
            // use rgb normalize bias enabled
            private m_shduns:string = "";
            private m_spg:ShaderProgram = null;
            // tex list unique hash value
            __$troMid:number = -1;
            __$uniform:IShaderUniform = null;
            getShdUniqueName():string
            {
                return this.m_shduns;
            }
            initializeByUniqueName(shdCode_uniqueName:string)
            {
                if(this.getShaderProgram() == null)
                {
                    let program:ShaderProgram = MaterialProgram.Find( shdCode_uniqueName );
                    if(program != null) this.setShaderProgram(program);
                }
                return this.getShaderProgram() != null;
            }
            initialize(shdCode_uniqueName:string,shdCode_vshdCode:string,shdCode_fshdCode:string):void
            {
                if(this.getShaderProgram() == null)
                {
                    ShaderCodeBuffer.UseShaderBuffer(null);
                    //trace("MaterialBase::initialize(), shdCode_uniqueName: "+shdCode_uniqueName);
                    let program:ShaderProgram = MaterialProgram.Find( shdCode_uniqueName );
                    if(null == program)
                    {
                        program = MaterialProgram.Create(
                            shdCode_uniqueName
                            , shdCode_vshdCode
                            , shdCode_fshdCode
                        );
                    }
                    this.m_shduns = shdCode_uniqueName;
                    this.setShaderProgram(program);
                }
            }
            // get a shader code buf instance, for sub class override
            getCodeBuf()
            {
                if(MaterialBase.___s_codeBuffer != null)
                {
                    return MaterialBase.___s_codeBuffer;
                }
                MaterialBase.___s_codeBuffer = new ShaderCodeBuffer();
                return MaterialBase.___s_codeBuffer;
            }
            initializeByCodeBuf(texEnabled:boolean = false):void
            {
                if(this.getShaderProgram() == null)
                {
                    let buf:ShaderCodeBuffer = this.getCodeBuf();
                    if(buf != null)
                    {
                        if(MaterialBase.___s_codeBuffer == null)
                        {
                            MaterialBase.___s_codeBuffer = new ShaderCodeBuffer();
                        }
                        ShaderCodeBuffer.UseShaderBuffer( buf );
                        //
                        MaterialBase.___s_codeBuffer.initialize(texEnabled);
                        let shdCode_uniqueName:string = MaterialBase.___s_codeBuffer.getUniqueShaderName();
                        this.m_shduns = shdCode_uniqueName;
                        this.__initShd(this.m_shduns);
                        let program:ShaderProgram = MaterialProgram.Find( shdCode_uniqueName );
                        if(null == program)
                        {
                            MaterialBase.___s_codeBuffer.buildShader();
                            let shdCode_fshdCode = MaterialBase.___s_codeBuffer.getFragShaderCode();
                            let shdCode_vshdCode = MaterialBase.___s_codeBuffer.getVtxShaderCode();
                            program = MaterialProgram.Create(
                                shdCode_uniqueName
                                , shdCode_vshdCode
                                , shdCode_fshdCode
                            );
                        }
                        ShaderCodeBuffer.UseShaderBuffer(null);
                        this.setShaderProgram(program);
                    }
                }
            }
            protected __initShd(pshduns:string):void
            {
            }
            setShaderProgram(p:ShaderProgram):void{ this.m_spg = p;}
            getShaderProgram():ShaderProgram{return this.m_spg;};    
            getProgram(){return this.m_spg.getProgram();}
        
            private m_texList:TextureProxy[] = null;
            private m_texListLen:number = 0;
            private m_texDataEnabled:boolean = false;
            // @param           texList     [tex0,tex1,...]
            setTextureList(texList:TextureProxy[]):void
            {
                if(this.m_texList != texList)
                {
                    this.m_texDataEnabled = false;
                    if(texList != null)
                    {                  
                        this.m_texListLen = texList.length;
                    }
                    else
                    {
                        this.m_texListLen = 0;
                    }
                    let i:number = 0;
                    if(this.m_texList != null)
                    {
                        for(;i < this.m_texList.length;++i)
                        {
                            TextureRenderObj.__$DetachTexAt(this.m_texList[i].getUid());
                        }
                    }
                    this.m_texDataEnabled = true;
                    this.m_texList = texList;
                    if(this.m_texList != null)
                    {
                        let key = 31;
                        for(i = 0;i < this.m_texList.length;++i)
                        {
                            key = key * 131 + this.m_texList[i].getUid();
                            TextureRenderObj.__$AttachTexAt(this.m_texList[i].getUid());
                            if(!this.m_texList[i].dataEnough())
                            {
                                this.m_texDataEnabled = false;
                            }
                        }
                        this.__$troMid = key;
                    }
                }
            }
            updateTextureAt(index:number,tex:TextureProxy):void
            {
                if(index >= 0 && tex != null)
                {
                    let texList:TextureProxy[] = this.m_texList;
                    let len:number = texList.length;
                    if(texList != null && texList[index] != tex && index < len && len > 0)
                    {
                        texList = texList.slice(0);
                        TextureRenderObj.__$DetachTexAt(texList[index].getUid());
                        texList[index] = tex;
                        this.m_texDataEnabled = tex.dataEnough();
                        TextureRenderObj.__$AttachTexAt(tex.getUid());
                        let key = 31;
                        for(let i:number = 0; i < len; ++i)
                        {
                            key = key * 131 + texList[i].getUid();
                        }
                        this.__$troMid = key;
                        this.m_texList = texList;
                    }
                }
            }
            getTextureList():TextureProxy[]{return this.m_texList;}
            getTextureTotal():number{return this.m_texListLen;}
            getShdTexTotal():number
            {
                if(this.m_spg != null)
                {
                    return this.m_spg.getTexTotal();
                }
                return 0;
            }
            texDataEnabled():boolean
            {
                if(this.m_texList != null)
                {
                    if(this.m_texDataEnabled)
                    {
                        return true;
                    }
                    let boo:boolean = true;
                    let texList:TextureProxy[] = this.m_texList;
                    for(let i:number = 0; i < this.m_texListLen; ++i)
                    {
                        if(!texList[i].dataEnough())
                        {
                            boo = false;
                            break;
                        }
                    }
                    this.m_texDataEnabled = boo;
                    return boo;
                }
                return false;
            }
            
            createSharedUniform(rc:RenderProxy):ShaderGlobalUniform
            {
                return null;
            }
            createSelfUniformData():ShaderUniformData
            {
                return null;
            }
            //  // synchronism ubo data and src data
            updateSelfData(ro:any):void
            {
            }
            isHaveTexture():boolean
            {
                return this.m_spg.haveTexture();
            }
            getBufSortFormat():number
            {
                //trace("null != m_spg: "+(null != m_spg));
                if(null != this.m_spg)
                {
                    return this.m_spg.getLayoutBit();
                }
                return 0x0;
            }
            private m_attachCount:number = 0;
            __$attachThis():void
            {
                ++this.m_attachCount;
                //console.log("MaterialBase::__$attachThis() this.m_attachCount: "+this.m_attachCount);
            }
            __$detachThis():void
            {
                --this.m_attachCount;
                //console.log("MaterialBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                if(this.m_attachCount < 1)
                {
                    this.m_attachCount = 0;
                }
            }
            getAttachCount():number
            {
                return this.m_attachCount;
            }
            destroy():void
            {
                if(this.getAttachCount() < 1)
                {
                    if(this.m_texList != null)
                    {
                        for(let i:number = 0;i < this.m_texList.length;++i)
                        {
                            TextureRenderObj.__$DetachTexAt(this.m_texList[i].getUid());
                        }
                    }
                    this.m_spg = null;
                    this.m_texList = null;
                    this.m_texDataEnabled = false;
                    this.__$troMid = 0;
                    if(this.__$uniform != null)
                    {
                        this.__$uniform.destroy();
                        this.__$uniform = null;
                    }
                }
            }
            toString():string
            {
                return "[MaterialBase()]";
            }
        }
    }
}