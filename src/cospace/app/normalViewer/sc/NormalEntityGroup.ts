
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
		if(ls != null) {
			let map = this.m_map;
			let lineVisible = false;
			let scaleBase = this.ctrPanel.getNormalScale();
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					if(node.normalLine.getVisible()) {
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
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.normalLine.setVisible(v);
				}
			}
		}
	}
	private setModelVisible(v: boolean): void {
		let ls = this.m_selectEntities;
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.entity.setVisible(v);
				}
			}
		}
	}
	
	private setModelColor(v: boolean): void {
		let ls = this.m_selectEntities;
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.showModelColor(v);
				}
			}
		}
	}
	
	private showNormalLocalColor(): void {
		let ls = this.m_selectEntities;
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.showLocalNormal();
				}
			}
		}
	}
	private showNormalGlobalColor(): void {
		let ls = this.m_selectEntities;
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.showGlobalNormal();
				}
			}
		}
	}
	private showDifferenceColor(): void {
		let ls = this.m_selectEntities;
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.showDifference();
				}
			}
		}
	}
	applyFeatureColor(uuid: string): void {
		switch (uuid) {
			case "local":
				this.showNormalLocalColor();
				break;
			case "global":
				this.showNormalGlobalColor();
				break;
			case "difference":
				this.showDifferenceColor();
				break;
			default:
				break;
		}
	}
	applyVisibility(uuid: string, flag: boolean): void {
		
		switch (uuid) {
			case "normal":
				this.setNormalVisible(flag);
				break;
			case "model":
				this.setModelVisible(flag);
				break;
			case "modelColor":
				this.setModelColor(flag);
				break;
			default:
				break;
		}
	}
	applyNormalScale(f: number): void {
		// f = 0.1 + f * 3.0;
		f = f / this.m_scaleBase;
		f = 0.1 + f * 1.0;

		let ls = this.m_selectEntities;
		if(ls != null) {
			let map = this.m_map;
			for(let i = 0; i < ls.length; ++i) {
				const node = map.get(ls[i].getUid());
				if(node != null) {
					node.applyNormalLineScale( f );
				}
			}
		}
	}
	addEntityWithModel(model: CoGeomDataType): IMouseEventEntity {
		if (model != null) {
			let map = this.m_map;
			// if(!map.has(entity.getUid())) {
			let node = new NormalEntityNode();
			node.rsc = this.rsc;
			node.transUI = this.transUI;
			let entity = node.setEntityModel(model);
			map.set(entity.getUid(), node);
			return entity;
			// }
		}

	}
	destroy(): void {

		this.rsc = null;
		this.m_map.clear();
	}
}
export { NormalEntityGroup };
