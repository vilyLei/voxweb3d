import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";

import { IUISceneEntity } from "./IUISceneEntity";
import { IUILayout } from "../layout/IUILayout";
import { IPromptSystem } from "../system/IPromptSystem";
import { ITipsSystem } from "../system/ITipsSystem";
import { IPanelSystem } from "../system/IPanelSystem";
import {IUIConfig} from "../system/IUIConfig";
import { ICoKeyboardInteraction } from "../../voxengine/ui/ICoKeyboardInteraction";

interface ICoUIScene {
	
	readonly rscene: IRendererScene;
	readonly texAtlas: ICanvasTexAtlas;
	readonly transparentTexAtlas: ICanvasTexAtlas;
	readonly layout: IUILayout;
	
	prompt: IPromptSystem;
	tips: ITipsSystem;
	panel: IPanelSystem;
	uiConfig: IUIConfig;
	keyboardInteraction: ICoKeyboardInteraction;
	/**
	 * the default value is true
	 */
	texAtlasNearestFilter: boolean;
	/**
	 * @param crscene the default value is null
	 * @param atlasSize the default value is 1024
	 * @param renderProcessesTotal the default value is 3
	 */
	initialize(crscene?: IRendererScene, atlasSize?: number, renderProcessesTotal?: number): void;
	addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): ICoUIScene;
	removeEventListener(type: number, listener: any, func: (evt: any) => void): ICoUIScene;
	getStage(): IRenderStage3D;
	getRect(): IAABB2D;
	addEntity(entity: IUISceneEntity, processid?: number): void;
	removeEntity(entity: IUISceneEntity): void;
	resize(): void;
	updateLayout(): void;
	run(): void;
}

export { ICoUIScene };
