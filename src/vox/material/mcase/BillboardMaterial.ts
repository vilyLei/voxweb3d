/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";
import { MaterialPipeType } from "../pipeline/MaterialPipeType";

class BillboardShaderBuffer extends ShaderCodeBuffer {
    billFS: BillboardFSBase = new BillboardFSBase();
    constructor() {
        super();
    }
    private m_uniqueName: string = "";
    rotationEnabled: boolean = false;
    brightnessEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "BillboardShader";
        if(this.rotationEnabled) this.m_uniqueName += "Rot";        
        this.m_coder.addDiffuseMap();
    }
    buildShader(): void {
        let coder = this.m_coder;
        if(this.rotationEnabled) coder.addDefine("VOX_ROTATION","1");
        if(this.brightnessEnabled) {
            let fogEnabled: boolean = this.fogEnabled;
            if(this.pipeline != null) {
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
            }
            if(fogEnabled) coder.addDefine("VOX_USE_BRIGHtNESS_FOG_COLOR","1");
        }

        coder.addVertLayout("vec2","a_vs");
        coder.addVarying("vec4","v_colorMult");
        coder.addVarying("vec4","v_colorOffset");
        coder.addVarying("vec2","v_uv");
        coder.addVertUniform("vec4","u_billParam",3);

        let fragCode0: string =
`
    vec4 color = texture(VOX_DIFFUSE_MAP, v_uv);
    vec3 offsetColor = v_colorOffset.rgb;
    vec4 fv4 = v_colorMult.wwww;
`;
        let fadeCode: string = this.billFS.getBrnAndAlphaCode("fv4");
        let fragCode2: string =
            `
    FragColor0 = color;
`;
        coder.addFragMainCode(fragCode0 + fadeCode + fragCode2);
        
        coder.addVertMainCode(
            `
    vec4 temp = u_billParam[0];
    float cosv = cos(temp.z);
    float sinv = sin(temp.z);
    vec2 vtx = a_vs.xy * temp.xy;
    vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    viewPosition = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);
    viewPosition.xy += vtx_pos.xy;
    gl_Position =  u_projMat * viewPosition;
    v_uv = a_uvs;
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
`
        );

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName + "_" + this.billFS.getBrnAlphaStatus();
    }
    toString(): string {
        return "[BillboardShaderBuffer()]";
    }
    private static s_instance: BillboardShaderBuffer = new BillboardShaderBuffer();
    static GetInstance(): BillboardShaderBuffer {
        if (BillboardShaderBuffer.s_instance != null) {
            return BillboardShaderBuffer.s_instance;
        }
        BillboardShaderBuffer.s_instance = new BillboardShaderBuffer();
        return BillboardShaderBuffer.s_instance;
    }
}

export default class BillboardMaterial extends MaterialBase {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_rotationEnabled: boolean = false;
    private m_rz: number = 0;
    private m_uniformData: Float32Array = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);

    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, rotationEnabled: boolean = false) {

        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_rotationEnabled = rotationEnabled;
    }
    protected buildBuf(): void {
        
        let buf: BillboardShaderBuffer = BillboardShaderBuffer.GetInstance();
        buf.rotationEnabled = this.m_rotationEnabled;
        buf.brightnessEnabled = this.m_brightnessEnabled;
        buf.billFS.setBrightnessAndAlpha(this.m_brightnessEnabled, this.m_alphaEnabled);
    }
    getCodeBuf(): ShaderCodeBuffer {

        return BillboardShaderBuffer.GetInstance();
    }
    createSelfUniformData(): ShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }


    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {

        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
        this.m_uniformData[7] = pa;
    }
    setRGB3f(pr: number, pg: number, pb: number) {

        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
    }
    setFadeFactor(pa: number): void {

        this.m_uniformData[7] = pa;
    }
    getFadeFactor(): number {

        return this.m_uniformData[7];
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