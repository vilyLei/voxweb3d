
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderDataT from "../../vox/material/ShaderData";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as MaterialBaseT from "../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderData = ShaderDataT.vox.material.ShaderData;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export class MaterialProgram
        {
            private static s_shdDataDict:Map<string,ShaderData> = new Map();
            private static s_shdDataList:ShaderData[] = [];
            private static s_shdDataListLen:number = 0;

            private static s_shdDict:Map<string,ShaderProgram> = new Map();
            private static s_shdList:ShaderProgram[] = [];
            private static s_shdListLen:number = 0;

            private static s_sharedUniformList:ShaderUniform[] = [];
            private static s_unlocked:boolean = true;
            private static s_preuid:number = -1;
            private static s_currShd:ShaderProgram = null;
            private static s_fragOutputTotal:number = 1;

            static Create(unique_name_str:string,vshdsrc:string,fshdSrc:string):ShaderProgram
            {
                //console.log("MaterialProgram.Create() begin...");
                if(MaterialProgram.s_shdDict.has(unique_name_str)){return MaterialProgram.s_shdDict.get(unique_name_str);}
                let p:ShaderProgram = new ShaderProgram();
                p.initialize(unique_name_str, vshdsrc,fshdSrc);

                MaterialProgram.s_shdList[p.getUid()] = p;
                MaterialProgram.s_sharedUniformList[p.getUid()] = null;
                ++MaterialProgram.s_shdListLen;
                MaterialProgram.s_shdDict.set(unique_name_str,p);
                
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("MaterialProgram.Create() a new ShaderProgram: ",p.toString());
                }
                return p;
            }

            static CreateShdData(unique_name_str:string,vshdsrc:string,fshdSrc:string):ShaderData
            {
                //console.log("MaterialProgram.CreateShdData() begin...");
                if(MaterialProgram.s_shdDataDict.has(unique_name_str)){return MaterialProgram.s_shdDataDict.get(unique_name_str);}
                let p:ShaderData = new ShaderData();
                p.initialize(unique_name_str, vshdsrc,fshdSrc);
                MaterialProgram.s_shdDataList[p.getUid()] = p;
                //
                //MaterialProgram.s_sharedUniformList[p.getUid()] = null;
                ++MaterialProgram.s_shdDataListLen;
                MaterialProgram.s_shdDataDict.set(unique_name_str,p);
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("MaterialProgram.Create() a new ShaderProgram: ",p.toString());
                }
                return p;
            }

            static Find(unique_name_str:string):ShaderProgram
            {
                if(MaterialProgram.s_shdDict.has(unique_name_str)){return MaterialProgram.s_shdDict.get(unique_name_str);}
                return null;
            }
            static Unlock():void
            {
                MaterialProgram.s_unlocked = true;
            }
            static IsUnLocked():boolean
            {
                return MaterialProgram.s_unlocked;
            }
            static Lock():void
            {
                MaterialProgram.s_unlocked = false;
            }
            
            static SetSharedUniformByShd(shd:ShaderProgram, uniform:ShaderUniform):void
            {
                MaterialProgram.s_sharedUniformList[shd.getUid()] = uniform;
            }
            static GetSharedUniformByShd(shd:ShaderProgram):ShaderUniform
            {
                return MaterialProgram.s_sharedUniformList[shd.getUid()];
            }
            static GetCurrFragOutputTotal():number
            {
                return MaterialProgram.s_fragOutputTotal;
            }
            static UseShdByUid(rc:RenderProxy, uid:number):void
            {
                if(MaterialProgram.s_unlocked)
                {
                    if(uid > -1 && uid < MaterialProgram.s_shdListLen)
                    {
                        if(MaterialProgram.s_preuid != uid)
                        {
                            MaterialProgram.s_preuid = uid;
                            let shd:ShaderProgram = MaterialProgram.s_shdList[uid];
                            MaterialProgram.s_fragOutputTotal = shd.getFragOutputTotal();
                            if(MaterialProgram.s_fragOutputTotal != rc.getActiveAttachmentTotal())
                            {
                                console.log("shd.getUniqueShaderName(): "+shd.getUniqueShaderName());
                                console.log("MaterialProgram.s_fragOutputTotal: "+MaterialProgram.s_fragOutputTotal+", rc.getActiveAttachmentTotal(): "+rc.getActiveAttachmentTotal());
                                console.log("Error: MRT output amount is not equal to current shader( "+shd.toString()+" ) frag shader output amount !!!");
                            }
                            rc.RContext.useProgram( shd.getProgram() );
                            shd.useTexLocation();
                            // use global uniform
                            var uniform:ShaderUniform = MaterialProgram.s_sharedUniformList[shd.getUid()];
                            while(uniform != null)
                            {
                                uniform.use(rc);
                                uniform = uniform.next;
                            }
                            MaterialProgram.s_currShd = shd;
                        }
                    }
                }
            }
            static GetCurrentShd():ShaderProgram
            {
                return MaterialProgram.s_currShd;
            }
            static GetCurrentShdUid()
            {
                return MaterialProgram.s_preuid;
            }
            static Reset():void
            {
                MaterialProgram.s_fragOutputTotal = 1;
                MaterialProgram.s_preuid = -1;
                MaterialProgram.s_currShd = null;
            }
            static UpdateUniformToCurrentShd(rc:RenderProxy,uniform:IShaderUniform)
            {
                let shd:ShaderProgram = MaterialProgram.s_currShd;
                if(shd != null)
                {
                    uniform.useByShd(rc,shd);
                }
            }
            static UpdateUniformToCurrentShd2(rc:RenderProxy,uniform:IShaderUniform,uniform2:IShaderUniform)
            {
                let shd:ShaderProgram = MaterialProgram.s_currShd;
                if(shd != null)
                {
                    uniform.useByShd(rc,shd);
                    uniform2.useByShd(rc,shd);
                }
            }
            static UpdateMaterialUniformToCurrentShd(rc:RenderProxy,m:MaterialBase)
            {
                let shd:ShaderProgram = MaterialProgram.s_currShd;
                if(shd != null && m.__$uniform != null)
                {
                    m.__$uniform.useByShd(rc,shd);
                }
            }
        }
    }
}
