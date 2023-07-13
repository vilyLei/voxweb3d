import { HTMLViewerLayer } from "../base/HTMLViewerLayer";
import { IDataItemComponentParam } from "./IDataItemComponentParam";
interface IParamInputPanel {
	viewLayer: HTMLViewerLayer;
	// param: IDataItemComponentParam;
	setParam(param: IDataItemComponentParam): void;
	initialize(viewerLayer: HTMLDivElement, areaWidth: number, areaHeight: number, layoutHorizon: boolean): void;
	setVisible(v: boolean): void;
	isVisible(): boolean;
	open(): void;
	isOpen(): boolean;
	close(): void;
}
export { IParamInputPanel };
