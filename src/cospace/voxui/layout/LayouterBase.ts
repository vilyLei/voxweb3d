import IVector3D from "../../../vox/math/IVector3D";
import IAABB2D from "../../../vox/geom/IAABB2D";
import { IUIEntity } from "../entity/IUIEntity";
import { IUILayouter } from "./IUILayouter";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class LayouterBase implements IUILayouter{
	
	protected m_entities: IUIEntity[] = [];
	protected m_opvs: IVector3D[] = [];
	protected m_initRect: IAABB2D = null;
	protected m_offsetV: IVector3D = CoMath.createVec3();
	constructor() { }

	setOffset(offsetV: IVector3D): void {
		this.m_offsetV.copyFrom( offsetV );
	}
	addUIEntity(entity: IUIEntity): void {
		if (entity != null) {
			let i = 0;
			for (; i < this.m_entities.length; ++i) {
				if (this.m_entities[i] == entity) break;
			}
			if (i >= this.m_entities.length) {
				
				let pv = CoMath.createVec3();
				entity.getPosition(pv);
				this.m_opvs.push(pv);
				this.m_entities.push(entity);
				if (this.m_initRect != null) {
					this.initEntityLayout(entity, this.m_initRect);
				}
			}
		}
	}
	removeUIEntity(entity: IUIEntity): void {
		if (entity != null) {
			let i = 0;
			for (; i < this.m_entities.length; ++i) {
				if (this.m_entities[i] == entity) {
					this.m_entities.splice(i, 1);
					this.m_opvs.splice(i, 1);
					break;
				}
			}
		}
	}

	initLayout(rect: IAABB2D): void {

		if (rect != null) {
			if (this.m_initRect != null) {
				this.m_initRect.copyFrom(rect);
			} else {
				this.m_initRect = rect.clone();
			}
			let ls = this.m_entities;
			for (let i = 0; i < ls.length; ++i) {
				this.initEntityLayout(ls[i], this.m_initRect);
			}
		}
	}
	protected initEntityLayout(entity: IUIEntity, initRect: IAABB2D): void {

	}
	applyLayout(entity: IUIEntity): void {
	}
	update(rect: IAABB2D): void {
	}
	destroy(): void {
	}
}
export { LayouterBase };
