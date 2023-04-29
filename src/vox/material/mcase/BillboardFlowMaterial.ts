/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";
import BillboardGroupShaderBuffer from "../../../vox/material/mcase/BillboardGroupShaderBuffer";

class BillboardFlowShaderBuffer extends BillboardGroupShaderBuffer {

    playOnce = false;
    direcEnabled = false;
    // 因为速度增加，在x轴方向缩放(拉长或者缩短)
    spdScaleEnabled = false;
	paramsTotal = 0;
    constructor() {
        super();
    }

    initialize(texEnabled: boolean): void {

        super.initialize(texEnabled);
        this.m_uniqueName = "flow_" + this.m_uniqueName;
        if (this.playOnce && this.direcEnabled) {
            this.m_uniqueName += "_OD";
        } else if (this.playOnce) {
            this.m_uniqueName += "_O";
        } else if (this.direcEnabled) {
            this.m_uniqueName += "_D";
            if (this.spdScaleEnabled) this.m_uniqueName += "SpdScale";
        }
        if (this.premultiplyAlpha) this.m_uniqueName += "PreMAlpha";
    }

    buildVertShd(): void {

        let coder = this.m_coder;

        coder.addVertLayout("vec4", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec4", "a_nvs");
		if(this.vtxColorEnabled) {
			coder.addVertLayout("vec4", "a_cvs");
			coder.addVarying("vec4", "v_vtxColor");
		}
		if(this.vtxClipUVRectEnabled) {
			coder.addDefine("VOX_VTX_CLIP_RECT");
			coder.addVertLayout("vec4", "a_tvs");
		}
        coder.addVertLayout("vec4", "a_vs2");
        coder.addVertLayout("vec4", "a_uvs2");
        coder.addVertLayout("vec4", "a_nvs2");

        coder.addVertUniform("vec4", "u_billParam", this.paramsTotal);

        if (this.direcEnabled) coder.addDefine("ROTATION_DIRECT");
        if (this.playOnce) coder.addDefine("PLAY_ONCE");
        if (this.spdScaleEnabled) coder.addDefine("SPEED_SCALE");
        if (this.m_clipEnabled) coder.addDefine("BILL_PARAM_INDEX", "4");

    }

    private static s_instance = new BillboardFlowShaderBuffer();
    static GetInstance(): BillboardFlowShaderBuffer {
        if (BillboardFlowShaderBuffer.s_instance != null) {
            return BillboardFlowShaderBuffer.s_instance;
        }
        BillboardFlowShaderBuffer.s_instance = new BillboardFlowShaderBuffer();
        return BillboardFlowShaderBuffer.s_instance;
    }
}

export default class BillboardFlowMaterial extends MaterialBase {

