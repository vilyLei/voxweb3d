
import RendererScene from "../../../vox/scene/RendererScene";
import { CoSpace } from "../../CoSpace";

interface ISceneNode {
	
	initialize(rscene: RendererScene, cospace: CoSpace): void;
	mouseDown(evt: any): void;
	load(urls: string[]): void;
	isFinish(): boolean;
	run(): void;
	clear(): void;
}

export { ISceneNode };
