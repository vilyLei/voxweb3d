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

class OcclusionPostOutlineShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: OcclusionPostOutlineShaderBuffer = new OcclusionPostOutlineShaderBuffer();
    private m_uniqueName: string = "";
    screenPlaneEnabled: boolean = true;
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("OcclusionPostOutlineShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "OcclusionPostOutlineShd";
        this.m_uniqueName += this.screenPlaneEnabled ? "Plane" : "Polyhedral";
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {

        let coder = this.m_coder;
        
        this.m_uniform.addDiffuseMap();
        coder.addFragUniform("vec4", "u_params", 3);

        if(this.screenPlaneEnabled) {
            coder.addDefine("VOX_SCREEN_PLANE", "1");
            coder.useVertSpaceMats(false, false, false);
        }

        this.m_coder.addFragMainCode(
`
const float factor = 1.0 / 9.0;
const float floatReciprocalGamma = (1.0 / 2.2);
void main() {

    vec4 param = u_params[0];

    #ifdef VOX_SCREEN_PLANE
        vec2 puv = v_uv.xy;
    #else
        vec2 puv = gl_FragCoord.xy/param.xy;
    #endif
    
    vec2 dv = param.ww / param.xy;
    vec4 srcColor = VOX_Texture2D( VOX_DIFFUSE_MAP, puv );
    vec2 fc = srcColor.xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv + dv ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv - dv ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv + vec2(dv.x ,-dv.y) ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv + vec2(-dv.x ,dv.y) ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv + vec2(dv.x ,0) ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv + vec2(0 ,dv.y) ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv - vec2(dv.x ,0) ).xy;
    fc.xy += VOX_Texture2D( VOX_DIFFUSE_MAP, puv - vec2(0 ,dv.y) ).xy;
    fc.xy *= factor;
    
    float dis = abs(fc.x - srcColor.x);

    float fk = step(max(fc.y, srcColor.y), 0.0001);
    float fa = u_params[2].x;
    fa += (1.0 - fk) * (1.0 - fa);

    dis *= param.z;
    dis = pow(dis * dis * dis, floatReciprocalGamma);

    param = u_params[1];
    param.w *= dis * fa;
    FragColor0 = param;
    //FragColor0 += vec4(0.0,0.2,0.0,0.3);
    // for test
    //FragColor0 = vec4(vec3(1.0,1.0,0.0), 1.0);
}
`
                    );

        this.m_coder.addVertMainCode(
`
void main() {
    #ifdef VOX_SCREEN_PLANE
        gl_Position = vec4(a_vs, 1.0);
        v_uv = a_uvs.xy;
    #else
        gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs, 1.0);
    #endif
}
`
                    );
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[OcclusionPostOutlineShaderBuffer()]";
    }
    static GetInstance(): OcclusionPostOutlineShaderBuffer {
        return OcclusionPostOutlineShaderBuffer.s_instance;
    }
}

export default class OcclusionPostOutlineMaterial extends MaterialBase {

    private m_screenPlaneEnabled: boolean = true;
    constructor(screenPlaneEnabled: boolean = true) {
        super();
        this.m_screenPlaneEnabled = screenPlaneEnabled;
    }
    protected buildBuf(): void {
        let buf: OcclusionPostOutlineShaderBuffer = OcclusionPostOutlineShaderBuffer.GetInstance();
        buf.screenPlaneEnabled = this.m_screenPlaneEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        let buf: OcclusionPostOutlineShaderBuffer = OcclusionPostOutlineShaderBuffer.GetInstance();
        return buf;
    }
    private m_params: Float32Array = new Float32Array([
        32.0,32.0,1.3,2.0,
        1.0,1.0,1.0,1.0,     // color rgba
        0.2,0.0,0.0,0.0      // occlusion density, undefined,undefined,undefined
    ]);
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