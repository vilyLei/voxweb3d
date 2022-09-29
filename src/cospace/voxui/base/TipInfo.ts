import IAABB from "../../../vox/geom/IAABB";
import IAABB2D from "../../../vox/geom/IAABB2D";
import IVector3D from "../../../vox/math/IVector3D";
import { ITipInfo } from "./ITipInfo";


import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;


interface IAligner {
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area: IAABB2D): IVector3D;
}

class LeftAligner implements IAligner {
	private m_pv: IVector3D = null;
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area: IAABB2D): IVector3D {

		if(this.m_pv == null) {
			this.m_pv = CoMath.createVec3();
		}

		let pv = this.m_pv;
		let ph = tipBounds.getHeight();
		let pw = tipBounds.getWidth();
		let minV = bounds.min;
		pv.x = minV.x - 2 - pw;
		pv.y = my + 2 - ph;

		return pv;
	}
}
class RightAligner implements IAligner {
	private m_pv: IVector3D = null;
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area: IAABB2D): IVector3D {
		if(this.m_pv == null) {
			this.m_pv = CoMath.createVec3();
		}
		let pv = this.m_pv;
		let ph = tipBounds.getHeight();
		let maxV = bounds.max;
		pv.x = maxV.x + 2;
		pv.y = my + 2 - ph;

		return pv;
	}
}
class TopAligner implements IAligner {
	private m_pv: IVector3D = null;
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area: IAABB2D): IVector3D {

		if(this.m_pv == null) {
			this.m_pv = CoMath.createVec3();
		}

		let pv = this.m_pv;
		let maxV = bounds.max;
		pv.x = mx + 2;
		pv.y = maxV.y + 2;

		return pv;
	}
}

class BottomAligner implements IAligner {
	private m_pv: IVector3D = null;
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area: IAABB2D): IVector3D {

		if(this.m_pv == null) {
			this.m_pv = CoMath.createVec3();
		}

		let pv = this.m_pv;
		let ph = tipBounds.getHeight();
		// let pw = tipBounds.getWidth();
		let minV = bounds.min;
		pv.x = mx + 2;
		pv.y = minV.y - 2 - ph;

		return pv;
	}
}
const __$leftAligner = new LeftAligner();
const __$rightAligner = new RightAligner();
const __$topAligner = new TopAligner();
const __$bottomAligner = new BottomAligner();

class TipInfo implements ITipInfo {

	private m_content = "ui entity tip info";
	private m_aligner: IAligner = null;
	// follow = true;
	constructor() {
	}
	setContent(c: string): ITipInfo {
		this.m_content = c;
		return this;
	}
	getCotent(): string {
		return this.m_content;
	}
	alignLeft(): ITipInfo {
		this.m_aligner = __$leftAligner;
		return this;
	}
	alignRight(): ITipInfo {
		this.m_aligner = __$rightAligner;
		return this;
	}
	alignTop(): ITipInfo {
		this.m_aligner = __$topAligner;
		return this;
	}
	alignBottom(): ITipInfo {
		this.m_aligner = __$bottomAligner;
		return this;
	}
	getPos(mx: number, my: number, bounds: IAABB, tipBounds: IAABB, area: IAABB2D = null): IVector3D {
		if(this.m_aligner == null) {
			this.m_aligner = new LeftAligner();
		}
		return this.m_aligner.getPos(mx, my, bounds, tipBounds, area);
	}
	destroy(): void {
		this.m_aligner = null;
	}

}

export { TipInfo }
