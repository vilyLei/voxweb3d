/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import ShdProgram from "../../vox/material/ShdProgram";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import IShaderUniform from "../../vox/material/IShaderUniform";
import { ShaderUniform, ShaderUniformV1, ShaderUniformV2, ShaderMat4Uniform } from "../../vox/material/ShaderUniform";
import IUniformBuilder from "../../vox/material/shared/IUniformBuilder";
import CameraUniformBuilder from "../../vox/material/shared/CameraUniformBuilder";
import StageParamUniformBuilder from "../../vox/material/shared/StageParamUniformBuilder";
import FrustumUniformBuilder from "../../vox/material/shared/FrustumUniformBuilder";
import CameraPosUniformBuilder from "../../vox/material/shared/CameraPosUniformBuilder";
import ViewParamUniformBuilder from "../../vox/material/shared/ViewParamUniformBuilder";
import IRenderShader from "../../vox/render/IRenderShader";
import RenderProxy from "../../vox/render/RenderProxy";

class EmptyShdUniform extends ShaderUniform implements IShaderUniform {
    static EmptyUniform: EmptyShdUniform = new EmptyShdUniform();
    use(rc: IRenderShader): void {
    }
    useByLocation(rc: IRenderShader, type: number, location: any, i: number): void {
    }
    useByShd(rc: IRenderShader, shd: ShdProgram): void {
    }
    updateData(): void {
    }
    destroy(): void {
    }
}

export default class ShdUniformTool {
    private static s_initBoo: boolean = true;
    private static s_uniformDict: Map<string, IUniformBuilder> = new Map();
    private static s_builders: IUniformBuilder[] = [];
    private static s_buildersTot: number = 0;

