/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
import IROTransform from "../../vox/display/IROTransform";
import Color4 from "../material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";

export default class Default3DEntity extends DisplayEntity {

    protected m_mt: Default3DMaterial = null;
    protected m_polyhedralBoo = true;

    wireframe = false;
    shape = true;

    normalScale = 1.0;
    normalEnabled = false;

    mapLodEnabled = false;
    flipVerticalUV = false;
    vertColorEnabled = false;
    premultiplyAlpha = false;
    alignScreen = false;
    fixAlignScreen = false;

    /**
     * 混合模式是否为亮度叠加模式, 默认值为false
     */
    brightnessBlend = false;
    /**
     * 混合模式是否为透明度混合模式, 默认值为false
     */
    transparentBlend = false;
    /**
     * 深度测试是否永远为false, 默认值为false
     */
    depthAlwaysFalse = false;
    /**
     * 是否双面显示, 默认值为false
     */
    doubleFace = false;


    materialName = "";
    fragUniformData: Float32Array = null;
	materialFragHeadTailCode = "";
	materialFragBodyTailCode = "";
    constructor(transform: IROTransform = null) {
        super(transform);
    }

    setUVScale(scaleU: number, scaleV: number): void {
        if (this.m_mt) this.m_mt.setUVScale(scaleU, scaleV);
    }
    setUVTranslation(offsetU: number, offsetV: number): void {
        if (this.m_mt) this.m_mt.setUVOffset(offsetU, offsetV);
    }
    setColor(c: Color4): void {
        if (this.m_mt) this.m_mt.setRGBA4f(c.r, c.g, c.b, c.a);
    }
    setAlpha(a: number, texAlpha: number = 0.0): void {
        if (this.m_mt) this.m_mt.setAlpha(a);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_mt) this.m_mt.setRGB3f(pr, pg, pb);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_mt) this.m_mt.setRGBA4f(pr, pg, pb, pa);
    }
    setOffsetRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_mt) this.m_mt.setOffsetRGB3f(pr, pg, pb);
    }
    setOffsetRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_mt) this.m_mt.setOffsetRGBA4f(pr, pg, pb, pa);
    }
    setTextureLodLevel(lodLv: number): void {
        if(this.mapLodEnabled) {
            if (this.m_mt) this.m_mt.setTextureLodLevel( lodLv );
        }
    }
    /**
     * 设置是否为多面体网格
     * @param boo 是否为多面体网格
     */
    setPolyhedral(boo: boolean): void {
        this.m_polyhedralBoo = boo;
        let pmesh = this.getMesh() as RectPlaneMesh;
        if(pmesh) {
            pmesh.setPolyhedral(boo);
        }
    }
    // 是否是平铺在屏幕上
    setScreenAlignEnable(enable: boolean): void {
        this.alignScreen = enable;
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm = new Default3DMaterial();
            this.m_mt = cm;
            cm.alignScreen = this.alignScreen;
            cm.fixAlignScreen = this.fixAlignScreen;
            cm.mapLodEnabled = this.mapLodEnabled;

            cm.fragUniformData = this.fragUniformData;
            cm.name = this.materialName;
            cm.fragBodyTailCode = this.materialFragBodyTailCode;
            cm.fragHeadTailCode = this.materialFragHeadTailCode;

            cm.normalEnabled = this.normalEnabled;
            cm.vertColorEnabled = this.vertColorEnabled;
            cm.premultiplyAlpha = this.premultiplyAlpha;
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
		this.updateRenderState();
    }
	updateRenderState(): void {

		let cullMode = 0;
		switch(this.m_faceType) {
			case -1:
				cullMode = CullFaceMode.BACK;
				break;
			case 1:
				cullMode = CullFaceMode.FRONT;
				break;
			default:
				cullMode = CullFaceMode.NONE;
				break;
		}
		let blendMode = RenderBlendMode.OPAQUE;
		if(this.brightnessBlend){
			blendMode = RenderBlendMode.ADD;
		}else if(this.transparentBlend) {
			if(this.premultiplyAlpha) {
				blendMode = RenderBlendMode.ALPHA_ADD;
			}else {
				blendMode = RenderBlendMode.TRANSPARENT;
			}
		}
		let depthMode = DepthTestMode.OPAQUE;
		if(this.depthAlwaysFalse){
			depthMode = DepthTestMode.ALWAYS;
		}else if(this.transparentBlend) {
			depthMode = DepthTestMode.BLEND_SORT;
		}

		let st = RendererState.CreateRenderState("", cullMode, blendMode, depthMode);
		this.setRenderState(st);
	}
	private m_faceType = -1;
    showBackFace(): void {
		this.m_faceType = -1;
    }
    showFrontFace(): void {
		this.m_faceType = 1;
    }
    showDoubleFace(always: boolean = false, doubleFace: boolean = true): void {

		this.m_faceType = 2;
    }
    toTransparentBlend(always: boolean = false, doubleFace: boolean = false): void {
		this.transparentBlend = true;
    }
    toBrightnessBlend(always: boolean = false, doubleFace: boolean = false): void {
		this.brightnessBlend = true;
    }
    reinitializeMesh(): void {
        let mesh = this.getMesh() as RectPlaneMesh;
        if (mesh) {
            mesh.reinitialize();
        }
    }
    destroy(): void {
        super.destroy();
        this.m_mt = null;
    }
}
