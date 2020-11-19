
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as MaterialBaseT from "../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export class MaterialProgram
        {
            static ___shdDict:Map<string,ShaderProgram> = new Map();
            static __s_shdList:ShaderProgram[] = [];
            static __s_sharedUniformList:ShaderUniform[] = [];
            static __s_shdListLen:number = 0;
            private static __s_unlocked:boolean = true;
            private static __s_preuid:number = -1;
            private static __s_currShd:ShaderProgram = null;
            private static __s_fragOutputTotal:number = 1;
            static Create(unique_name_str:string,vshdsrc:string,fshdSrc:string):ShaderProgram
            {
                //console.log("MaterialProgram.Create() begin...");
                if(MaterialProgram.___shdDict.has(unique_name_str)){return MaterialProgram.___shdDict.get(unique_name_str);}
                let p:ShaderProgram = new ShaderProgram();
                p.initialize(unique_name_str, vshdsrc,fshdSrc);
                MaterialProgram.__s_shdList[p.getUid()] = p;
                MaterialProgram.__s_sharedUniformList[p.getUid()] = null;
                ++MaterialProgram.__s_shdListLen;
                MaterialProgram.___shdDict.set(unique_name_str,p);
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("MaterialProgram.Create() a new ShaderProgram: ",p.toString());
                }
                return p;
            }
            static Find(unique_name_str:string):ShaderProgram
            {
                if(MaterialProgram.___shdDict.has(unique_name_str)){return MaterialProgram.___shdDict.get(unique_name_str);}
                return null;
            }
            static Unlock():void
            {
                MaterialProgram.__s_unlocked = true;
            }
            static IsUnLocked():boolean
            {
                return MaterialProgram.__s_unlocked;
            }
            static Lock():void
            {
                MaterialProgram.__s_unlocked = false;
            }
            
            static SetSharedUniformByShd(shd:ShaderProgram, uniform:ShaderUniform):void
            {
                MaterialProgram.__s_sharedUniformList[shd.getUid()] = uniform;
            }
            static GetSharedUniformByShd(shd:ShaderProgram):ShaderUniform
            {
                return MaterialProgram.__s_sharedUniformList[shd.getUid()];
            }
            static GetCurrFragOutputTotal():number
            {
                return MaterialProgram.__s_fragOutputTotal;
            }
            static UseShdByUid(rc:RenderProxy, uid:number):void
            {
                if(MaterialProgram.__s_unlocked)
                {
                    if(uid > -1 && uid < MaterialProgram.__s_shdListLen)
                    {
                        if(MaterialProgram.__s_preuid != uid)
                        {
                            MaterialProgram.__s_preuid = uid;
                            let shd:ShaderProgram = MaterialProgram.__s_shdList[uid];
                            MaterialProgram.__s_fragOutputTotal = shd.getFragOutputTotal();
                            if(MaterialProgram.__s_fragOutputTotal != rc.getActiveAttachmentTotal())
                            {
                                console.log("shd.getUniqueShaderName(): "+shd.getUniqueShaderName());
                                console.log("MaterialProgram.__s_fragOutputTotal: "+MaterialProgram.__s_fragOutputTotal+", rc.getActiveAttachmentTotal(): "+rc.getActiveAttachmentTotal());
                                console.log("Error: MRT output amount is not equal to current shader( "+shd.toString()+" ) frag shader output amount !!!");
                            }
                            rc.RContext.useProgram( shd.getProgram() );
                            shd.useTexLocation();
                            // use global uniform
                            var uniform:ShaderUniform = MaterialProgram.__s_sharedUniformList[shd.getUid()];
                            while(uniform != null)
                            {
                                uniform.use(rc);
                                uniform = uniform.next;
                            }
                            MaterialProgram.__s_currShd = shd;
                        }
                    }
                }
            }
            static GetCurrentShd():ShaderProgram
            {
                return MaterialProgram.__s_currShd;
            }
            static GetCurrentShdUid()
            {
                return MaterialProgram.__s_preuid;
            }
            static Reset():void
            {
                MaterialProgram.__s_fragOutputTotal = 1;
                MaterialProgram.__s_preuid = -1;
                MaterialProgram.__s_currShd = null;
            }
            static UpdateUniformToCurrentShd(rc:RenderProxy,uniform:IShaderUniform)
            {
                let shd:ShaderProgram = MaterialProgram.__s_currShd;
                if(shd != null)
                {
                    uniform.useByShd(rc,shd);
                }
            }
            static UpdateUniformToCurrentShd2(rc:RenderProxy,uniform:IShaderUniform,uniform2:IShaderUniform)
            {
                let shd:ShaderProgram = MaterialProgram.__s_currShd;
                if(shd != null)
                {
                    uniform.useByShd(rc,shd);
                    uniform2.useByShd(rc,shd);
                }
            }
            static UpdateMaterialUniformToCurrentShd(rc:RenderProxy,m:MaterialBase)
            {
                let shd:ShaderProgram = MaterialProgram.__s_currShd;
                if(shd != null && m.__$uniform != null)
                {
                    m.__$uniform.useByShd(rc,shd);
                }
            }
        }
    }
}
