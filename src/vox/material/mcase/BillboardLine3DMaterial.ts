/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../../vox/math/MathConst";
import Vector3D from "../../../vox/math/Vector3D";
import BillboardFSBase from "../../../vox/material/mcase/BillboardFSBase";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import { MaterialPipeType } from "../pipeline/MaterialPipeType";

class BillboardLine3DShaderBuffer extends ShaderCodeBuffer {
    billFS: BillboardFSBase = new BillboardFSBase();
    constructor() {
        super();
    }
    private m_uniqueName: string = "";
    brightnessEnabled: boolean = false;
    initialize(texEnabled: boolean): void {

        super.initialize(texEnabled);
        this.m_uniqueName = "BillboardLine3DShader";
        this.m_uniqueName += this.brightnessEnabled ? "Brn" : "Alp";
    }

    buildShader(): void {

        let coder = this.m_coder;
        if (this.brightnessEnabled) {

            let fogEnabled: boolean = this.fogEnabled;
            if (this.pipeline != null) {
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
                fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
            }
            this.brightnessOverlayEnabeld = fogEnabled;
        }

        this.m_uniform.addDiffuseMap();

        coder.addVertLayout("vec2", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVarying("vec4", "v_colorMult");
        coder.addVarying("vec4", "v_colorOffset");
        coder.addVarying("vec4", "v_fadeV");
        coder.addVarying("vec4", "v_uv");
        coder.addVertUniform("vec4", "u_billParam", 6);
        coder.addDefine("FADE_VAR", "fv4");
        coder.addVertHeadCode(
            `
    const vec4  direcV = vec4(1.0,-1.0,-1.0,1.0);
`
        )

        let fragCode0: string =
            `
    vec4 color = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
    vec3 offsetColor = v_colorOffset.rgb;
    float kf = v_uv.z;
    //kf = min(kf / 0.3, 1.0) * (1.0 - max((kf - 0.7)/(1.0 - 0.7),0.0));
    kf = min(kf / v_fadeV.x, 1.0) * (1.0 - max((kf - v_fadeV.y)/(1.0 - v_fadeV.y),0.0));
    vec4 fv4 = vec4(v_colorMult.w * kf * v_fadeV.w);
`;
        let fadeCode: string = this.billFS.getBrnAndAlphaCode();
        let fragCode2: string =
            `
    FragColor0 = color;
`;
        coder.addFragMainCode(fragCode0 + fadeCode + fragCode2);

        coder.addVertMainCode(
            `
    int i = int(a_vs.x);
    mat4 voMat4 = u_viewMat * u_objMat;
    viewPosition = voMat4 * vec4(u_billParam[i].xyz,1.0);
    vec4 pv1 = voMat4 * vec4(u_billParam[i+1].xyz,1.0);
    pv1.xy = pv1.xy - viewPosition.xy;
    pv1.xy = pv1.yx * (a_vs.y > 0.0 ? direcV.xy : direcV.zw);
    viewPosition.xy += normalize(pv1.xy) * abs(u_billParam[3].w);
    gl_Position = u_projMat * viewPosition;
    
    vec2 puv = a_uvs * u_billParam[0].xy;
    float cosv = cos(u_billParam[2].w);
    float sinv = sin(u_billParam[2].w);
    puv = vec2(puv.x * cosv - puv.y * sinv, puv.x * sinv + puv.y * cosv);
    v_uv.xy = puv + u_billParam[0].zw;
    v_uv.zw = a_uvs;
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
    v_fadeV = vec4(u_billParam[4].w, u_billParam[5].w, 1.0,1.0);
`
        );

    }
    
    getUniqueShaderName(): string {
        return this.m_uniqueName + "_" + this.billFS.getBrnAlphaStatus();
    }
    toString(): string {
        return "[BillboardLine3DShaderBuffer()]";
    }
    private static s_instance: BillboardLine3DShaderBuffer = new BillboardLine3DShaderBuffer();
    static GetInstance(): BillboardLine3DShaderBuffer {
        if (BillboardLine3DShaderBuffer.s_instance != null) {
            return BillboardLine3DShaderBuffer.s_instance;
        }
        BillboardLine3DShaderBuffer.s_instance = new BillboardLine3DShaderBuffer();
        return BillboardLine3DShaderBuffer.s_instance;
    }
}

export default class BillboardLine3DMaterial extends MaterialBase {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_beginPos: Vector3D = new Vector3D();
    private m_endPos: Vector3D = new Vector3D();
    private m_endPos2: Vector3D = new Vector3D();
    private m_uvRotation: number = 0;
    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
    }

