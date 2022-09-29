import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IVector3D from "../../../vox/math/IVector3D";
import { IUILayouter } from "./IUILayouter";
import IAABB2D from "../../../vox/geom/IAABB2D";
import { IUIEntity } from "../entity/IUIEntity";
import { LayouterBase } from "./LayouterBase";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

class RightTopLayouter extends LayouterBase implements IUILayouter {

	protected m_offsetvs: IVector3D[] = [];
	constructor() { super(); }

	update(rect: IAABB2D): void {

		const ls = this.m_entities;
		const len = ls.length;
		
		let pv = CoMath.createVec3();
		for (let i = 0; i < len; ++i) {
			pv.copyFrom(this.m_offsetvs[i]);
			pv.x = rect.width - pv.x;
			pv.y = rect.height - pv.y;
			ls[i].setPosition(pv);
			ls[i].update();
		}
	}

	protected initEntityLayout(entity: IUIEntity, initRect: IAABB2D): void {

		let pv = CoMath.createVec3();
		entity.getPosition(pv);
		pv.x = initRect.width - pv.x;
		pv.y = initRect.height - pv.y;
		this.m_offsetvs.push( pv );

	}
	destroy(): void {
		this.m_offsetvs = null;
		super.destroy();
	}
}
export { RightTopLayouter };
