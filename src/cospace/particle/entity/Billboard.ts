import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IShaderMaterial from "../../../vox/material/mcase/IShaderMaterial";
import BillboardFragShaderBase from "../shader/BillboardFragShaderBase";
import IShaderCodeBuffer from "../../../vox/material/IShaderCodeBuffer";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IVector3D from "../../../vox/math/IVector3D";
import { BillboardMaterial } from "./BillboardMaterial";
import { IBillboard } from "./IBillboard";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class BillboardMesh {
	private m_vs: Float32Array = null;
	private m_uvs: Float32Array = null;
	private m_ivs: Uint16Array = null;
	flipVerticalUV: boolean = false;
	vtxUVEnabled: boolean = true;
	mesh = CoRScene.createDataMesh();
	constructor() {}

	initialize(pwidth: number, pheight: number): void {
		if (this.m_vs != null) {
			return;
		}
		//console.log("RectPlaneMesh::initialize()...");
		let maxX: number = 0.5 * pwidth;
		let maxY: number = 0.5 * pheight;
		let minX: number = -maxX;
		let minY: number = -maxY;
		this.m_ivs = new Uint16Array([1, 2, 0, 3]);
		this.m_vs = new Float32Array([minX, minY, maxX, minY, maxX, maxY, minX, maxY]);
		if (this.vtxUVEnabled) {
			if (this.m_uvs == null) {
				if (this.flipVerticalUV) {
					this.m_uvs = new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
				} else {
					this.m_uvs = new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]);
				}
			}
		}
		let mh = this.mesh;

		mh.vsStride = 2;
		mh.autoBuilding = false;
		mh.vtxTotal = 4;
		mh.trisNumber = 2;
		mh.drawMode = CoRScene.RenderDrawMode.ELEMENTS_TRIANGLE_STRIP;

		mh.bounds = CoRScene.createAABB();
		mh.bounds.min.setXYZ(minX, minY, minX);
		mh.bounds.max.setXYZ(maxX, maxY, maxX);
		mh.bounds.updateFast();

		mh.setVS(this.m_vs);
		mh.setUVS(this.m_uvs);
		mh.setIVS(this.m_ivs);
	}
	destroy(): void {
		this.m_vs = null;
		this.m_uvs = null;
		this.m_ivs = null;
	}
}
export default class Billboard implements IBillboard {

	private m_material: BillboardMaterial = null;
	private m_mesh: BillboardMesh = null;

	private m_uniformData: Float32Array;
	private m_blendType: number = 0;
	private m_blendAlways: boolean = false;
	private m_rz: number = 0;
	private m_bw: number = 0;
	private m_bh: number = 0;
	brightnessEnabled: boolean = true;
	alphaEnabled: boolean = false;
	rotationEnabled: boolean = false;
	fogEnabled: boolean = false;
	entity: ITransformEntity = null;
	constructor() {}
	private initEntity(texList: IRenderTexture[]): void {
		if (this.m_material == null) {
			this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);
			let billml = (this.m_material = new BillboardMaterial());
			billml.brightnessEnabled = this.brightnessEnabled = true;
			billml.alphaEnabled = this.alphaEnabled = true;
			billml.rotationEnabled = this.rotationEnabled = true;
			billml.fogEnabled = this.fogEnabled = true;
			billml.initialize();
			let ml = billml.material;
			ml.setTextureList(texList);
			ml.addUniformDataAt("u_billParam", this.m_uniformData);
			let billmh = (this.m_mesh = new BillboardMesh());
			billmh.initialize(this.m_bw, this.m_bh);
			let mh = billmh.mesh;

			let entity = (this.entity = CoRScene.createDisplayEntityWithDataMesh(mh, ml, true));

			const RendererState = CoRScene.RendererState;
			entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);

			if(this.m_blendType == 1) {
				if (this.m_blendAlways) {
					this.entity.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
				}
				else {
					this.entity.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
				}
			}else if(this.m_blendType == 2){
				if (this.m_blendAlways) {
					this.entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
				}
				else {
					this.entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
				}
			}
		}
	}


    toTransparentBlend(always: boolean = false): void {
        this.brightnessEnabled = false;
        this.alphaEnabled = true;
		this.m_blendType = 1;
		this.m_blendAlways = always;
    }
    toBrightnessBlend(always: boolean = false): void {
        this.brightnessEnabled = true;
        this.alphaEnabled = false;
		this.m_blendType = 2;
    }

	initializeSquare(size: number, texList: IRenderTexture[]): void {
		this.m_bw = size;
		this.m_bh = size;
		this.initEntity(texList);
	}
	initialize(bw: number, bh: number, texList: IRenderTexture[]): void {
		this.m_bw = bw;
		this.m_bh = bh;
		this.initEntity(texList);
	}
	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
		this.m_uniformData[4] = pr;
		this.m_uniformData[5] = pg;
		this.m_uniformData[6] = pb;
		this.m_uniformData[7] = pa;
	}
	setRGB3f(pr: number, pg: number, pb: number):void {
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
	getRotationZ(): number {
		return this.m_rz;
	}
	setRotationZ(degrees: number): void {
		this.m_rz = degrees;
		this.m_uniformData[2] = degrees * ((degrees * Math.PI) / 180.0);
	}
	getScaleX(): number {
		return this.m_uniformData[0];
	}
	getScaleY(): number {
		return this.m_uniformData[1];
	}
	setScaleX(p: number): void {
		this.m_uniformData[0] = p;
	}
	setScaleY(p: number): void {
		this.m_uniformData[1] = p;
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_uniformData[0] = sx;
		this.m_uniformData[1] = sy;
	}
	setXYZ(px: number, py: number, pz: number): void {
		this.entity.setXYZ(px,py,pz);
	}
	setPosition(pos: IVector3D): void {
		this.entity.setPosition(pos);
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
	update(): void {
		this.entity.update();
	}
	destroy(): void {
		if (this.entity != null) {
			this.entity.destroy();
			this.entity = null;
		}
		if(this.m_material != null) {
			this.m_material.destroy();
			this.m_material = null;
		}
		if(this.m_mesh != null) {
			this.m_mesh.destroy();
			this.m_mesh = null;
		}
		this.m_uniformData = null;
	}
}
