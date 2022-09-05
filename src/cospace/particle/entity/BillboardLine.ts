import IRawMesh from "../../../vox/mesh/IRawMesh";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IShaderMaterial from "../../../vox/material/mcase/IShaderMaterial";
import BillboardFragShaderBase from "../shader/BillboardFragShaderBase";
import IShaderCodeBuffer from "../../../vox/material/IShaderCodeBuffer";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IVector3D from "../../../vox/math/IVector3D";
import { BillboardLineMaterial } from "./BillboardLineMaterial";
import { IBillboardLine } from "./IBillboardLine";
import { BillboardLineMesh } from "./BillboardLineMesh";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoEntity } from "../../voxentity/ICoEntity";
declare var CoEntity: ICoEntity;

class BillboardLine implements IBillboardLine {

	private m_material: BillboardLineMaterial = null;
	private m_mesh: IRawMesh = null;

	private m_uniformData: Float32Array;
	private m_blendType: number = 0;
	private m_blendAlways: boolean = false;
	private m_rz = 0;
	private m_bw = 0;
	private m_bh = 0;
	brightnessEnabled: boolean = true;
	alphaEnabled: boolean = false;
	rotationEnabled: boolean = false;
	fogEnabled: boolean = false;
	entity: ITransformEntity = null;
	constructor() { }
	private initEntity(): void {

		if (this.m_material == null) {

			this.m_uniformData = new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]);

			let billml = this.m_material = new BillboardLineMaterial();
			billml.brightnessEnabled = this.brightnessEnabled;
			billml.alphaEnabled = this.alphaEnabled;
			billml.rotationEnabled = this.rotationEnabled;
			billml.fogEnabled = this.fogEnabled;

			billml.initialize(false);
			let ml = billml.material;
			ml.addUniformDataAt("u_billParam", this.m_uniformData);

			let entity = CoEntity.createDisplayEntity();
			entity.setMaterial(ml);
			entity.setMesh(this.m_mesh);
			this.entity = entity;
			
			///*
			const RendererState = CoRScene.RendererState;
			entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);

			if (this.m_blendType == 1) {
				if (this.m_blendAlways) {
					this.entity.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
				}
				else {
					this.entity.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
				}
			} else if (this.m_blendType == 2) {
				if (this.m_blendAlways) {
					this.entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
				}
				else {
					this.entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
				}
			}
			//*/
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

	initializeSquareXOY(size: number): void {

		this.m_bw = size;
		this.m_bh = size;
		let lBuilder = CoMesh.lineMeshBuilder;
		lBuilder.dynColorEnabled = true;
		this.m_mesh = lBuilder.createRectXOY(-0.5 * size, -0.5 * size, size, size);

		this.initEntity();
	}
	initializeRectXOY(bw: number, bh: number): void {

		this.m_bw = bw;
		this.m_bh = bh;
		let lBuilder = CoMesh.lineMeshBuilder;
		lBuilder.dynColorEnabled = true;
		this.m_mesh = lBuilder.createRectXOY(-0.5 * bw, -0.5 * bh, bw, bh);

		this.initEntity();
	}

	initializeCircleXOY(radius: number, segsTotal: number, center: IVector3D = null): void {

		this.m_bw = radius;
		this.m_bh = radius;
		let lBuilder = CoMesh.lineMeshBuilder;
		lBuilder.dynColorEnabled = true;
		this.m_mesh = lBuilder.createCircleXOY( radius, segsTotal, center );
		this.initEntity();
	}
	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
		this.m_uniformData[4] = pr;
		this.m_uniformData[5] = pg;
		this.m_uniformData[6] = pb;
		this.m_uniformData[7] = pa;
	}
	setRGB3f(pr: number, pg: number, pb: number): void {
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
		this.entity.setXYZ(px, py, pz);
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
		if (this.m_material != null) {
			this.m_material.destroy();
			this.m_material = null;
		}
		this.m_mesh = null;
		this.m_uniformData = null;
	}
}
export { BillboardLine }