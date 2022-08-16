/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { BillboardFlareDcr } from "./BillboardFlareDcr";
import IShaderUniformData from "../../../vox/material/IShaderUniformData";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import IColor4 from "../../../vox/material/IColor4";
import { IMaterial } from "../../../vox/material/IMaterial";

// import { Material } from "../../../vox/material/Material";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;


class BillboardFlareMaterial {

	private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    private m_uniformData: Float32Array = null;
    private m_time: number = 0;
    private m_color: IColor4 = CoRScene.createColor4(1.0, 1.0, 1.0, 1.0);
    private m_brightness: number = 1.0;

	private m_dcr = new BillboardFlareDcr();

	diffuseMap: IRenderTexture = null;
    premultiplyAlpha: boolean = false;
	material: IMaterial = null;

	constructor(brightnessEnabled: boolean = true, alphaEnabled: boolean = false, clipEnabled: boolean = false, clipMixEnabled: boolean = false) {

        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
    }
	initialize(): void {

        // let mb = CoRScene.getRendererScene().materialBlock;
        // let material = mb.createMaterial(drc);


        if (this.m_clipEnabled) {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 2.0, 4.0, 0.5, 0.5]);
        }
        else {
            this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
        }
		this.buildDcr();
    }

    protected buildDcr(): void {

		let dcr = this.m_dcr;
		dcr.diffuseMap = this.diffuseMap;
        dcr.clipMixEnabled = this.m_clipMixEnabled;
        dcr.premultiplyAlpha = this.premultiplyAlpha;
        dcr.brightnessEnabled = this.m_brightnessEnabled;
        dcr.setParam(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, dcr.diffuseMap != null);
		dcr.setUniformData( this.createSelfUniformData() );

		// this.material = new Material();
		this.material = CoRScene.createMaterial(dcr);
		this.material.setDecorator( dcr );
    }

    private createSelfUniformData(): IShaderUniformData {

        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_billParam"];
        oum.dataList = [this.m_uniformData];
        return oum;
    }

    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
	 setDepthOffset(offset: number): void {
        this.m_uniformData[3] = offset;
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
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled) {
            this.m_uniformData[12] = cn;
            this.m_uniformData[13] = total;
            this.m_uniformData[14] = du;
            this.m_uniformData[15] = dv;
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
    destroy() {
        this.m_uniformData = null;
        this.diffuseMap = null;
		if(this.material != null) {
			this.material.destroy();
			this.material = null;
		}
    }

}
export { BillboardFlareMaterial };
