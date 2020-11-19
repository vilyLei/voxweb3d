/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";
import * as ShaderProgramT from "../../vox/material/ShaderProgram";
import * as RenderProxyT from "../../vox/render/RenderProxy";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
import ShaderProgram = ShaderProgramT.vox.material.ShaderProgram;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export class ShaderUniform implements IShaderUniform
        {
            constructor()
            {
            }
            types:number[] = null;
            uniformSize:number = 0;
            uniformNameList:string[] = null;
            locations:any[] = null;
            dataSizeList:number[] = null;
            dataList:Float32Array[] = null;
            calcModels:any[] = null;
            always:boolean = true;
            next:ShaderUniform = null;
            // for fast data's operation
            getDataRefFromUniformName(ns:string):Float32Array
            {
                if(this.uniformNameList != null)
                {
                    let list:string[] = this.uniformNameList;
                    let len:number = list.length;
                    for(let i:number = 0; i < len; ++i)
                    {
                        if(ns == list[i])
                        {
                            return this.dataList[i];
                        }
                    }
                }
                return null;
            }
            // for fast data's operation
            setDataRefFromUniformName(ns:string,dataRef:Float32Array):void
            {
                if(this.uniformNameList != null)
                {
                    let list:string[] = this.uniformNameList;
                    let len:number = list.length;
                    for(let i:number = 0; i < len; ++i)
                    {
                        if(ns == list[i])
                        {
                            this.dataList[i] = dataRef;
                            break;
                        }
                    }
                }
            }
            copyDataFromProbe(probe:ShaderUniformProbe):void
            {
                this.types = [];
                this.dataSizeList = [];
                for(let i:number = 0; i < probe.uniformSlotSize; ++i)
                {
                    this.types.push( probe.uniformTypes[i] );
                    this.dataSizeList.push( probe.dataSizeList[i] );
                }
                this.uniformSize = probe.uniformSlotSize;
            }
            useByLocation(rc:RenderProxy,type:number,location:any,i:number):void{}
            useByShd(rc:RenderProxy,shd:ShaderProgram):void{}
            use(rc:RenderProxy):void{}
            updateData():void{}
            destroy():void{}
        }
        // for webgl1
        export class ShaderUniformV1 extends ShaderUniform
        {
            constructor()
            {
                super();
            }
            use(rc:RenderProxy):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useByLocationV1(this.locations[i],this.types[i],this.dataList[i],this.dataSizeList[i]);
                }
            }
            useByLocation(rc:RenderProxy,type:number,location:any,i:number):void
            {
                rc.useByLocationV1(location,type,this.dataList[i],this.dataSizeList[i]);
            }
            useByShd(rc:RenderProxy,shd:ShaderProgram):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useByLocationV1(shd.getUniformLocationByNS(this.uniformNameList[i]),shd.getUniformTypeByNS(this.uniformNameList[i]),this.dataList[i],this.dataSizeList[i]);
                }
            }
            updateData():void
            {
                if(this.calcModels != null)
                {
                    let len:number = this.calcModels.length;
                    let model:any = null;
                    for(let i:number = 0; i < len; ++i)
                    {
                        model = this.calcModels[i];
                        model.buildData();
                        model.updateMaterialDataList( this.dataList );
                        model.initializeParam();
                    }
                }
            }
            destroy():void
            {
                let i:number = 0;
                let len:number = this.dataList.length;
                for(; i < len; ++i)
                {
                    this.dataList[i] = null;
                }
                if(this.calcModels != null)
                {
                    len = this.calcModels.length;
                    for(i = 0; i < len; ++i)
                    {
                        this.calcModels[i].destroy();
                        this.calcModels[i] = null;
                    }
                }
                this.dataList = null;
                this.types = null;
                this.locations = null;
                this.dataSizeList = null;
                this.calcModels = null;
            }
        }

        // for webgl2
        export class ShaderUniformV2 extends ShaderUniform
        {
            constructor()
            {
                super();
            }
            use(rc:RenderProxy):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useByLocationV2(this.locations[i],this.types[i],this.dataList[i],this.dataSizeList[i],0);
                }
            }
            useByLocation(rc:RenderProxy,type:number,location:any,i:number):void
            {
                rc.useByLocationV2(location,type,this.dataList[i],this.dataSizeList[i],0);
            }
            useByShd(rc:RenderProxy,shd:ShaderProgram):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useByLocationV2(shd.getUniformLocationByNS(this.uniformNameList[i]),shd.getUniformTypeByNS(this.uniformNameList[i]),this.dataList[i],this.dataSizeList[i],0);
                }
            }
            updateData():void
            {
                if(this.calcModels != null)
                {
                    let len:number = this.calcModels.length;
                    let model:any = null;
                    for(let i:number = 0; i < len; ++i)
                    {
                        model = this.calcModels[i];
                        model.buildData();
                        model.updateMaterialDataList( this.dataList );
                        model.initializeParam();
                    }
                }
            }
            destroy():void
            {
                let i:number = 0;
                let len:number = this.dataList.length;
                for(; i < len; ++i)
                {
                    this.dataList[i] = null;
                }
                if(this.calcModels != null)
                {
                    len = this.calcModels.length;
                    for(i = 0; i < len; ++i)
                    {
                        this.calcModels[i].destroy();
                        this.calcModels[i] = null;
                    }
                }
                this.dataList = null;
                this.types = null;
                this.locations = null;
                this.dataSizeList = null;
                this.calcModels = null;
            }
        }
    }
}