
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderDataT from "../../vox/material/ShaderData";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as MaterialBaseT from "../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderData = ShaderDataT.vox.material.ShaderData;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export class MaterialShader
        {
            private m_shdDict:Map<string,ShdProgram> = new Map();
            private m_shdList:ShdProgram[] = [];
            private m_shdListLen:number = 0;

            private m_sharedUniformList:ShaderUniform[] = [];
            private m_unlocked:boolean = true;
            private m_preuid:number = -1;
            private m_currShd:ShdProgram = null;
            private m_fragOutputTotal:number = 1;

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
            useShdByUid(rc:RenderProxy, uid:number):void
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
                            if(this.m_fragOutputTotal != rc.getActiveAttachmentTotal())
                            {
                                console.log("shd.getUniqueShaderName(): "+shd.getUniqueShaderName());
                                console.log("this.m_fragOutputTotal: "+this.m_fragOutputTotal+", rc.getActiveAttachmentTotal(): "+rc.getActiveAttachmentTotal());
                                console.log("Error: MRT output amount is not equal to current shader( "+shd.toString()+" ) frag shader output amount !!!");
                            }
                            rc.RContext.useProgram( shd.getProgram() );
                            shd.useTexLocation();
                            // use global shared uniform
                            var uniform:ShaderUniform = this.m_sharedUniformList[shd.getUid()];
                            while(uniform != null)
                            {
                                uniform.use(rc);
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
                this.m_fragOutputTotal = 1;
                this.m_preuid = -1;
                this.m_currShd = null;
            }
            updateUniformToCurrentShd(rc:RenderProxy,uniform:IShaderUniform):void
            {
                let shd:ShdProgram = this.m_currShd;
                if(shd != null)
                {
                    uniform.useByShd(rc,shd);
                }
            }
            updateUniformToCurrentShd2(rc:RenderProxy,uniform:IShaderUniform,uniform2:IShaderUniform):void
            {
                let shd:ShdProgram = this.m_currShd;
                if(shd != null)
                {
                    uniform.useByShd(rc,shd);
                    uniform2.useByShd(rc,shd);
                }
            }
            updateMaterialUniformToCurrentShd(rc:RenderProxy,m:MaterialBase):void
            {
                let shd:ShdProgram = this.m_currShd;
                if(shd != null && m.__$uniform != null)
                {
                    m.__$uniform.useByShd(rc,shd);
                }
            }
        }
    }
}
