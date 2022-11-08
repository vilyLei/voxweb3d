import IColor4 from "../../../vox/material/IColor4";
import { IUIPanel } from "../panel/IUIPanel";

interface IPanelSystem {
	setXY(panelName: string, px: number, py: number, type?: number): void;
	openPanel(panelName: string, type?: number): void;
	closePanel(panelName: string, type?: number): void;
	getPanel(panelName: string, type?: number): IUIPanel;
	
}
export { IPanelSystem };
