
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderDataT from "../../vox/material/ShaderData";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderData = ShaderDataT.vox.material.ShaderData;

export namespace vox
{
    export namespace material
    {
        export class MaterialProgram
        {
            private static s_shdDataDict:Map<string,ShaderData> = new Map();
            private static s_shdDataList:ShaderData[] = [];
            private static s_shdDataListLen:number = 0;

            static CreateShdData(unique_name_str:string,vshdsrc:string,fshdSrc:string):ShaderData
            {
                
                if(MaterialProgram.s_shdDataDict.has(unique_name_str)){return MaterialProgram.s_shdDataDict.get(unique_name_str);}
                let p:ShaderData = new ShaderData();
                p.initialize(unique_name_str, vshdsrc,fshdSrc);
                MaterialProgram.s_shdDataList[p.getUid()] = p;
                
                ++MaterialProgram.s_shdDataListLen;
                MaterialProgram.s_shdDataDict.set(unique_name_str,p);
                if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
                {
                    console.log("MaterialProgram.Create() a new ShaderProgram: ",p.toString());
                }
                return p;
            }

            static FindData(unique_name_str:string):ShaderData
            {
                if(MaterialProgram.s_shdDataDict.has(unique_name_str)){return MaterialProgram.s_shdDataDict.get(unique_name_str);}
                return null;
            }
        }
    }
}
