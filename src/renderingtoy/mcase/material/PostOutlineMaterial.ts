/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import MathConst from "../../../vox/math/MathConst";

class PostOutlineShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PostOutlineShaderBuffer = new PostOutlineShaderBuffer();
    private m_uniqueName: string = "";
    
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("PostOutlineShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "PostOutlineShd";
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {

        let coder = this.m_coder;
        
        coder.addDiffuseMap();
        coder.addFragUniform("vec4", "u_texParam");
        coder.addFragUniform("vec4", "u_color");

        coder.addVarying("vec2", "v_uv");

        coder.useVertSpaceMats(false, false, false);

        this.m_coder.addFragMainCode(
`
const float factor = 1.0 / 9.0;
const float floatReciprocalGamma = (1.0 / 2.2);
void main() {
    
    vec2 dv = u_texParam.ww / u_texParam.xy;
    vec4 srcColor = VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv );

    float fc = srcColor.x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv + dv ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv - dv ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv + vec2(dv.x ,-dv.y) ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv + vec2(-dv.x ,dv.y) ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv + vec2(dv.x ,0) ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv + vec2(0 ,dv.y) ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv - vec2(dv.x ,0) ).x;
    fc += VOX_Texture2D( VOX_DIFFUSE_MAP, v_uv - vec2(0 ,dv.y) ).x;
    fc *= factor;
    
    float dis = abs(fc - srcColor.x);
    dis *= u_texParam.z;
    dis = pow(dis * dis * dis, floatReciprocalGamma);
    FragColor0 = vec4(u_color.xyz, dis * u_color.w);
}
`
                    );

        this.m_coder.addVertMainCode(
`
void main() {
    gl_Position = vec4(a_vs, 1.0);
    v_uv = a_uvs.xy;
}
`
                    );
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[PostOutlineShaderBuffer()]";
    }
    static GetInstance(): PostOutlineShaderBuffer {
        return PostOutlineShaderBuffer.s_instance;
    }
}

export default class PostOutlineMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: PostOutlineShaderBuffer = PostOutlineShaderBuffer.GetInstance();
        return buf;
    }
    private m_texParam: Float32Array = new Float32Array([32.0,32.0,1.3,2.0]);
    private m_color: Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);

    setThickness( thickness: number ): void {
        this.m_texParam[3] = MathConst.Clamp(thickness, 0.1, 5.0);
    }
    setDensity( density: number ): void {
        this.m_texParam[2] = MathConst.Clamp(density, 0.1, 5.0);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_color[0] = pr;
        this.m_color[1] = pg;
        this.m_color[2] = pb;
    }
    setTexSize(width: number, height: number): void {
        this.m_texParam[0] = width;
        this.m_texParam[1] = height;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_texParam", "u_color"];
        oum.dataList = [this.m_texParam, this.m_color];
        return oum;
    }
}