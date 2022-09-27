
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IAABB2D from "../../../vox/geom/IAABB2D";
import IVector3D from "../../../vox/math/IVector3D";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IUILayouter } from "./IUILayouter";
import { IUILayout } from "./IUILayout";
import { ICoMath } from "../../math/ICoMath";
import { LeftTopLayouter } from "./LeftTopLayouter";
import { RightTopLayouter } from "./RightTopLayouter";
import { RightBottomLayouter } from "./RightBottomLayouter";

declare var CoMath: ICoMath;
class UILayout implements IUILayout {

	private m_layouters: IUILayouter[] = [];
	private m_uirsc: IRendererScene = null;
	private m_stage: IRenderStage3D = null;
	private m_rect: IAABB2D = null;

	constructor() { }

	createLeftTopLayouter(): LeftTopLayouter {
		let l = new LeftTopLayouter();
		this.addLayouter(l);
		return l;
	}
	createRightTopLayouter(): IUILayouter {
		let l = new RightTopLayouter();
		this.addLayouter(l);
		return l;
	}
	createRightBottomLayouter(): IUILayouter {
		let l = new RightBottomLayouter();
		this.addLayouter(l);
		return l;
	}
	initialize(uirsc: IRendererScene): void {
		if (this.m_uirsc == null && uirsc != null) {
			this.m_uirsc = uirsc;
			this.m_stage = uirsc.getStage3D();

			let st = this.m_stage;
			this.m_rect = CoMath.createAABB2D(0, 0, st.stageWidth, st.stageHeight);
		}
	}
	addLayouter(layouter: IUILayouter): void {
		if (layouter != null) {
			let i = 0;
			let ls = this.m_layouters;
			for (; i < ls.length; ++i) {
				if (ls[i] == layouter) break;
			}
			if (i >= ls.length) {
				ls.push(layouter);
				layouter.initLayout(this.m_rect);
			}
		}
	}
	removeLayouter(layouter: IUILayouter): void {
		if (layouter != null) {
			let i = 0;
			let ls = this.m_layouters;
			for (; i < ls.length; ++i) {
				if (ls[i] == layouter) {
					ls.splice(i, 1);
					break;
				}
			}
		}
	}
	/**
	 * 每次更新都将重新计算
	 */
	update(): void {
		let st = this.m_stage;
		this.m_rect.setTo(0, 0, st.stageWidth, st.stageHeight);

		for (let i = 0; i < this.m_layouters.length; ++i) {
			this.m_layouters[i].update(this.m_rect);
		}
	}
	destroy(): void {

	}
}
export { UILayout };
