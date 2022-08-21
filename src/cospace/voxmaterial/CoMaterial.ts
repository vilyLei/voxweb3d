import IColor4 from "../../vox/material/IColor4";

import { ICoRScene } from "../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

function createColor4(pr: number = 1.0, pg: number = 1.0, pb: number = 1.0, pa: number = 1.0): IColor4 {
	return CoRScene.createColor4(pr, pg, pb, pa);
}
export {
	createColor4
};
