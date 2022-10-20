
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { NormalEntityNode } from "./NormalEntityNode";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";

import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUI } from "../../../voxui/ICoUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";
import IMouseEventEntity from "../../../../vox/entity/IMouseEventEntity";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import { NormalCtrlPanel } from "../ui/NormalCtrlPanel";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../../app/CoSpaceAppData";
import IMatrix4 from "../../../../vox/math/IMatrix4";
import { NormalEntityLayout } from "./NormalEntityLayout";

declare var CoUI: ICoUI;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalEntityGroup {

	ctrPanel: NormalCtrlPanel;
	rsc: IRendererScene;
	transUI: TransUI;
	private m_map: Map<number, NormalEntityNode> = new Map();
	private m_selectEntities: ITransformEntity[] = null;
	private m_scaleBase = 1.0;
	constructor() {
	}
	initialize(): void {

		this.transUI.addSelectListener((list: IRenderEntity[]): void => {
			this.setModelVisible(true);
			let entitys = list as ITransformEntity[];
			this.m_selectEntities = entitys;
			this.ctrPanel.setModelFlag(entitys != null && entitys.length > 0);
			// console.log("NormalEntityGroup get select entities action.");
			this.testSelect();
		});
	}

	private testSelect(): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			let lineVisible = false;
			let scaleBase = this.ctrPanel.getNormalScale();
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					if (node.normalLine.getVisible()) {
						lineVisible = true;
					}
					node.select();
				}
			}
			this.m_scaleBase = scaleBase < 0.1 ? 0.1 : scaleBase;
			this.ctrPanel.setNormalFlag(lineVisible);
		}
	}

	private setNormalVisible(v: boolean): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.normalLine.setVisible(v);
				}
			}
		}
	}
	private setModelVisible(v: boolean): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.entity.setVisible(v);
				}
			}
		}
	}

	private setModelColor(v: boolean): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.showModelColor(v);
				}
			}
		}
	}

	private showNormalLocalColor(): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.showLocalNormal();
				}
			}
		}
	}
	private showNormalGlobalColor(): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.showGlobalNormal();
				}
			}
		}
	}
	private showDifferenceColor(boo: boolean = true): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.showDifference(boo);
				}
			}
		}
	}
	applyFeatureColor(uuid: string): void {
		console.log("applyFeatureColor: ", uuid);
		switch (uuid) {
			case "local":
				this.showNormalLocalColor();
				break;
			case "global":
				this.showNormalGlobalColor();
				break;
			case "modelColor":
				this.setModelColor(true);
				break;
			default:
				break;
		}
	}
	applyCtrlFlag(uuid: string, flag: boolean): void {
		console.log("applyCtrlFlag: ", uuid, flag);
		switch (uuid) {
			case "normal":
				this.setNormalVisible(flag);
				break;
			case "model":
				this.setModelVisible(flag);
				break;
			case "difference":
				this.showDifferenceColor(flag);
				break;
			case "normalFlip":
				this.flipNormalLine(flag);
				break;
			default:
				break;
		}
	}
	flipNormalLine(boo: boolean): void {

		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.flipNormalLine(boo);
				}
			}
		}
	}
	applyNormalScale(f: number): void {
		// f = 0.1 + f * 3.0;
		f = f / this.m_scaleBase;
		f = 0.1 + f * 1.0;

		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.applyNormalLineScale(f);
				}
			}
		}
	}
	reset(): void {
		this.m_transforms = [];
		this.m_transes = [];
	}
	addEntityWithModel(model: CoGeomDataType): NormalEntityNode {
		if (model != null) {
			let map = this.m_map;
			// if(!map.has(entity.getUid())) {
			let node = new NormalEntityNode();
			node.rsc = this.rsc;
			node.transUI = this.transUI;
			let entity = node.setEntityModel(model);
			map.set(entity.getUid(), node);


			this.m_transforms.push(null);
			this.m_transes.push(entity);

			return node;
			// }
		}
		return null;
	}

	private m_transforms: IMatrix4[] = [];
	private m_transes: ITransformEntity[] = [];
	private m_layoutor: NormalEntityLayout = null;

	updateLayout(rotationEnabled: boolean): void {
		if (this.m_layoutor == null) {
			this.m_layoutor = new NormalEntityLayout();
			this.m_layoutor.initialize();
		}
		this.m_layoutor.rotationEnabled = rotationEnabled;
		let pivot = CoRScene.createVec3();
		this.m_layoutor.fixToPosition(this.m_transes, this.m_transforms, pivot, 300.0);
	}
	destroy(): void {

		this.rsc = null;
		this.m_map.clear();
	}
}
export { NormalEntityGroup };
