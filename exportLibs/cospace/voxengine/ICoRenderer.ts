import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { CoRendererDevice } from "./render/CoRendererDevice";
import { CoRendererState } from "./render/CoRendererState";

interface ICoRenderer {

	RendererDevice: CoRendererDevice;
	RendererState: CoRendererState;
	createRendererInstance(): IRendererInstance;
}
export { ICoRenderer }
