/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";
import { ShaderTextureBuilder } from "../../../vox/material/ShaderTextureBuilder";
import MathConst from "../../../vox/math/MathConst";

class OccPostOutLineDecorator implements IMaterialDecorator {

    private m_uniqueName: string;
    private m_screenPlaneEnabled: boolean = true;
    private m_params: Float32Array = new Float32Array([
        32.0,32.0,1.3,2.0,
        1.0,1.0,1.0,1.0,     // color rgba
        0.2,0.0,0.0,0.0      // occlusion density, undefined,undefined,undefined
    ]);
    
    /**
     * the  default  value is false
     */
    vertColorEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    premultiplyAlpha: boolean = false;
    /**
     * the  default  value is false
     */
    shadowReceiveEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    lightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    envAmbientLightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    brightnessOverlayEnabeld: boolean = false;
    /**
     * the default value is true
     */
    glossinessEnabeld: boolean = false;

    private m_currMap: IRenderTexture = null;
    
    constructor(screenPlaneEnabled: boolean, tex: IRenderTexture) {
        
        this.m_screenPlaneEnabled = screenPlaneEnabled;
        this.m_uniqueName = "OccPostOutLineDecorator";
        if( tex != null ) this.m_uniqueName += "Tex";
        if( screenPlaneEnabled ) this.m_uniqueName += "Pl";

        this.m_currMap = tex;
    }

    buildBufParams(): void {
    }
    createTextureList(builder: ShaderTextureBuilder): void {
        builder.addDiffuseMap(this.m_currMap);
    }
    buildShader(coder: IShaderCodeBuilder): void {
                
        coder.addFragUniform("vec4", "u_params", 3);
        if(this.m_screenPlaneEnabled) {
            coder.addDefine("VOX_SCREEN_PLANE", "1");
            coder.useVertSpaceMats(false, false, false);
        }
        
        coder.addFragMainCode(
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
    // FragColor0 = vec4(srcColor.xyz, 1.0);
    // return;

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
    // FragColor0 += vec4(0.0,0.2,0.0,0.3);
    // for test
    //FragColor0 = vec4(vec3(1.0,1.0,0.0), 1.0);
}
`
        );
        coder.addVertMainCode(
`
    #ifdef VOX_SCREEN_PLANE
        gl_Position = vec4(a_vs, 1.0);
        v_uv = a_uvs.xy;
    #else
        gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs, 1.0);
    #endif
`
        );
    }
    
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
    createUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_params];
        return oum;
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.None;
    }
    getShaderCodeObject(): IShaderCodeObject {
        return null;
    }
    getUniqueName(): string {
        return this.m_uniqueName;
    }

}
export { OccPostOutLineDecorator };