    private m_uniformData: Float32Array = new Float32Array([
        1.0, 1.0, 0.0, 0.0,        // uscale,vscale,uoffset,voffset
        1.0, 1.0, 1.0, 1.0,        // rgb scale coefficient: r,g,b, fade factor(0.0 -> 1.0)default 1.0
        0.0, 0.0, 0.0, 0.0,        // rgb offset: r,g,b, and uv rotation rad

        0.0, 0.0, 0.0, 10.0,      // begin pos x,y,z, line half width
        100.0, 0.0, 0.0, 0.3,     // end pos x,y,z, fade in value
        200.0, 0.0, 0.0, 0.7,     // second end pos x,y,z, fade out value
    ]);
    protected buildBuf(): void {
        let buf: BillboardLine3DShaderBuffer = BillboardLine3DShaderBuffer.GetInstance();
        buf.billFS.setBrightnessAndAlpha(this.m_brightnessEnabled, this.m_alphaEnabled);
        buf.brightnessEnabled = this.m_brightnessEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return BillboardLine3DShaderBuffer.GetInstance();
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }
    setBeginAndEndPos(beginPos: Vector3D, endPos: Vector3D): void {
        this.m_beginPos.copyFrom(beginPos);
        this.m_endPos.copyFrom(endPos);
        this.m_endPos2.subVecsTo(endPos, beginPos);
        this.m_endPos2.addBy(endPos);

        this.m_uniformData[12] = beginPos.x;
        this.m_uniformData[13] = beginPos.y;
        this.m_uniformData[14] = beginPos.z;

        this.m_uniformData[16] = endPos.x;
        this.m_uniformData[17] = endPos.y;
        this.m_uniformData[18] = endPos.z;


        this.m_uniformData[20] = this.m_endPos2.x;
        this.m_uniformData[21] = this.m_endPos2.y;
        this.m_uniformData[22] = this.m_endPos2.z;
    }

    setBeginPos(beginPos: Vector3D): void {
        this.m_beginPos.copyFrom(beginPos);
        this.m_endPos2.subVecsTo(this.m_endPos, beginPos);
        this.m_endPos2.addBy(this.m_endPos);

        this.m_uniformData[12] = beginPos.x;
        this.m_uniformData[13] = beginPos.y;
        this.m_uniformData[14] = beginPos.z;

        this.m_uniformData[20] = this.m_endPos2.x;
        this.m_uniformData[21] = this.m_endPos2.y;
        this.m_uniformData[22] = this.m_endPos2.z;
    }
    setEndPos(endPos: Vector3D): void {

        this.m_endPos.copyFrom(endPos);
        this.m_endPos2.subVecsTo(endPos, this.m_beginPos);
        this.m_endPos2.addBy(endPos);

        this.m_uniformData[16] = endPos.x;
        this.m_uniformData[17] = endPos.y;
        this.m_uniformData[18] = endPos.z;

        this.m_uniformData[20] = this.m_endPos2.x;
        this.m_uniformData[21] = this.m_endPos2.y;
        this.m_uniformData[22] = this.m_endPos2.z;
    }

    setLineWidth(lineWidth: number): void {
        this.m_uniformData[15] = 0.5 * lineWidth;
    }
    getLineWidth(): number {
        return this.m_uniformData[15];
    }
    setUVRotation(uvDegree: number): void {
        this.m_uvRotation = uvDegree;
        //uvDegree = MathConst.DegreeToRadian(uvDegree);
        //7,11
        //this.m_uniformData[7] = Math.cos(uvDegree);
        this.m_uniformData[11] = MathConst.DegreeToRadian(uvDegree);//Math.sin(uvDegree);
    }
    getUVRotation(): number {
        return this.m_uvRotation;
    }
    setUVParam(uScale: number, vScale: number, uOffset: number, vOffset: number): void {
        this.m_uniformData[0] = uScale;
        this.m_uniformData[1] = vScale;
        this.m_uniformData[2] = uOffset;
        this.m_uniformData[3] = vOffset;
    }
    setUVScale(uScale: number, vScale: number): void {
        this.m_uniformData[0] = uScale;
        this.m_uniformData[1] = vScale;
    }
    setUVOffset(uOffset: number, vOffset: number): void {
        this.m_uniformData[2] = uOffset;
        this.m_uniformData[3] = vOffset;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_uniformData[4] = pr;
        this.m_uniformData[5] = pg;
        this.m_uniformData[6] = pb;
    }
    setFadeRange(fadeMin: number, fadeMax: number): void {
        this.m_uniformData[19] = fadeMin;
        this.m_uniformData[23] = fadeMax;
    }
    setFadeFactor(pa: number): void {
        this.m_uniformData[7] = pa;
    }
    getFadeFactor(): number {
        return this.m_uniformData[7];
    }

    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        this.m_uniformData[8] = pr;
        this.m_uniformData[9] = pg;
        this.m_uniformData[10] = pb;
    }
    getUniformData(): Float32Array {
        return this.m_uniformData;
    }

    destroy() {
        super.destroy();
        this.m_uniformData = null;
    }
}