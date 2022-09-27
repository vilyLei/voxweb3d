import IRendererScene from "../../../vox/scene/IRendererScene";
import { IUILayouter } from "./IUILayouter";
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

interface IUILayout {
	createLeftTopLayouter(): IUILayouter;
	createRightTopLayouter(): IUILayouter;
	createRightBottomLayouter(): IUILayouter;

	initialize(uirsc: IRendererScene): void;
	addLayouter(layouter: IUILayouter): void;
	removeLayouter(layouter: IUILayouter): void;
	/**
	 * 每次更新都将重新计算
	 */
	update(): void;
	destroy(): void;
}
export { IUILayout };
