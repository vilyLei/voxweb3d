/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IShaderUniformT from "../../vox/material/IShaderUniform";
import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";
import * as MaterialConstT from "../../vox/material/MaterialConst";
import * as ShdProgramT from "../../vox/material/ShdProgram";
import * as IRenderShaderT from "../../vox/render/IRenderShader";

import IShaderUniform = IShaderUniformT.vox.material.IShaderUniform;
import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import ShdProgram = ShdProgramT.vox.material.ShdProgram;
import IRenderShader = IRenderShaderT.vox.render.IRenderShader;

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
            useByLocation(rc:IRenderShader,type:number,location:any,i:number):void{}
            useByShd(rc:IRenderShader,shd:ShdProgram):void{}
            use(rc:IRenderShader):void{}
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
            
            use(rc:IRenderShader):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useUniformV1(this.locations[i],this.types[i],this.dataList[i],this.dataSizeList[i]);
                }
            }
            useByLocation(rc:IRenderShader,type:number,location:any,i:number):void
            {
                rc.useUniformV1(location,type,this.dataList[i],this.dataSizeList[i]);
            }
            useByShd(rc:IRenderShader,shd:ShdProgram):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useUniformV1(shd.getUniformLocationByNS(this.uniformNameList[i]),shd.getUniformTypeByNS(this.uniformNameList[i]),this.dataList[i],this.dataSizeList[i]);
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
            use(rc:IRenderShader):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useUniformV2(this.locations[i],this.types[i],this.dataList[i],this.dataSizeList[i],0);
                }
            }
            useByLocation(rc:IRenderShader,type:number,location:any,i:number):void
            {
                rc.useUniformV2(location,type,this.dataList[i],this.dataSizeList[i],0);
            }
            useByShd(rc:IRenderShader,shd:ShdProgram):void
            {
                let i:number = 0;
                for(; i < this.uniformSize; ++i)
                {
                    rc.useUniformV2(shd.getUniformLocationByNS(this.uniformNameList[i]),shd.getUniformTypeByNS(this.uniformNameList[i]),this.dataList[i],this.dataSizeList[i],0);
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