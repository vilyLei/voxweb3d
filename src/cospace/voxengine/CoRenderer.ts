import RendererDevice from "../../vox/render/RendererDevice";
import RendererState from "../../vox/render/RendererState";
import {RendererInstanceContextParam, RendererInstanceContext} from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";

function createRendererInstance(): IRendererInstance {
	return new RendererInstance();
}
export {
	RendererDevice,
	RendererState,
	RendererInstanceContext,
	RendererInstanceContextParam,
	RendererInstance,

	createRendererInstance
}
