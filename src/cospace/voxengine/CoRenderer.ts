import RendererDevice from "../../vox/render/RendererDevice";
import RendererState from "../../vox/render/RendererState";
import {RendererInstanceContextParam, RendererInstanceContext} from "../../vox/scene/RendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import {
	RenderDrawMode,
	RenderBlendMode,
	GLStencilFunc,
	GLStencilOp,
	GLBlendMode,
	GLBlendEquation,
	CullFaceMode,
	DepthTestMode,
} from "../../vox/render/RenderConst";

function createRendererInstance(): IRendererInstance {
	return new RendererInstance();
}
export {
	
	RenderDrawMode,
	CullFaceMode,
	DepthTestMode,
	RenderBlendMode,

	GLStencilFunc,
	GLStencilOp,
	GLBlendMode,
	GLBlendEquation,



	RendererDevice,
	RendererState,
	RendererInstanceContext,
	RendererInstanceContextParam,
	RendererInstance,

	createRendererInstance
}
