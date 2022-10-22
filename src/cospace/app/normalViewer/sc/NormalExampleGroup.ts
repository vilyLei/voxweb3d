import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoUI } from "../../../voxui/ICoUI";
import { NormalViewerScene } from "./NormalViewerScene";
import { ViewerCoSApp } from "../../../demo/coViewer/ViewerCoSApp";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";
import IRendererScene from "../../../../vox/scene/IRendererScene";

declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalExampleGroup {

	private m_rscene: IRendererScene = null;
	private m_visible: boolean = true;
	constructor() {}
	initialize(rscene: IRendererScene): void {

		if (this.m_rscene == null) {
			this.m_rscene = rscene;
		}
	}
	setVisible(v: boolean): void {
		this.m_visible = v;
	}
	isVisible(): boolean {
		return this.m_visible;
	}
	update(): void {
	}
	destroy(): void {
		if(this.m_rscene != null) {
			this.m_rscene = null;
		}
	}
}
export { NormalExampleGroup };
