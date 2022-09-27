import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";

import { IUIEntity } from "../entity/IUIEntity";
import { IUILayout } from "../layout/IUILayout";

interface ICoUIScene {
	readonly rscene: IRendererScene;
	readonly texAtlas: ICanvasTexAtlas;
	readonly layout: IUILayout;
	initialize(crscene?: ICoRendererScene): void;
	getStage(): IRenderStage3D;
	addEntity(entity: IUIEntity, processid?: number): void;
	removeEntity(entity: IUIEntity): void;
	run(): void;
}

export { ICoUIScene };
