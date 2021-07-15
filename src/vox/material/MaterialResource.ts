
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import ShaderData from "../../vox/material/ShaderData";

export default class MaterialResource
{
    private static s_shdDataDict:Map<string,ShaderData> = new Map();
    private static s_shdDataList:ShaderData[] = [];
    private static s_shdDataListLen:number = 0;

    static CreateShdData(unique_name_str:string,vshdsrc:string,fshdSrc:string,adaptationEnabled: boolean):ShaderData
    {
        //console.log("MaterialResource.CreateShdData() begin...");
        if(MaterialResource.s_shdDataDict.has(unique_name_str)){return MaterialResource.s_shdDataDict.get(unique_name_str);}
        let p:ShaderData = new ShaderData();
        p.adaptationEnabled = adaptationEnabled;
        p.initialize(unique_name_str, vshdsrc,fshdSrc);
        MaterialResource.s_shdDataList[p.getUid()] = p;
        
        ++MaterialResource.s_shdDataListLen;
        MaterialResource.s_shdDataDict.set(unique_name_str,p);
        if(RendererDeviece.SHADERCODE_TRACE_ENABLED)
        {
            console.log("MaterialResource.Create() a new ShaderProgram: ",p.toString());
        }
        return p;
    }

    static FindData(unique_name_str:string):ShaderData
    {
        if(MaterialResource.s_shdDataDict.has(unique_name_str)){return MaterialResource.s_shdDataDict.get(unique_name_str);}
        return null;
    }
}