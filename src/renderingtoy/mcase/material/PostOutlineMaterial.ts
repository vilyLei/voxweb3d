/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
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
        
        this.m_uniform.addDiffuseMap();
        coder.addFragUniform("vec4", "u_texParam");
        coder.addFragUniform("vec4", "u_params", 3);

        coder.addVarying("vec2", "v_uv");

        coder.useVertSpaceMats(false, false, false);

        this.m_coder.addFragMainCode(
`
const float factor = 1.0 / 9.0;
const float floatReciprocalGamma = (1.0 / 2.2);
void main() {
    
    vec4 param = u_params[0];
    vec2 dv = param.ww / param.xy;
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

    // float fk = 1.0 - step(dis, 0.0001);
    // FragColor0 = vec4(vec3(fk), fk);
    // return;
    float fa = u_params[2].x;
    fa = (1.0 - srcColor.y) * (1.0 - fa) + fa;

    dis *= param.z;
    dis = pow(dis * dis * dis, floatReciprocalGamma);

    param = u_params[1];
    param.w *= dis * fa;
    FragColor0 = param;
    //FragColor0 = vec4(srcColor.xyz, 1.0);
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
    private m_params: Float32Array = new Float32Array([
        32.0,32.0,1.3,2.0,
        1.0,1.0,1.0,1.0,     // color rgba
        0.2,0.0,0.0,0.0      // occlusion density, undefined,undefined,undefined
    ]);
    //private m_color: Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);

    setThickness( thickness: number ): void {
        this.m_params[3] = MathConst.Clamp(thickness, 0.1, 5.0);
    }
    setDensity( density: number ): void {
        this.m_params[2] = MathConst.Clamp(density, 0.1, 5.0);
    }
    setOcclusionDensity(density: number): void {
        this.m_params[8] = MathConst.Clamp(density, 0.0, 1.0);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_params[4] = pr;
        this.m_params[5] = pg;
        this.m_params[6] = pb;
    }
    setAlpha(pa: number): void {
        this.m_params[7] = pa;
    }
    setTexSize(width: number, height: number): void {
        this.m_params[0] = width;
        this.m_params[1] = height;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_params];
        return oum;
    }
}