import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";

import { IUISceneEntity } from "./IUISceneEntity";
import { IUILayout } from "../layout/IUILayout";
import { IPromptSystem } from "../system/IPromptSystem";
import { ITipsSystem } from "../system/ITipsSystem";

interface ICoUIScene {
	
	readonly rscene: IRendererScene;
	readonly texAtlas: ICanvasTexAtlas;
	readonly transparentTexAtlas: ICanvasTexAtlas;
	readonly layout: IUILayout;
	prompt: IPromptSystem;
	tips: ITipsSystem;
	
	/**
	 * @param crscene the default value is null
	 * @param atlasSize the default value is 1024
	 * @param renderProcessesTotal the default value is 3
	 */
	initialize(crscene?: ICoRendererScene, atlasSize?: number, renderProcessesTotal?: number): void;
	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): ICoUIScene;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): ICoUIScene;
	getStage(): IRenderStage3D;
	getRect(): IAABB2D;
	addEntity(entity: IUISceneEntity, processid?: number): void;
	removeEntity(entity: IUISceneEntity): void;
	run(): void;
}

export { ICoUIScene };
