/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { BillboardFlowDcr } from "./BillboardFlowDcr";
import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import { IMaterial } from "../../../vox/material/IMaterial";
import IColor4 from "../../../vox/material/IColor4";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;



class BillboardFlowMaterial {
	private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    private m_playOnce: boolean = false;
    private m_direcEnabled: boolean = false;
    private m_spdScaleEnabled: boolean = false;
    private m_time: number = 0;
    private m_uniformData: Float32Array = null;
    private m_color: IColor4 = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;

	private m_dcr = new BillboardFlowDcr();

	diffuseMap: IRenderTexture = null;
    premultiplyAlpha: boolean = false;
	material: IMaterial = null;
    constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, clipEnabled: boolean = false) {

		this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;

    }
	initialize(): void {

        if (this.m_clipEnabled) {
            this.m_uniformData = new Float32Array([
                1.0, 1.0, 0.0, 0.0,        // sx,sy,time, depth offset
                1.0, 1.0, 1.0, 1.0,        // r,g,b, spdScaleFactor(0.1 -> 5.0)
                0.0, 0.0, 0.0, 0.0,
                0.0, 0.0, 0.0, 2.0,        // whole acceleration x,y,z,  speed scale max value
                2, 4, 0.5, 0.5             // clip cn, clip total, clip du, clip dv
            ]);
        }
        else {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0]);
        }
		this.buildDcr();
    }
    setPlayParam(playOnce: boolean, direcEnabled: boolean, clipMixEnabled: boolean = false, spdScaleEnabled: boolean = false): void {
        this.m_playOnce = playOnce;
        this.m_direcEnabled = direcEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
        this.m_spdScaleEnabled = spdScaleEnabled;
    }
    protected buildDcr(): void {

		let dcr = this.m_dcr;
		dcr.diffuseMap = this.diffuseMap;
        dcr.playOnce = this.m_playOnce;
        dcr.direcEnabled = this.m_direcEnabled;
        dcr.clipMixEnabled = this.m_clipMixEnabled;
        dcr.spdScaleEnabled = this.m_spdScaleEnabled;
        dcr.premultiplyAlpha = this.premultiplyAlpha;
        dcr.brightnessEnabled = this.m_brightnessEnabled;
        dcr.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, dcr.diffuseMap != null);
		dcr.setUniformData( this.createSelfUniformData() );

		// this.material = new Material();
		this.material = CoRScene.createMaterial( dcr );
    }

    private createSelfUniformData(): IShaderUniformData {

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
    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
    setDepthOffset(offset: number): void {
        this.m_uniformData[3] = offset;
    }
    getUniformData(): Float32Array {
        return this.m_uniformData;
    }
    destroy() {
        this.m_uniformData = null;
        this.diffuseMap = null;
		if(this.material != null) {
			this.material.destroy();
			this.material = null;
		}
    }

}
export { BillboardFlowMaterial };
