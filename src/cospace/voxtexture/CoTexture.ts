import ICanvasTexAtlas from "./atlas/ICanvasTexAtlas";
import CanvasTexAtlas from "./atlas/CanvasTexAtlas";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;


function createCanvasTexAtlas(): ICanvasTexAtlas {
	return new CanvasTexAtlas();
}
export {
	createCanvasTexAtlas
};