    private static appendUniformBuilder(builder: IUniformBuilder): void {

        if(!ShdUniformTool.s_uniformDict.has(builder.getIDNS())) {
            ShdUniformTool.s_builders.push(builder);
            ShdUniformTool.s_uniformDict.set(builder.getIDNS(), builder);
            ShdUniformTool.s_buildersTot = ShdUniformTool.s_builders.length;
        }
    }
    static Initialize(): void {
        if (ShdUniformTool.s_initBoo) {
            ShdUniformTool.s_initBoo = false;
            
            ShdUniformTool.appendUniformBuilder( new CameraUniformBuilder() );
            ShdUniformTool.appendUniformBuilder( new FrustumUniformBuilder() );
            ShdUniformTool.appendUniformBuilder( new CameraPosUniformBuilder() );

            ShdUniformTool.appendUniformBuilder( new StageParamUniformBuilder() );
            ShdUniformTool.appendUniformBuilder( new ViewParamUniformBuilder() );            
        }
    }
    static AddSharedUniformBuilder(builder: IUniformBuilder): void {
        if (builder != null && !ShdUniformTool.s_uniformDict.has(builder.getIDNS())) {
            ShdUniformTool.s_builders.push(builder);
            ShdUniformTool.s_uniformDict.set(builder.getIDNS(), builder);
            ++ShdUniformTool.s_buildersTot;
        }
    }
    static removeSharedUniformBuilder(builder: IUniformBuilder): void {
        if (builder != null && ShdUniformTool.s_uniformDict.has(builder.getIDNS())) {
            for (let i: number = 0; i < ShdUniformTool.s_buildersTot; ++i) {
                if (builder == ShdUniformTool.s_builders[i]) {
                    ShdUniformTool.s_builders.splice(i, 1);
                    --ShdUniformTool.s_buildersTot;
                    break;
                }
            }
            ShdUniformTool.s_uniformDict.delete(builder.getIDNS());
        }
    }
    static removeSharedUniformBuilderByName(builderNS: string): void {
        if (ShdUniformTool.s_uniformDict.has(builderNS)) {
            let builder: IUniformBuilder = ShdUniformTool.s_uniformDict.get(builderNS);
            for (let i: number = 0; i < ShdUniformTool.s_buildersTot; ++i) {
                if (builder == ShdUniformTool.s_builders[i]) {
                    ShdUniformTool.s_builders.splice(i, 1);
                    --ShdUniformTool.s_buildersTot;
                    break;
                }
            }
            ShdUniformTool.s_uniformDict.delete(builderNS);
        }
    }
    static BuildShared(guniforms: ShaderUniform[], rc: RenderProxy, shdp: ShdProgram): ShaderUniform {
        let guniform: ShaderUniform;
        let headU: ShaderUniform = null;
        let prevU: ShaderUniform = null;
        let builders: IUniformBuilder[] = ShdUniformTool.s_builders;
        let i: number = 0;
        let len: number = ShdUniformTool.s_buildersTot;
        let puo: ShaderUniform = null;
        for (; i < len; ++i) {
            puo = builders[i].create(rc, shdp);
            if (puo != null) {
                if (prevU != null) {
                    prevU.next = puo;
                }
                else if (headU == null) {
                    headU = puo;
                }
                prevU = puo;
            }
        }

        if (guniforms == null) {
            guniform = headU;
        }
        else if (headU != null) {
            for (let i: number = 0; i < guniforms.length; ++i) {
                prevU.next = guniforms[i];
                prevU = prevU.next;
            }
            guniform = headU;
        }

        if (guniform == null) {
            guniform = EmptyShdUniform.EmptyUniform;
        }
        else {
            // normalize uniform
            let pdata: ShaderUniform = guniform;
            //  let boo: boolean = false;
            //  if(pdata.uns == "u_projMat") {
            //      boo = true;
            //      console.log("u_projMat global build begin pdata.uns: ",pdata.uns);
            //  }
            let i: number = 0;
            while (pdata != null) {
                //  if(boo) {
                //      console.log("### u_projMat global build...pdata.uns: ",pdata.uns);
                //  }
                if (pdata.uniformNameList != null && pdata.locations == null) {
                    pdata.types = [];
                    pdata.locations = [];
                    pdata.uniformSize = pdata.uniformNameList.length;
                    for (i = 0; i < pdata.uniformSize; ++i) {
                        pdata.types.push(shdp.getUniformTypeByNS(pdata.uniformNameList[i]));
                        pdata.locations.push(shdp.getUniformLocationByNS(pdata.uniformNameList[i]));
                    }
                    //console.log("global uniform names: "+pdata.uniformNameList);
                    //console.log("global uniform types: "+pdata.types);
                    //console.log("global uniform locations: "+pdata.locations);

                }
                pdata = pdata.next;
            }
            //  if(boo) {
            //      console.log("u_projMat global build end pdata.uns: u_projMat.");
            //  }
        }
        return guniform;
    }
    private static s_emptyUniform: ShaderUniform = new ShaderUniform();
    static BuildLocalFromTransformV(transformData: Float32Array, shdp: ShdProgram): IShaderUniform {
        if (transformData != null) {
            let shdUniform: ShaderUniform;
            shdUniform = new ShaderMat4Uniform();
            shdUniform.uniformSize = 0;
            shdUniform.uniformNameList = [];
            shdUniform.types = [];
            shdUniform.locations = [];
            shdUniform.dataList = [];
            shdUniform.dataSizeList = [];
            shdUniform.uniformSize += 1;
            shdUniform.uniformNameList.push("u_objMat");
            shdUniform.types.push(shdp.getUniformTypeByNS("u_objMat"));
            shdUniform.locations.push(shdp.getUniformLocationByNS("u_objMat"));
            shdUniform.dataList.push(transformData);
            shdUniform.dataSizeList.push(1);
            return shdUniform;
        }
        return ShdUniformTool.s_emptyUniform;
    }
    static UpdateLocalFromTransformV(dstUniform: IShaderUniform, transformData: Float32Array, shdp: ShdProgram): IShaderUniform {
        if (transformData != null) {
            let shdUniform: ShaderUniform;
            let srcUniform: ShaderMat4Uniform = dstUniform as ShaderMat4Uniform;
            if (srcUniform == null) {
                srcUniform = new ShaderMat4Uniform();
                shdUniform = srcUniform;
                shdUniform.uniformSize = 0;
                shdUniform.uniformNameList = [];
                shdUniform.types = [];
                shdUniform.locations = [];
                shdUniform.dataList = [];
                shdUniform.dataSizeList = [];
                shdUniform.uniformSize += 1;
                shdUniform.uniformNameList.push("u_objMat");
                shdUniform.types.push(shdp.getUniformTypeByNS("u_objMat"));
                shdUniform.locations.push(shdp.getUniformLocationByNS("u_objMat"));
                shdUniform.dataList.push(transformData);
                shdUniform.dataSizeList.push(1);
            } else {
                shdUniform = srcUniform;
                shdUniform.locations = [];
                shdUniform.locations.push(shdp.getUniformLocationByNS("u_objMat"));
            }
            return shdUniform;
        }
        return ShdUniformTool.s_emptyUniform;
    }
    static BuildLocalFromData(uniformData: ShaderUniformData, shdp: ShdProgram): IShaderUniform {
        if (uniformData != null) {
            // collect all uniform data,create a new runned uniform
            let shdUniform: ShaderUniform;
            if (RendererDevice.IsWebGL1()) {
                shdUniform = new ShaderUniformV1();
            }
            else {
                shdUniform = new ShaderUniformV2();
            }
            shdUniform.uns = uniformData.uns;
            shdUniform.uniformNameList = [];
            shdUniform.types = [];
            shdUniform.locations = [];
            shdUniform.dataList = [];
            shdUniform.dataSizeList = [];
            shdUniform.uniformSize = 0;
            let pdata: ShaderUniformData = uniformData;
            let i: number = 0;
            while (pdata != null) {
                if (pdata.uniformNameList != null && pdata.locations == null) {
                    shdUniform.uniformSize += pdata.uniformNameList.length;
                    for (i = 0; i < shdUniform.uniformSize; ++i) {
                        shdUniform.uniformNameList.push(pdata.uniformNameList[i]);
                        shdUniform.types.push(shdp.getUniformTypeByNS(pdata.uniformNameList[i]));
                        shdUniform.locations.push(shdp.getUniformLocationByNS(pdata.uniformNameList[i]));
                        shdUniform.dataList.push(pdata.dataList[i]);
                        shdUniform.dataSizeList.push(shdp.getUniformLengthByNS(pdata.uniformNameList[i]));
                    }
                    // console.log("local uniform frome data names: ",shdUniform.uniformNameList);
                    // console.log("local uniform frome data types: ",shdUniform.types);
                    // console.log("local uniform frome data locations: ",shdUniform.locations);
                    // console.log("local uniform frome data dataSizeList: ",shdUniform.dataSizeList);
                }
                pdata = pdata.next;
            }
            return shdUniform;
        }
        return EmptyShdUniform.EmptyUniform;
    }
    static BuildLocal(sUniform: ShaderUniform, shdp: ShdProgram): ShaderUniform {
        // collect all uniform data,create a new runned uniform
        let shdUniform: ShaderUniform = new ShaderUniform();
        shdUniform.uniformNameList = [];
        shdUniform.types = [];
        shdUniform.locations = [];
        shdUniform.dataList = [];
        shdUniform.dataSizeList = [];
        shdUniform.uniformSize = 0;
        let pdata: ShaderUniform = sUniform;
        let i: number = 0;
        while (pdata != null) {
            if (pdata.uniformNameList != null && pdata.locations == null) {
                shdUniform.uniformSize += pdata.uniformNameList.length;
                for (i = 0; i < shdUniform.uniformSize; ++i) {
                    shdUniform.uniformNameList.push(pdata.uniformNameList[i]);
                    shdUniform.types.push(shdp.getUniformTypeByNS(pdata.uniformNameList[i]));
                    shdUniform.locations.push(shdp.getUniformLocationByNS(pdata.uniformNameList[i]));
                    shdUniform.dataList.push(pdata.dataList[i]);
                    shdUniform.dataSizeList.push(shdp.getUniformLengthByNS(pdata.uniformNameList[i]));
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