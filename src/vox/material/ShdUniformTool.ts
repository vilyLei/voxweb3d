/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import IShdProgram from "../../vox/material/IShdProgram";
import IShaderUniformData from "../../vox/material/IShaderUniformData";
import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";
import { ShaderUniform, ShaderUniformV1, ShaderUniformV2, ShaderMat4Uniform } from "../../vox/material/ShaderUniform";
import IUniformBuilder from "../../vox/material/shared/IUniformBuilder";
import CameraUniformBuilder from "../../vox/material/shared/CameraUniformBuilder";
import StageParamUniformBuilder from "../../vox/material/shared/StageParamUniformBuilder";
import FrustumUniformBuilder from "../../vox/material/shared/FrustumUniformBuilder";
import CameraPosUniformBuilder from "../../vox/material/shared/CameraPosUniformBuilder";
import ViewParamUniformBuilder from "../../vox/material/shared/ViewParamUniformBuilder";
import IRenderShader from "../../vox/render/IRenderShader";
import RenderProxy from "../../vox/render/RenderProxy";

class EmptyShdUniform extends ShaderUniform implements IRenderShaderUniform {
    static EmptyUniform: EmptyShdUniform = new EmptyShdUniform();
    use(rc: IRenderShader): void {}
    useByLocation(rc: IRenderShader, type: number, location: any, i: number): void {}
    useByShd(rc: IRenderShader, shd: IShdProgram): void {}
    updateData(): void {}
    destroy(): void {}
}

export default class ShdUniformTool {

    private m_initFlag: boolean = true;
    private m_uniformDict: Map<string, IUniformBuilder> = new Map();
    private m_builders: IUniformBuilder[] = [];
    private m_buildersTot: number = 0;
    private m_emptyUniform: ShaderUniform = new ShaderUniform();
	clear(): void {
		this.m_uniformDict.clear();
	}
    private appendUniformBuilder(builder: IUniformBuilder): void {

        if(!this.m_uniformDict.has(builder.getIDNS())) {
            this.m_builders.push(builder);
            this.m_uniformDict.set(builder.getIDNS(), builder);
            this.m_buildersTot = this.m_builders.length;
        }
    }

    initialize(): void {
        if (this.m_initFlag) {
            this.m_initFlag = false;

            this.appendUniformBuilder( new CameraUniformBuilder() );
            this.appendUniformBuilder( new FrustumUniformBuilder() );
            this.appendUniformBuilder( new CameraPosUniformBuilder() );

            this.appendUniformBuilder( new StageParamUniformBuilder() );
            this.appendUniformBuilder( new ViewParamUniformBuilder() );
        }
    }
    addSharedUniformBuilder(builder: IUniformBuilder): void {
        if (builder != null && !this.m_uniformDict.has(builder.getIDNS())) {
            this.m_builders.push(builder);
            this.m_uniformDict.set(builder.getIDNS(), builder);
            ++this.m_buildersTot;
        }
    }
    removeSharedUniformBuilder(builder: IUniformBuilder): void {
        if (builder != null && this.m_uniformDict.has(builder.getIDNS())) {
            for (let i: number = 0; i < this.m_buildersTot; ++i) {
                if (builder == this.m_builders[i]) {
                    this.m_builders.splice(i, 1);
                    --this.m_buildersTot;
                    break;
                }
            }
            this.m_uniformDict.delete(builder.getIDNS());
        }
    }
    removeSharedUniformBuilderByName(builderNS: string): void {
        if (this.m_uniformDict.has(builderNS)) {
            let builder: IUniformBuilder = this.m_uniformDict.get(builderNS);
            for (let i: number = 0; i < this.m_buildersTot; ++i) {
                if (builder == this.m_builders[i]) {
                    this.m_builders.splice(i, 1);
                    --this.m_buildersTot;
                    break;
                }
            }
            this.m_uniformDict.delete(builderNS);
        }
    }
    buildShared(guniforms: ShaderUniform[], rc: RenderProxy, shdp: IShdProgram): ShaderUniform {
        let guniform: ShaderUniform;
        let headU: ShaderUniform = null;
        let prevU: ShaderUniform = null;
        let builders: IUniformBuilder[] = this.m_builders;
        let i: number = 0;
        let len: number = this.m_buildersTot;
        let puo: ShaderUniform = null;
        for (; i < len; ++i) {
            puo = builders[i].create(rc, shdp) as ShaderUniform;
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
						// let ul = shdp.getUniformLocationByNS(pdata.uniformNameList[i]);
                        // pdata.locations.push(ul);
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
    buildLocalFromTransformV(transformData: Float32Array, shdp: IShdProgram): IRenderShaderUniform {
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
        return this.m_emptyUniform;
    }
    updateLocalFromTransformV(dstUniform: IRenderShaderUniform, transformData: Float32Array, shdp: IShdProgram): IRenderShaderUniform {
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
        return this.m_emptyUniform;
    }
    buildLocalFromData(uniformData: IShaderUniformData, shdp: IShdProgram): IRenderShaderUniform {
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
            let pdata: IShaderUniformData = uniformData;
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
}
