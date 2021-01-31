/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as IUniformBuilderT from "../../vox/material/shared/IUniformBuilder";
import * as CameraUniformBuilderT from "../../vox/material/shared/CameraUniformBuilder";
import * as StageParamUniformBuilderT from "../../vox/material/shared/StageParamUniformBuilder";
import * as CameraParamUniformBuilderT from "../../vox/material/shared/CameraParamUniformBuilder";
import * as ViewParamUniformBuilderT from "../../vox/material/shared/ViewParamUniformBuilder";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import ShaderUniformV1 = ShaderUniformT.vox.material.ShaderUniformV1;
import ShaderUniformV2 = ShaderUniformT.vox.material.ShaderUniformV2;
import IUniformBuilder = IUniformBuilderT.vox.material.shared.IUniformBuilder;
import CameraUniformBuilder = CameraUniformBuilderT.vox.material.shared.CameraUniformBuilder;
import StageParamUniformBuilder = StageParamUniformBuilderT.vox.material.shared.StageParamUniformBuilder;
import CameraParamUniformBuilder = CameraParamUniformBuilderT.vox.material.shared.CameraParamUniformBuilder;
import ViewParamUniformBuilder = ViewParamUniformBuilderT.vox.material.shared.ViewParamUniformBuilder;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export class EmptyShdUniform extends ShaderUniform implements IShaderUniform
        {
            static EmptyUniform:EmptyShdUniform = new EmptyShdUniform();
            use(rc:RenderProxy):void
            {
            }
            useByLocation(rc:RenderProxy,type:number,location:any,i:number):void
            {
            }
            useByShd(rc:RenderProxy,shd:ShaderProgram):void
            {
            }
            updateData():void
            {
            }
            destroy():void
            {
            }
        
        }

        export class ShdUniformTool
        {
            private static s_initBoo:boolean = true;
            private static s_uniformDict:Map<string,IUniformBuilder> = new Map();
            private static s_builders:IUniformBuilder[] = [];
            private static s_buildersTot:number = 0;

            static Initialize():void
            {
                if(ShdUniformTool.s_initBoo)
                {
                    ShdUniformTool.s_initBoo = false;
                    
                    let builder:IUniformBuilder = new CameraUniformBuilder();
                    ShdUniformTool.s_builders.push(builder);
                    ShdUniformTool.s_uniformDict.set(builder.getIDNS(),builder);

                    builder = new StageParamUniformBuilder();
                    ShdUniformTool.s_builders.push(builder);
                    ShdUniformTool.s_uniformDict.set(builder.getIDNS(),builder);

                    builder = new CameraParamUniformBuilder();
                    ShdUniformTool.s_builders.push(builder);
                    ShdUniformTool.s_uniformDict.set(builder.getIDNS(),builder);

                    builder = new ViewParamUniformBuilder();
                    ShdUniformTool.s_builders.push(builder);
                    ShdUniformTool.s_uniformDict.set(builder.getIDNS(),builder);
    
                    ShdUniformTool.s_buildersTot = ShdUniformTool.s_builders.length;
                }
            }
            static AddSharedUniformBuilder(builder:IUniformBuilder):void
            {
                if(builder != null && !ShdUniformTool.s_uniformDict.has(builder.getIDNS()))
                {
                    ShdUniformTool.s_builders.push(builder);
                    ShdUniformTool.s_uniformDict.set(builder.getIDNS(),builder);
                    ++ShdUniformTool.s_buildersTot;
                }
            }
            static removeSharedUniformBuilder(builder:IUniformBuilder):void
            {
                if(builder != null && ShdUniformTool.s_uniformDict.has(builder.getIDNS()))
                {
                    for(let i:number = 0;i<ShdUniformTool.s_buildersTot; ++i)
                    {
                        if(builder == ShdUniformTool.s_builders[i])
                        {
                            ShdUniformTool.s_builders.splice(i,1);
                            --ShdUniformTool.s_buildersTot;
                            break;
                        }
                    }
                    ShdUniformTool.s_uniformDict.delete(builder.getIDNS());
                }
            }
            static removeSharedUniformBuilderByName(builderNS:string):void
            {
                if(ShdUniformTool.s_uniformDict.has(builderNS))
                {
                    let builder:IUniformBuilder = ShdUniformTool.s_uniformDict.get(builderNS);
                    for(let i:number = 0;i<ShdUniformTool.s_buildersTot; ++i)
                    {
                        if(builder == ShdUniformTool.s_builders[i])
                        {
                            ShdUniformTool.s_builders.splice(i,1);
                            --ShdUniformTool.s_buildersTot;
                            break;
                        }
                    }
                    ShdUniformTool.s_uniformDict.delete(builderNS);
                }
            }
            static BuildShared(guniform:ShaderUniform, rc:RenderProxy,shdp:ShaderProgram):ShaderUniform
            {
                let headU:ShaderUniform = null;
                let prevU:ShaderUniform = null;
                let builders:IUniformBuilder[] = ShdUniformTool.s_builders;
                let i:number = 0;
                let len:number = ShdUniformTool.s_buildersTot;
                let puo:ShaderUniform = null;
                for(; i < len; ++i)
                {
                    puo = builders[i].create(rc,shdp);
                    if(puo != null)
                    {
                        if(prevU != null)
                        {
                            prevU.next = puo;
                        }
                        else if(headU == null)
                        {
                            headU = puo;
                        }
                        prevU = puo;
                    }
                }
                if(guniform == null)
                {
                    guniform = headU;
                }
                else if(headU != null)
                {
                    prevU.next = guniform;
                    guniform = headU;
                }
                
                if(guniform == null)
                {
                    guniform = EmptyShdUniform.EmptyUniform;
                }
                else
                {
                    // normalize uniform
                    let pdata:ShaderUniform = guniform;
                    let i:number = 0;
                    while(pdata != null)
                    {
                        if(pdata.uniformNameList != null && pdata.locations == null)
                        {
                            pdata.types = [];
                            pdata.locations = [];
                            pdata.uniformSize = pdata.uniformNameList.length;
                            for(i = 0; i < pdata.uniformSize; ++i)
                            {
                                pdata.types.push( shdp.getUniformTypeByNS(pdata.uniformNameList[i]) );
                                pdata.locations.push( shdp.getUniformLocationByNS(pdata.uniformNameList[i]) );
                            }
                            //console.log("global uniform names: "+pdata.uniformNameList);
                            //console.log("global uniform types: "+pdata.types);
                            //console.log("global uniform locations: "+pdata.locations);
                        }
                        pdata = pdata.next;
                    }
                }
                return guniform;                
            }
            private static s_emptyUniform:ShaderUniform = new ShaderUniform();
            static BuildLocalFromTransformV(transformData:Float32Array, shdp:ShaderProgram):IShaderUniform
            {
                if(transformData != null)
                {
                    let shdUniform:ShaderUniform;
                    if(RendererDeviece.IsWebGL1())
                    {
                        shdUniform = new ShaderUniformV1();
                    }
                    else
                    {
                        shdUniform = new ShaderUniformV2();
                    }
                    shdUniform.uniformSize = 0;
                    shdUniform.uniformNameList = [];
                    shdUniform.types = [];
                    shdUniform.locations = [];
                    shdUniform.dataList = [];
                    shdUniform.dataSizeList = [];
                    shdUniform.uniformSize += 1;
                    shdUniform.uniformNameList.push( "u_objMat" );
                    shdUniform.types.push( shdp.getUniformTypeByNS("u_objMat") );
                    shdUniform.locations.push( shdp.getUniformLocationByNS("u_objMat") );
                    shdUniform.dataList.push(transformData);
                    shdUniform.dataSizeList.push(1);                    
                    return shdUniform;
                }
                return ShdUniformTool.s_emptyUniform;
            }
            static BuildLocalFromData(uniformData:ShaderUniformData, shdp:ShaderProgram):IShaderUniform
            {
                // collect all uniform data,create a new runned uniform
                let shdUniform:ShaderUniform;
                if(RendererDeviece.IsWebGL1())
                {
                    shdUniform = new ShaderUniformV1();
                }
                else
                {
                    shdUniform = new ShaderUniformV2();
                }
                shdUniform.uniformNameList = [];
                shdUniform.types = [];
                shdUniform.locations = [];
                shdUniform.dataList = [];
                shdUniform.dataSizeList = [];
                shdUniform.uniformSize = 0;
                let pdata:ShaderUniformData = uniformData;
                let i:number = 0;
                while(pdata != null)
                {
                    if(pdata.uniformNameList != null && pdata.locations == null)
                    {
                        shdUniform.uniformSize += pdata.uniformNameList.length;
                        for(i = 0; i < shdUniform.uniformSize; ++i)
                        {
                            shdUniform.uniformNameList.push( pdata.uniformNameList[i] );
                            shdUniform.types.push( shdp.getUniformTypeByNS(pdata.uniformNameList[i]) );
                            shdUniform.locations.push( shdp.getUniformLocationByNS(pdata.uniformNameList[i]) );
                            shdUniform.dataList.push(pdata.dataList[i]);
                            shdUniform.dataSizeList.push(pdata.dataSizeList[i]);
                        }
                        //  console.log("local uniform frome data names: "+shdUniform.uniformNameList);
                        //  console.log("local uniform frome data types: "+shdUniform.types);
                        //  console.log("local uniform frome data locations: "+shdUniform.locations);
                    }
                    pdata = pdata.next;
                }
                return shdUniform;
            }
            static BuildLocal(sUniform:ShaderUniform, shdp:ShaderProgram):ShaderUniform
            {
                // collect all uniform data,create a new runned uniform
                let shdUniform:ShaderUniform = new ShaderUniform();
                shdUniform.uniformNameList = [];
                shdUniform.types = [];
                shdUniform.locations = [];
                shdUniform.dataList = [];
                shdUniform.dataSizeList = [];
                shdUniform.uniformSize = 0;

                let pdata:ShaderUniform = sUniform;
                let i:number = 0;
                while(pdata != null)
                {
                    if(pdata.uniformNameList != null && pdata.locations == null)
                    {
                        shdUniform.uniformSize += pdata.uniformNameList.length;
                        for(i = 0; i < shdUniform.uniformSize; ++i)
                        {
                            shdUniform.uniformNameList.push( pdata.uniformNameList[i] );
                            shdUniform.types.push( shdp.getUniformTypeByNS(pdata.uniformNameList[i]) );
                            shdUniform.locations.push( shdp.getUniformLocationByNS(pdata.uniformNameList[i]) );
                            shdUniform.dataList.push(pdata.dataList[i]);
                            shdUniform.dataSizeList.push(pdata.dataSizeList[i]);
                        }
                        //  console.log("local uniform names: "+shdUniform.uniformNameList);
                        //  console.log("local uniform types: "+shdUniform.types);
                        //  console.log("local uniform locations: "+shdUniform.locations);
                    }
                    pdata = pdata.next;
                }
                return shdUniform;
            }
        }
    }
}