import IRendererScene from "../../../vox/scene/IRendererScene";
import { IUILayouter } from "./IUILayouter";
import { ICoMath } from "../../math/ICoMath";
import IAABB2D from "../../../vox/geom/IAABB2D";
declare var CoMath: ICoMath;

interface IUILayout {

	createFreeLayouter(): IUILayouter;
	createLeftTopLayouter(): IUILayouter;
	createRightTopLayouter(): IUILayouter;
	createRightBottomLayouter(): IUILayouter;

	// initialize(uirsc: IRendererScene): void;
	initialize(rect: IAABB2D): void;
	getAreaRect(): IAABB2D;
	addLayouter(layouter: IUILayouter): void;
	removeLayouter(layouter: IUILayouter): void;
	/**
	 * 每次更新都将重新计算
	 */
	update(rect: IAABB2D): void;
	destroy(): void;
}
export { IUILayout };
