import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import { NormalEntityNode } from "./NormalEntityNode";
import { NVTransUI } from "../ui/NVTransUI";

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
import IColor4 from "../../../../vox/material/IColor4";

declare var CoUI: ICoUI;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalEntityManager {

	ctrPanel: NormalCtrlPanel;
	rsc: IRendererScene;
	transUI: NVTransUI;
	private m_map: Map<number, NormalEntityNode> = new Map();
	private m_selectEntities: ITransformEntity[] = null;
	private m_scaleBase = 1.0;
	private m_visible: boolean = false;
	constructor() {
	}
	initialize(): void {
		this.transUI.addSelectFilter((list: IRenderEntity[]): IRenderEntity[] => {
			console.log("use a list filter() ...");
			let interac = this.transUI.getKeyInterac();
			let keyCode = interac.getCurrDownKeyCode();
			if(keyCode) {
				console.log("use a SHIFT Key Down.");
			}
			return list;
		});
		this.transUI.addSelectListener((list: IRenderEntity[]): void => {
			this.setSelectedModelVisible(true);
			let entitys = list as ITransformEntity[];
			this.m_selectEntities = entitys;
			this.ctrPanel.setModelVisiFlag(entitys != null && entitys.length > 0);
			// console.log("NormalEntityGroup get select entities action.");
			this.testSelect();
		});
	}
	setVisible(visible: boolean): void {
		if(this.m_visible != visible) {
			this.m_visible = visible;
			for(let [k,v] of this.m_map.entries()) {
				v.setVisible(visible);
			}
		}
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
			let firstLNode: NormalEntityNode = null;
			let firstNode: NormalEntityNode = null;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					if(firstNode == null)
						firstNode = node;
					if (node.getLineVisible()) {
						lineVisible = true;
						if(firstLNode == null)
							firstLNode = node;
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
			//getEntityMaterial
			this.m_scaleBase = scaleBase < 0.1 ? 0.1 : scaleBase;
			cpl.setNormalFlag(lineVisible);
			cpl.setNormalFlipFlag(flip);
			cpl.setDifferenceFlag(dif);
			if(firstLNode != null)
				cpl.setNormalLineColor( firstLNode.getNormalLineColor() );
			if(firstNode != null){
				let m = firstNode.getEntityMaterial();
				if(m.isApplyingModelColor()) {
					cpl.setDisplayMode("modelColor");
				}else {
					if(m.isApplyingLocalNormal()) {
						cpl.setDisplayMode("local");
					}else {
						cpl.setDisplayMode("global");
					}
				}
				//cpl.setNormalLineColor( firstNode.getNormalLineColor() );
			}
		}
	}

	private setSelectedNormalLineVisible(v: boolean): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let cpl = this.ctrPanel;
			let map = this.m_map;
			let firstLNode: NormalEntityNode = null;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					if(firstLNode == null)
						firstLNode = node;
					node.setLineVisible(v);
				}
			}
			if(v)
				cpl.setNormalLineColor( firstLNode.getNormalLineColor() );
		}
	}
	private setSelectedModelVisible(v: boolean): void {

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
	normalScaleBtnSelect(): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			let cpl = this.ctrPanel;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.select();
				}
			}
		}
	}
	
	setNormalLineColor(c: IColor4): void {
		let ls = this.m_selectEntities;
		if (ls != null) {
			let map = this.m_map;
			for (let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if (node != null) {
					node.setNormalLineColor(c);
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
				case "normalTest":
					// this.setModelColor(true);
					console.log("test");
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
					this.setSelectedNormalLineVisible(flag);
					break;
				case "model":
					this.setSelectedModelVisible(flag);
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
