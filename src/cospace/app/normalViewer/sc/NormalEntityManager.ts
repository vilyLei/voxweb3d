
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

class NormalEntityManager {

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
			this.ctrPanel.setModelVisiFlag(entitys != null && entitys.length > 0);
			// console.log("NormalEntityGroup get select entities action.");
			this.testSelect();
		});
	}

	private testSelect(): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			let lineVisible = false;
			let dif = false;
			let flip = false;
			let cpl = this.ctrPanel;

			let scaleBase = cpl.getNormalScale();

			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					if (node.normalLine.getVisible()) {
						lineVisible = true;
					}
					if (node.isShowDifference()) {
						dif = true;
					}
					if (node.isNormalFlipping()) {
						flip = true;
					}
					node.select();
				}
			}
			this.m_scaleBase = scaleBase < 0.1 ? 0.1 : scaleBase;
			cpl.setNormalFlag(lineVisible);
			cpl.setNormalFlipFlag(flip);
			cpl.setDifferenceFlag(dif);
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
	private flipNormalLine(boo: boolean): void {

		let ls = this.m_selectEntities;

		if (ls != null) {

			let map = this.m_map;

			for (let i = 0; i < ls.length; ++i) {

				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.flipNormal(boo);
				}
			}
		}
	}
	applyFeatureColor(uuid: string): void {

		console.log("applyFeatureColor: ", uuid);
		let ls = this.m_selectEntities;
		if (ls != null && ls.length > 0) {
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
	}
	applyCtrlFlag(uuid: string, flag: boolean): void {

		console.log("applyCtrlFlag: ", uuid, flag);
		let ls = this.m_selectEntities;
		if (ls != null && ls.length > 0) {
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
	}
	applyNormalScale(f: number): void {
		
		let ls = this.m_selectEntities;
		if (ls != null && ls.length > 0) {

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
	}

	addNode(node: NormalEntityNode): void {

		if(node != null) {
			
			let map = this.m_map;
			if(node.getUid() >= 0 && !map.has(node.getUid())) {
				map.set(node.getUid(), node);
			}
		}
	}
	removeNode(node: NormalEntityNode): void {
		
		if(node != null) {
			
			let map = this.m_map;
			if(node.getUid() >= 0 && map.has(node.getUid())) {
				map.delete(node.getUid());
			}
		}
	}

	destroy(): void {
		this.m_selectEntities = null;
		this.m_map.clear();
	}
}
export { NormalEntityManager };
