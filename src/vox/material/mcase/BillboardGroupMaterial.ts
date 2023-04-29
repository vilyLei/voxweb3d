/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import { MaterialPipeType } from "../pipeline/MaterialPipeType";
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";

class BillGroupShaderBuffer extends ShaderCodeBuffer {
    private m_uniqueName: string = "";
    billFS: BillboardFSBase = new BillboardFSBase();
    brightnessEnabled: boolean = false;
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize( texEnabled );
        this.m_uniqueName = "BillGroupShader";
    }
    buildShader(): void {
        
        let coder = this.m_coder;
        if(this.brightnessEnabled) {
            let fogEnabled: boolean = this.fogEnabled;
            if(this.pipeline != null) {
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
            }
            this.brightnessOverlayEnabeld = fogEnabled;
        }
        this.m_uniform.addDiffuseMap();
        coder.addVertLayout("vec2","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        coder.addVertLayout("vec3","a_vs2");

        coder.addVarying("vec4","v_colorMult");
        coder.addVarying("vec4","v_colorOffset");
        coder.addVarying("vec2","v_uv");
        coder.addVertUniform("vec4","u_billParam",3);
        coder.addDefine("FADE_VAR","fv4");

        let fragCode0: string =
`
    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv);
    vec3 offsetColor = v_colorOffset.rgb;
    vec4 fv4 = v_colorMult.wwww;
`;
        let fadeCode: string = this.billFS.getBrnAndAlphaCode();
        let fragCode2: string =
            `
    FragColor0 = color;
`;
        coder.addFragMainCode(fragCode0 + fadeCode + fragCode2);
        coder.addVertMainCode(
`
    vec4 temp = u_billParam[0];
    vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);
    viewPosition = u_viewMat * u_objMat * vec4(a_vs2.xyz,1.0);
    viewPosition.xy += vtx.xy;
    gl_Position =  u_projMat * viewPosition;
    v_uv = a_uvs;
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
`
        );
    }

    getUniqueShaderName(): string {
        let ns: string = this.m_uniqueName;
        ns += this.brightnessEnabled ? "Brn" : "Alp"
        return ns;
    }
    toString(): string {
        return "[BillGroupShaderBuffer()]";
    }
    private static s_instance: BillGroupShaderBuffer = new BillGroupShaderBuffer();
    static GetInstance(): BillGroupShaderBuffer {
        if (BillGroupShaderBuffer.s_instance != null) {
            return BillGroupShaderBuffer.s_instance;
        }
        BillGroupShaderBuffer.s_instance = new BillGroupShaderBuffer();
        return BillGroupShaderBuffer.s_instance;
    }
}

export default class BillboardGroupMaterial extends MaterialBase {
    
    private m_rz: number = 0;
    private m_uniformData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
    private m_color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;
    private m_brightnessEnabled: boolean = false;

    constructor(brightnessEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
    }
    protected buildBuf(): void {
        let buf = BillGroupShaderBuffer.GetInstance();
        buf.brightnessEnabled = this.m_brightnessEnabled;
        buf.billFS.setBrightnessAndAlpha(this.m_brightnessEnabled, !this.m_brightnessEnabled)
    }
    getCodeBuf(): ShaderCodeBuffer {
        let buf: ShaderCodeBuffer = BillGroupShaderBuffer.GetInstance();
        return buf;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }


    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
        this.m_uniformData[7] = pa;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
    }
    setFadeFactor(pa: number): void {

        this.m_uniformData[7] = pa;
    }
    getFadeFactor(): number {

        return this.m_uniformData[7];
    }
    setAlpha(pa: number): void {
        this.m_uniformData[7] = pa;
    }
    getAlpha(): number {
        return this.m_uniformData[6];
    }
    setBrightness(brighness: number): void {
        this.m_brightness = brighness;
        this.m_uniformData[4] = this.m_color.r * brighness;
        this.m_uniformData[5] = this.m_color.g * brighness;
        this.m_uniformData[6] = this.m_color.b * brighness;
    }
    getBrightness(): number {
        return this.m_brightness;
    }

    setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
        this.m_uniformData[11] = pa;
    }
    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
    }
    getRotationZ(): number { return this.m_rz; };
    setRotationZ(degrees: number): void {
        this.m_rz = degrees;
        this.m_uniformData[2] = degrees * MathConst.MATH_PI_OVER_180;
    }
    getScaleX(): number { return this.m_uniformData[0]; }
    getScaleY(): number { return this.m_uniformData[1]; }
    setScaleX(p: number): void { this.m_uniformData[0] = p; }
    setScaleY(p: number): void { this.m_uniformData[1] = p; }
    setScaleXY(sx: number, sy: number): void {
        this.m_uniformData[0] = sx;
        this.m_uniformData[1] = sy;
    }
    getUniformData(): Float32Array {
        return this.m_uniformData;
    }

    destroy() {
        super.destroy();
        this.m_uniformData = null;
    }
}