import { ICoRScene } from "../../../voxengine/ICoRScene";
import { NVTransUI } from "../ui/NVTransUI";

import { NormalEntityNode } from "./NormalEntityNode";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import { NormalEntityManager } from "./NormalEntityManager";

import {NVEntityGroup} from "./NVEntityGroup";
import { ICoText } from "../../../voxtext/ICoText";
import IVector3D from "../../../../vox/math/IVector3D";
import { IH5Text } from "../../../voxtext/base/IH5Text";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IRunnable from "../../../../vox/base/IRunnable";
import IRenderEntity from "../../../../vox/render/IRenderEntity";

declare var CoRScene: ICoRScene;
declare var CoText: ICoText;

class NormalExampleGroup extends NVEntityGroup implements IRunnable {

	private m_nodes: NormalEntityNode[] = [];
	private m_nodeEntities: ITransformEntity[] = [];
	private m_textEntities: ITransformEntity[] = [];
	private m_textHeight = 130.0;
	
	constructor() { super(); }
	protected createNodes(): void {

		let mesh = this.m_rscene.entityBlock.unitBox.getMesh();
		let correct_model: CoGeomDataType = {
			uvsList: [mesh.getUVS().slice(0)],
			vertices: mesh.getVS().slice(0),
			normals: mesh.getNVS().slice(0),
			indices: mesh.getIVS().slice(0)
		}
		let sm = correct_model;
		let vs = sm.vertices;
		for (let i = 0; i < vs.length; ++i) {
			vs[i] *= 75.0;
		}
		let normalHasNot_model: CoGeomDataType = {
			uvsList: sm.uvsList,
			vertices: sm.vertices,
			normals: null,
			indices: sm.indices
		}
		let begin = 12 * 0;
		let end = 12 * 2;
		let nvs = sm.normals.slice(0);
		for (let i = begin; i < end; ++i) {
			nvs[i] = 1.0;
		}
		let inclinedNormal_model: CoGeomDataType = {
			uvsList: sm.uvsList,
			vertices: sm.vertices,
			normals: nvs,
			indices: sm.indices
		}
		nvs = sm.normals.slice(0);

		let ivs = sm.indices.slice(0);
		this.flipTriWrap(0, ivs);
		this.flipTriWrap(1, ivs);
		this.flipTriWrap(2, ivs);
		this.flipTriWrap(3, ivs);

		// console.log("A: ", sm.indices);
		// console.log("B: ", ivs);

		let wrapErr_model: CoGeomDataType = {
			uvsList: sm.uvsList,
			vertices: sm.vertices,
			normals: nvs,
			indices: ivs
		}

		let cfg = this.m_transUI.getCoUIScene().uiConfig;
		let uiCfg = cfg.getUIPanelCfgByName("exampleGroup");
		let items = uiCfg.items;

		let textHeight = this.m_textHeight;
		let h5Text = CoText.createH5Text(this.m_rscene, "text_cv_01", 22, 512, 512);

		let mana = this.entityManager;
		let pv = CoRScene.createVec3();
		let node = this.createEntityWithModel(correct_model, pv.setXYZ(-70.0, 0.0, 70.0));
		mana.addNode(node);
		pv.y += textHeight;
		// this.createStaticText(pv, "法线正确", h5Text);
		this.createStaticText(pv, items[0].text, h5Text);

		node = this.createEntityWithModel(normalHasNot_model, pv.setXYZ(-220.0, 0.0, 220.0));
		mana.addNode(node);
		pv.y += textHeight;
		// this.createStaticText(pv, "没有法线数据", h5Text);
		this.createStaticText(pv, items[1].text, h5Text);

		node = this.createEntityWithModel(inclinedNormal_model, pv.setXYZ(70.0, 0.0, -70.0));
		node.showDifference();
		node.showModelColor(true);
		mana.addNode(node);
		pv.y += textHeight;
		// this.createStaticText(pv, "法线错误倾斜", h5Text);
		this.createStaticText(pv, items[2].text, h5Text);

		node = this.createEntityWithModel(wrapErr_model, pv.setXYZ(220.0, 0.0, -220.0), sm.indices);
		node.showDifference();
		node.showModelColor(true);
		mana.addNode(node);
		pv.y += textHeight;
		// this.createStaticText(pv, "顶点绕序错误", h5Text);
		this.createStaticText(pv, items[3].text, h5Text);


	}
	private flipTriWrap(triIndex: number, ivs: Uint16Array | Uint32Array): void {

		let ia = triIndex * 3;
		let ib = ia + 2;

		let k = ivs[ia];
		ivs[ia] = ivs[ib];
		ivs[ib] = k;

		// ia = triIndex * 6 + 3;
		// ib = ia + 2;
		// k = ivs[ia];
		// ivs[ia] = ivs[ib];
		// ivs[ib] = k;
	}
	private createEntityWithModel(model: CoGeomDataType, pv: IVector3D, nivs: Uint16Array | Uint32Array = null): NormalEntityNode {
		let node = new NormalEntityNode();
		node.rsc = this.m_rscene;
		node.transUI = this.m_transUI;
		node.setEntityModel(model, nivs);

		// node.entity.setRotationXYZ(45, 0.0, -45);

		node.setPosition(pv);
		node.update();
		node.applyEvent();
		// node.createNormalLine(5);
		this.m_nodeEntities.push(node.entity);
		this.m_nodes.push(node);
		node.groupUid = this.m_uid;
		return node;
	}

