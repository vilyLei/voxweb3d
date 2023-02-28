
import IRendererScene from "../../../vox/scene/IRendererScene";
import { CoSpace } from "../../CoSpace";

interface ISceneNode {
	
	initialize(rscene: IRendererScene, cospace: CoSpace): void;
	mouseDown(evt: any): void;
	load(urls: string[]): void;
	isFinish(): boolean;
	run(): void;
	clear(): void;
}

export { ISceneNode };