    private m_brightnessEnabled = true;
    private m_alphaEnabled = false;
    private m_clipEnabled = false;
    private m_vtxColorEnabled = false;
    private m_clipMixEnabled = false;
    private m_playOnce = false;
    private m_direcEnabled = false;
    private m_spdScaleEnabled = false;
    private m_time = 0;
    private m_ds: Float32Array = null;
    private m_color = new Color4(1.0, 1.0, 1.0, 1.0);
    private m_brn = 1.0;
	private m_clipRectIndex = -1;
	private m_paramsTotal = 0;
    premultiplyAlpha = false;
	brnToAlpha = false;
	vtxClipUVRectEnabled = false;
    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, clipEnabled: boolean = false, vtxColorEnabled: boolean = false, clipRectEnabled: boolean = false) {
        super();
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        this.m_vtxColorEnabled = vtxColorEnabled;
		let vs = [
			1.0, 1.0, 0.0, 0.0,        // sx,sy,time, depth offset
			1.0, 1.0, 1.0, 1.0,        // r,g,b, spdScaleFactor(0.1 -> 5.0)
			0.0, 0.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 2.0,        // whole acceleration x,y,z,  speed scale max value
		];
        if (clipEnabled) {
            // this.m_ds = new Float32Array([
            //     1.0, 1.0, 0.0, 0.0,        // sx,sy,time, depth offset
            //     1.0, 1.0, 1.0, 1.0,        // r,g,b, spdScaleFactor(0.1 -> 5.0)
            //     0.0, 0.0, 0.0, 0.0,
            //     0.0, 0.0, 0.0, 2.0,        // whole acceleration x,y,z,  speed scale max value
            //     2, 4, 0.5, 0.5             // clip cn, clip total, clip du, clip dv
            // ]);
			vs.push(
				2, 4, 0.5, 0.5             // clip cn, clip total, clip du, clip dv
			);
        }
        // else {
        //     this.m_ds = new Float32Array([
        //         1.0, 1.0, 0.0, 0.0,        // // sx,sy,time, depth offset
        //         1.0, 1.0, 1.0, 0.0,
        //         0.0, 0.0, 0.0, 0.0,
        //         0.0, 0.0, 0.0, 2.0
        //     ]);
        // }
		if(clipRectEnabled) {
			this.m_clipRectIndex = vs.length / 4;
			vs.push(
				0, 0, 1.0, 1.0             // u, v, du, dv
			);
		}
		this.m_paramsTotal = vs.length / 4;
		this.m_ds = new Float32Array(vs);
    }
	setClipAreaUVRect(u: number, v: number, du: number, dv: number): void {
		const i = this.m_clipRectIndex * 4;
		if(i > 0) {
			const ds = this.m_ds;
			ds[i + 0] = u;
			ds[i + 1] = v;
			ds[i + 2] = du;
			ds[i + 3] = dv;
		}

	}
    setPlayParam(playOnce: boolean, direcEnabled: boolean, clipMixEnabled: boolean = false, spdScaleEnabled: boolean = false): void {
        this.m_playOnce = playOnce;
        this.m_direcEnabled = direcEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
        this.m_spdScaleEnabled = spdScaleEnabled;
    }
    protected buildBuf(): void {
        let buf = BillboardFlowShaderBuffer.GetInstance();
        buf.playOnce = this.m_playOnce;
        buf.direcEnabled = this.m_direcEnabled;
        buf.clipMixEnabled = this.m_clipMixEnabled;
        buf.spdScaleEnabled = this.m_spdScaleEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
        buf.brightnessEnabled = this.m_brightnessEnabled;
        buf.vtxColorEnabled = this.m_vtxColorEnabled;
        buf.brnToAlpha = this.brnToAlpha;
        buf.vtxClipUVRectEnabled = this.vtxClipUVRectEnabled;
        buf.clipRectIndex = this.m_clipRectIndex;
        buf.paramsTotal = this.m_paramsTotal;
        buf.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, this.getTextureTotal() > 1);
    }

    getCodeBuf(): ShaderCodeBuffer {
        return BillboardFlowShaderBuffer.GetInstance();
    }
    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_ds];
        return oum;
    }

    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_color.setRGBA4f(pr, pg, pb, pa);
        this.m_ds[4] = pr * this.m_brn;
        this.m_ds[5] = pg * this.m_brn;
        this.m_ds[6] = pb * this.m_brn;
    }
    setColor(c: Color4): void {
		this.setRGBA4f(c.r, c.g, c.b, c.a);
    }
    getColor(c: Color4 = null): Color4 {
		if(c) {
			return c.copyFrom(this.m_color);
		}
        return this.m_color;
    }
    setRGB3f(pr: number, pg: number, pb: number) {
        this.m_color.setRGB3f(pr, pg, pb);
        this.m_ds[4] = pr * this.m_brn;
        this.m_ds[5] = pg * this.m_brn;
        this.m_ds[6] = pb * this.m_brn;
    }
    setAlpha(pa: number): void {
        this.m_ds[7] = pa;
    }
    getAlpha(): number {
        return this.m_ds[6];
    }
    setBrightness(brighness: number): void {
        this.m_brn = brighness;
		const c = this.m_color;
        this.m_ds[4] = c.r * brighness;
        this.m_ds[5] = c.g * brighness;
        this.m_ds[6] = c.b * brighness;
    }
    getBrightness(): number {
        return this.m_brn;
    }

    setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_ds[8] = pr;
        this.m_ds[9] = pg;
        this.m_ds[10] = pb;
        this.m_ds[11] = pa;
    }
    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        this.m_ds[8] = pr;
        this.m_ds[9] = pg;
        this.m_ds[10] = pb;
    }
    setAcceleration(accX: number, accY: number, accZ: number): void {
        this.m_ds[12] = accX;
        this.m_ds[13] = accY;
        this.m_ds[14] = accZ;
    }
    setSpdScaleMax(spdScaleMax: number, factor: number = 1.0): void {
        if (spdScaleMax < 1.0) spdScaleMax = 1.0;
        if (spdScaleMax > 10.0) spdScaleMax = 10.0;
        if (factor < 0.1) factor = 0.1;
        if (factor > 5.0) factor = 5.0;
        this.m_ds[15] = spdScaleMax;
        this.m_ds[7] = factor;
    }
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled) {
            this.m_ds[16] = cn;
            this.m_ds[17] = total;
            this.m_ds[18] = du;
            this.m_ds[19] = dv;
        }
    }
    getTime(): number { return this.m_time; };
    setTime(time: number): void {
        this.m_time = time;
        this.m_ds[2] = time;
    }
    updateTime(offsetTime: number): void {
        this.m_time += offsetTime;
        this.m_ds[2] = this.m_time;
    }
    getScaleX(): number { return this.m_ds[0]; }
    getScaleY(): number { return this.m_ds[1]; }
    setScaleX(p: number): void { this.m_ds[0] = p; }
    setScaleY(p: number): void { this.m_ds[1] = p; }
    setScaleXY(sx: number, sy: number): void {
        this.m_ds[0] = sx;
        this.m_ds[1] = sy;
    }
    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
    setDepthOffset(offset: number): void {
        this.m_ds[3] = offset;
    }
    getUniformData(): Float32Array {
        return this.m_ds;
    }

    destroy() {
        super.destroy();
        this.m_ds = null;
    }
}
