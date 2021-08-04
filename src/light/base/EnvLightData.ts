/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformConst from "../../vox/material/UniformConst";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import IShaderCodeBuilder from "../../vox/material/code/IShaderCodeBuilder";
import { EnvShaderCode } from "../material/EnvShaderCode";

export default class EnvLightData {

    private m_uid: number = -1;
    static s_uid: number = 0;
    private m_uProbe: ShaderUniformProbe = null;
    private m_suo:ShaderGlobalUniform = null;
    private m_dirty: boolean = false;
    private m_uslotIndex: number = 0;

    constructor(slotIndex: number = 0) {
        this.m_uslotIndex = slotIndex;
        this.m_uid = EnvLightData.s_uid ++;
    }
    getUid(): number {
        return this.m_uid;
    }
    setAmbientColorRGB3f(pr: number, pg: number, pb: number):void {
        let data: Float32Array = UniformConst.EnvLightParams.data;
        data[0] = pr;
        data[1] = pg;
        data[2] = pb;
        this.m_dirty = true;
    }
    setFogColorRGB3f(pr: number, pg: number, pb: number):void {
        let data: Float32Array = UniformConst.EnvLightParams.data;
        data[8] = pr;
        data[9] = pg;
        data[10] = pb;
        this.m_dirty = true;
    }
    setFogDensity(density: number):void {
        UniformConst.EnvLightParams.data[11] = density;
        this.m_dirty = true;
    }
    setFogNear(near: number):void {
        UniformConst.EnvLightParams.data[6] = near;
        this.m_dirty = true;
    }
    setFogFar(far: number):void {
        UniformConst.EnvLightParams.data[7] = far;
        this.m_dirty = true;
    }
    
    useUniforms(builder: IShaderCodeBuilder): void {
        if (this.m_uProbe != null) {
            builder.addFragUniformParam(UniformConst.EnvLightParams);
        }
    }
    useUniformsForFog(builder: IShaderCodeBuilder,fogExp2Enabled: boolean = true): void {
        if (this.m_uProbe != null) {
            builder.addFragUniformParam(UniformConst.EnvLightParams);
            builder.addDefine("VOX_USE_FOG", "1");
            if(fogExp2Enabled) {
                builder.addDefine("VOX_FOG_EXP2", "1");
            }
            builder.addVarying("float", "v_fogDepth");
            builder.addFragFunction( EnvShaderCode.frag_head );
            builder.addVertFunction( EnvShaderCode.vert_head );
        }
    }
    initialize(): void {

        if (this.m_uProbe == null) {
            /*
            
            readonly data: Float32Array = new Float32Array([

                0.1, 0.1, 0.1,              // ambient factor x,y,z
                1.0,                        // scatterIntensity

                1.0,                        // tone map exposure
                0.1,                        // reflectionIntensity
                600.0,                      // fogNear
                3500.0,                     // fogFar

                0.3,0.0,0.9,                // fog color(r, g, b)
                0.0005,                     // fog density

            ]);
            */
            this.m_uProbe = new ShaderUniformProbe();
            this.m_uProbe.bindSlotAt(this.m_uslotIndex);
            this.m_uProbe.addVec4Data(UniformConst.EnvLightParams.data, UniformConst.EnvLightParams.arrayLength);
            //this.m_uProbe.addVec4Data(this.m_data, 2);
            
            this.m_suo = new ShaderGlobalUniform();
            this.m_suo.uniformNameList = [UniformConst.EnvLightParams.name];
            this.m_suo.copyDataFromProbe( this.m_uProbe );

            this.m_uProbe.update();

        }
    }
    update(): void {
        if(this.m_uProbe != null && this.m_dirty) {
            this.m_dirty = false;
            this.m_uProbe.update();
        }
    }
    getGlobalUinform(): ShaderGlobalUniform {
        return this.m_suo.clone();
    }
}