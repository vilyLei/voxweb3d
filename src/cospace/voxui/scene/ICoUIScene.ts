import IRendererScene from "../../../vox/scene/IRendererScene";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";

import { IUIEntity } from "../entity/IUIEntity";

interface ICoUIScene {
	readonly rscene: IRendererScene;
	readonly texAtlas: ICanvasTexAtlas;
	initialize(crscene?: ICoRendererScene): void;
	addEntity(entity: IUIEntity): void;
	removeEntity(entity: IUIEntity): void;
	run(): void;
}

export { ICoUIScene };