	private createStaticText(pv: IVector3D, text: string, h5Text: IH5Text): void {

		let t = CoText.createStaticTextEntity(text, h5Text);
		t.setPosition(pv)
		t.update();
		let entity = t.getREntity();
		this.m_rscene.addEntity(entity, 1);
		this.m_textEntities.push(entity);
	}
	setEnabled(enabled: boolean): void {

		if (this.m_enabled !== enabled) {

			let mana = this.entityManager;
			let ns = this.m_nodes;
			let ts = this.m_textEntities;

			if (!enabled) {
				for (let i = 0; i < ns.length; ++i) {
					mana.removeNode(ns[i]);
					ns[i].setVisible(false);
					this.m_rscene.removeEntity(ts[i]);
				}
			}

			this.m_enabled = enabled;
		}
	}
	
	getAllEntities(): IRenderEntity[] {
		let nodes = this.m_nodes;
		let entities: IRenderEntity[] = [];
		for(let i = 0; i < nodes.length; ++i) {
			if(nodes[i].entity.isVisible()) {
				entities.push(nodes[i].entity);
			}
		}
		return entities;
	}
	update(): void {
	}
	destroy(): void {
		this.entityManager = null;
		if (this.m_rscene != null) {
			let ls = this.m_nodes;
			let ts = this.m_textEntities;
			if (ls != null && ls.length > 0) {
				for (let i = 0; i < ls.length; ++i) {
					this.entityManager.removeNode(ls[i]);
					ls[i].destroy();
					this.m_rscene.removeEntity(ts[i]);
					ts[i].destroy();
				}
			}
			this.m_nodes = [];
			this.m_textEntities = [];
			this.entityManager = null;
			this.m_rscene = null;
			this.m_transUI = null;
		}
	}

	// private m_runFlag: number = -1;
	// setRunFlag(flag: number): void {
	// 	this.m_runFlag = flag;
	// }
	// getRunFlag(): number {
	// 	return this.m_runFlag;
	// }
	// isRunning(): boolean {
	// 	return this.m_enabled;
	// }
	// isStopped(): boolean {
	// 	return !this.m_enabled;
	// }
	run(): void {

		let ns = this.m_nodes;
		let ts = this.m_textEntities;
		
		let pv = this.m_pv;

		for (let i = 0; i < ns.length; ++i) {
			let entity = ns[i].entity;
			let trans0 = entity.getTransform();
			let trans1 = ts[i].getTransform();
			if (trans1.version != trans0.version) {
				entity.getPosition(pv);
				pv.y += this.m_textHeight;
				trans1.version != trans0.version;
				ts[i].setPosition(pv);
				ts[i].update();
				trans1.version = trans0.version;
			}
		}
	}
}
export { NormalExampleGroup };
