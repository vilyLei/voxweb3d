import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { NormalViewerScene } from "./NormalViewerScene";
import { CoDataModule } from "../../../app/common/CoDataModule";
import { NVTransUI } from "../ui/NVTransUI";

import { ICoUI } from "../../../voxui/ICoUI";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";

declare var CoUI: ICoUI;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalViewer {

	private m_uiscene: ICoUIScene = null;
	private m_codata = new CoDataModule();
	normalScene: NormalViewerScene = null;
	
	constructor() {}
	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}
	initialize(uiscene: ICoUIScene, transUI: NVTransUI): void {

		if (this.m_uiscene == null) {
			
			this.m_codata.initialize(null, true);
			this.m_uiscene = uiscene;
			this.normalScene = new NormalViewerScene();
			this.normalScene.initialize(uiscene, this.m_codata, transUI);
		}
	}
	destroy(): void {
		this.m_uiscene = null;
		if(this.normalScene != null) {
			this.normalScene.destroy();
			this.normalScene = null;
		}
	}
	open(scene: ICoUIScene = null): void {
		this.normalScene.open();
	}
	isOpen(): boolean {
		return true;
	}
	close(): void {
		this.normalScene.close();
	}
	update(): void {
		this.normalScene.update();
	}
}
export { NormalViewer };
