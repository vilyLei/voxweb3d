import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { NVTransUI } from "../ui/NVTransUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import IMouseEventEntity from "../../../../vox/entity/IMouseEventEntity";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import { NormalLineMaterial } from "../material/NormalLineMaterial";
import { NormalEntityMaterial } from "../material/NormalEntityMaterial";
import IColor4 from "../../../../vox/material/IColor4";
import { NormalEntityBuilder } from "./NormalEntityBuilder";

import { ICoRScene } from "../../../voxengine/ICoRScene";
import IVector3D from "../../../../vox/math/IVector3D";
declare var CoRScene: ICoRScene;

class NormalEntityNode {

	private static s_entityBuilder: NormalEntityBuilder = new NormalEntityBuilder();
	private m_normalFlip: boolean = false;
	private m_showDifference: boolean = false;
	private m_entityMaterial: NormalEntityMaterial;
	private m_normalMaterial: NormalLineMaterial;
	private m_color: IColor4 = null;
	private m_normalScale = 1.0;
	private m_normalScale0 = 1.0;
	private m_uid: number = -1;

	rsc: IRendererScene;
	transUI: NVTransUI;
	groupUid = -1;
	entity: IMouseEventEntity = null;
	private m_normalLine: ITransformEntity = null;

	constructor() {
	}
	setLineVisible(v: boolean): void {
		if (v) {
			this.createNormalLine();
		}
		if (this.m_normalLine != null) this.m_normalLine.setVisible(v);
	}
	getLineVisible(): boolean {
		return this.m_normalLine != null && this.m_normalLine.getVisible();
	}
	setVisible(v: boolean): void {
		this.setLineVisible(v);
		this.entity.setVisible(v);
	}
	getUid(): number {
		return this.m_uid;
	}
	getEntityMaterial(): NormalEntityMaterial {
		return this.m_entityMaterial;
	}
	showLocalNormal(): void {
		this.m_entityMaterial.applyLocalNormal();
		this.m_entityMaterial.applyNormalColor();
	}
	showGlobalNormal(): void {
		this.m_entityMaterial.applyGlobalNormal();
		this.m_entityMaterial.applyNormalColor();
	}
	showModelColor(boo: boolean): void {
		if (boo) {
			this.m_entityMaterial.applyModelColor();
		} else {
			this.m_entityMaterial.applyNormalColor();
		}
	}
	showDifference(boo: boolean = true): void {
		this.m_showDifference = boo;
		this.m_entityMaterial.applyDifference(boo);
	}
	isShowDifference(): boolean {
		return this.m_showDifference;
	}
	setEntityModel(model: CoGeomDataType, nivs: Uint16Array | Uint32Array = null): IMouseEventEntity {
		if (this.entity != null) {
			return this.entity;
		}
		this.m_color = CoRScene.createColor4();
		let builder = NormalEntityNode.s_entityBuilder;
		let normalEntity = builder.createNormalEntity(model, nivs);
		this.m_entityMaterial = builder.getEntityMaterial();
		this.rsc.addEntity(normalEntity)
		this.readyCreateNormalLine(model);

		this.entity = normalEntity;
		this.m_uid = this.entity.getUid();
		this.entity.mouseEnabled = false;
		// this.applyEvt(this.entity);
		return this.entity;
	}
	select(): void {
		this.m_normalScale0 = this.m_normalScale;
	}
	applyNormalLineScale(s: number): void {
		s *= this.m_normalScale0;
		this.m_normalScale = s;
		if (this.m_normalMaterial != null) this.m_normalMaterial.setLength(s);
	}
	flipNormal(boo: boolean): void {
		this.m_normalFlip = boo;
		let s = boo ? -1.0 : 1.0;
		if (this.m_normalMaterial != null) this.m_normalMaterial.setScale(s);
		this.m_entityMaterial.setNormalScale(s);
	}
	isNormalFlipping(): boolean {
		return this.m_normalFlip;
	}
	setNormalLineColor(c: IColor4): void {
		if (this.m_normalMaterial != null) this.m_normalMaterial.setColor(c);
	}

	getNormalLineColor(): IColor4 {

		this.m_color.setRGB3f(1.0, 0.0, 1.0);

		if (this.m_normalMaterial != null) {
			this.m_normalMaterial.getColor(this.m_color);
		}
		return this.m_color;
	}

	private m_model: CoGeomDataType;
	private readyCreateNormalLine(model: CoGeomDataType): void {
		this.m_model = model;
	}
	private createNormalLine(size: number = 5): void {
		if (this.m_normalLine == null) {
			// console.log("XXXXXX create normal line");
			let m = this.m_model;
			let builder = NormalEntityNode.s_entityBuilder;
			this.m_normalLine = builder.createNormalLineEntity(this.entity, m.vertices, m.normals, size);
			this.m_normalMaterial = builder.getNormalLineMaterial();
			this.m_normalScale = builder.getNormalLineScale();
			if (this.m_normalLine.getMesh() != null) {
				this.rsc.addEntity(this.m_normalLine);
			}
		}
	}
	applyEvent(): void {
		this.applyEvt(this.entity);
	}
	private applyEvt(entity: IMouseEventEntity): void {

		entity.mouseEnabled = true;

		let ME = CoRScene.MouseEvent;
		entity.addEventListener(ME.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(ME.MOUSE_OUT, this, this.mouseOutTargetListener);
		entity.addEventListener(ME.MOUSE_DOWN, this, this.mouseDownTargetListener);
		
		// entity.addEventListener(ME.MOUSE_DOUBLE_CLICK, this, this.mouseDBClickTargetListener);
		// entity.addEventListener(ME.MOUSE_CLICK, this, this.mouseClickTargetListener);
		// entity.addEventListener(ME.MOUSE_UP, this, this.mouseUpTargetListener);
		// 如果双击/(shift+单击)一个entity则全部选中这个group
	}
	private mouseClickTargetListener(evt: any): void {
		console.log("mouseClickTargetListener()....");
	}
	private mouseDBClickTargetListener(evt: any): void {
		console.log("mouseDBClickTargetListener()....");
	}
	private mouseOverTargetListener(evt: any): void {
		this.m_entityMaterial.setRGB3f(0.8, 0.8, 0.8);
	}
	private mouseOutTargetListener(evt: any): void {
		this.m_entityMaterial.setRGB3f(0.7, 0.7, 0.7);
	}
	private mouseDownTargetListener(evt: any): void {

		// console.log("mouseDownTargetListener()..., evt.target: ", evt.target);

		let entity = evt.target as ITransformEntity;
		this.transUI.selectEntities([entity]);
	}
	// private mouseUpTargetListener(evt: any): void {
	// 	console.log("mouseUpTargetListener() mouse up...");
	// }

	setPosition(pv: IVector3D): void {
		if (this.entity != null) {
			this.entity.setPosition(pv);
		}
	}
	getPosition(pv: IVector3D): IVector3D {
		if (this.entity != null) {
			return this.entity.getPosition(pv);
		}
		return pv;
	}
	update(): void {
		if (this.entity != null) {
			this.entity.update();
		}
	}
	destroy(): void {
		this.rsc = null;
		if (this.entity != null) {

			this.rsc.removeEntity(this.entity);
			this.rsc.removeEntity(this.m_normalLine);

			this.entity.destroy();
			this.m_normalLine.destroy();

			this.entity = null;
			this.m_normalLine = null;
		}
	}
}
export { NormalEntityNode };
