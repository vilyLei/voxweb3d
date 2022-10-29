import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoUI } from "../../../voxui/ICoUI";
import { NormalViewerScene } from "./NormalViewerScene";
import { CoDataModule } from "../../../app/common/CoDataModule";
import { TransUI } from "../../../edit/demo/edit/ui/TransUI";

declare var CoUI: ICoUI;

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;

class NormalViewer {

	private m_uiscene: ICoUIScene = null;
	normalScene: NormalViewerScene = null;
	
	constructor() {}
	getUIScene(): ICoUIScene {
		return this.m_uiscene;
	}
	initialize(uiscene: ICoUIScene, coapp: CoDataModule, transUI: TransUI): void {

		if (this.m_uiscene == null) {
			this.m_uiscene = uiscene;
			this.normalScene = new NormalViewerScene();
			this.normalScene.initialize(uiscene, coapp, transUI);
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
