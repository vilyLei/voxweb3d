/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathShaderCode from "../../../vox/material/code/MathShaderCode";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import BillboardGroupShaderBuffer from "../../../vox/material/mcase/BillboardGroupShaderBuffer";

import IShaderCodeObject from "../IShaderCodeObject";
import { BillboardGroupShaderCode } from "../mcase/glsl/BillboardGroupShaderCode";
import { MaterialPipeType } from "../pipeline/MaterialPipeType";


class BillboardFlowShaderBuffer extends BillboardGroupShaderBuffer {

    playOnce: boolean = false;
    direcEnabled: boolean = false;
    // 因为速度增加，在x轴方向缩放(拉长或者缩短)
    spdScaleEnabled: boolean = false;
    //brightnessEnabled: boolean = false;
    constructor() {
        super();
    }

    initialize(texEnabled: boolean): void {

        this.m_coderEnabled = true;
        super.initialize(texEnabled);
        this.m_uniqueName = "flow_"+this.m_uniqueName;
        if (this.playOnce && this.direcEnabled) {
            this.m_uniqueName += "_OD";
        } else if (this.playOnce) {
            this.m_uniqueName += "_O";
        } else if (this.direcEnabled) {
            this.m_uniqueName += "_D";
            if (this.spdScaleEnabled) this.m_uniqueName += "SpdScale";
        }
        //if (this.clipMixEnabled) this.m_uniqueName += "Mix";
        if (this.premultiplyAlpha) this.m_uniqueName += "PreMAlpha";
        //this.m_uniqueName += this.brightnessEnabled ? "Brn": "Alp";
        //this.adaptationShaderVersion = !this.m_coderEnabled;
    }
    
    buildVertShd(): void {

        let coder = this.m_coder;
        
        // if(this.brightnessEnabled) {
        //     let fogEnabled: boolean = this.fogEnabled;
        //     if(this.pipeline != null) {
        //         fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG_EXP2);
        //         fogEnabled = fogEnabled || this.pipeline.hasPipeByType(MaterialPipeType.FOG);
        //     }
        //     this.brightnessOverlayEnabeld = fogEnabled;
        // }

        coder.addVertLayout("vec4", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec4", "a_nvs");
        coder.addVertLayout("vec4", "a_vs2");
        coder.addVertLayout("vec4", "a_uvs2");
        coder.addVertLayout("vec4", "a_nvs2");

        let paramTotal: number = this.m_clipEnabled ? 5 : 4;
        coder.addVertUniform("vec4", "u_billParam", paramTotal);

        if (this.direcEnabled) coder.addDefine("ROTATION_DIRECT");
        if (this.playOnce) coder.addDefine("PLAY_ONCE");
        if (this.spdScaleEnabled) coder.addDefine("SPEED_SCALE");
        if (this.m_clipEnabled) coder.addDefine("BILL_PARAM_INDEX", "4");

    }
    
    getShaderCodeObject(): IShaderCodeObject {
        if(this.pipeline != null || this.m_coderEnabled) {
            return BillboardGroupShaderCode;
        }
        return super.getShaderCodeObject();
    }
    buildShader(): void {
        
        if(this.pipeline != null || this.m_coderEnabled) {
            this.m_coder.autoBuildHeadCodeEnabled = false;
            this.buildFragShd();
            this.buildVertShd();
            if (this.pipeline == null) {
                this.m_coder.addShaderObject( BillboardGroupShaderCode );
            }
        }
    }
    
    getVertShaderCode(): string {
        return this.m_coder.buildVertCode();
    }
    
    toString(): string {
        return "[BillboardFlowShaderBuffer()]";
    }
    private static s_instance: BillboardFlowShaderBuffer = new BillboardFlowShaderBuffer();
    static GetInstance(): BillboardFlowShaderBuffer {
        if (BillboardFlowShaderBuffer.s_instance != null) {
            return BillboardFlowShaderBuffer.s_instance;
        }
        BillboardFlowShaderBuffer.s_instance = new BillboardFlowShaderBuffer();
        return BillboardFlowShaderBuffer.s_instance;
    }
}

export default class BillboardFlowMaterial extends MaterialBase {

    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    private m_playOnce: boolean = false;
    private m_direcEnabled: boolean = false;
    private m_spdScaleEnabled: boolean = false;
    private m_time: number = 0;
    private m_uniformData: Float32Array = null;
    private m_color: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;
    premultiplyAlpha: boolean = false;

    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, clipEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        if (clipEnabled) {
            this.m_uniformData = new Float32Array([
                1.0, 1.0, 0.0, 1.0,        // sx,sy,time, undefined
                1.0, 1.0, 1.0, 1.0,        // r,g,b, spdScaleFactor(0.1 -> 5.0)
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 2.0,        // whole acceleration x,y,z,  speed scale max value
                2, 4, 0.5, 0.5             // clip cn, clip total, clip du, clip dv
            ]);
        }
        else {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0]);
        }
    }

    setPlayParam(playOnce: boolean, direcEnabled: boolean, clipMixEnabled: boolean = false, spdScaleEnabled: boolean = false): void {
        this.m_playOnce = playOnce;
        this.m_direcEnabled = direcEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
        this.m_spdScaleEnabled = spdScaleEnabled;
    }
    protected buildBuf(): void {
        let buf: BillboardFlowShaderBuffer = BillboardFlowShaderBuffer.GetInstance();
        buf.playOnce = this.m_playOnce;
        buf.direcEnabled = this.m_direcEnabled;
        buf.clipMixEnabled = this.m_clipMixEnabled;
        buf.spdScaleEnabled = this.m_spdScaleEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
        buf.brightnessEnabled = this.m_brightnessEnabled;
        buf.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, this.getTextureTotal() > 1);
    }

    getCodeBuf(): ShaderCodeBuffer {
        return BillboardFlowShaderBuffer.GetInstance();
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
        this.m_color.a = pa;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_color.r = pr;
        this.m_color.g = pg;
        this.m_color.b = pb;
        this.m_uniformData[4] = pr * this.m_brightness;
        this.m_uniformData[5] = pg * this.m_brightness;
        this.m_uniformData[6] = pb * this.m_brightness;
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
    setAcceleration(accX: number, accY: number, accZ: number): void {
        this.m_uniformData[12] = accX;
        this.m_uniformData[13] = accY;
        this.m_uniformData[14] = accZ;
    }
    setSpdScaleMax(spdScaleMax: number, factor: number = 1.0): void {
        if (spdScaleMax < 1.0) spdScaleMax = 1.0;
        if (spdScaleMax > 10.0) spdScaleMax = 10.0;
        if (factor < 0.1) factor = 0.1;
        if (factor > 5.0) factor = 5.0;
        this.m_uniformData[15] = spdScaleMax;
        this.m_uniformData[7] = factor;
    }
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled) {
            this.m_uniformData[16] = cn;
            this.m_uniformData[17] = total;
            this.m_uniformData[18] = du;
            this.m_uniformData[19] = dv;
        }
    }
    getTime(): number { return this.m_time; };
    setTime(time: number): void {
        this.m_time = time;
        this.m_uniformData[2] = time;
    }
    updateTime(offsetTime: number): void {
        this.m_time += offsetTime;
        this.m_uniformData[2] = this.m_time;
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