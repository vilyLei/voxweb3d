import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { CoRendererDevice } from "./render/CoRendererDevice";
import { CoRendererState } from "./render/CoRendererState";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import {
    IRenderDrawMode,
    ICullFaceMode,
    IDepthTestMode,
    IRenderBlendMode,
    IGLStencilFunc,
    IGLStencilOp,
    IGLBlendMode,
    IGLBlendEquation,
    ICoRenderer
} from "./ICoRenderer";
declare var CoRenderer: ICoRenderer;

interface I_CoRenderer {
}

class T_CoRenderer {

    private m_init = true;
    initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
        this.m_init = !this.isEnabled();
        if (this.m_init) {
            this.m_init = false;
            if (url == "" || url === undefined) {
                url = "static/cospace/engine/renderer/CoRenderer.umd.min.js";
            }
            new ModuleLoader(1, (): void => {
                if (callback != null && this.isEnabled()) callback([url]);
            }).load(url);

            return true;
        }
        return false;
    }

    get RenderDrawMode(): IRenderDrawMode {
        return CoRenderer.RenderDrawMode;
    }
    get CullFaceMode(): ICullFaceMode {
        return CoRenderer.CullFaceMode;
    }
    get DepthTestMode(): IDepthTestMode {
        return CoRenderer.DepthTestMode;
    }
    get RenderBlendMode(): IRenderBlendMode {
        return CoRenderer.RenderBlendMode;
    }
    get GLStencilFunc(): IGLStencilFunc {
        return CoRenderer.GLStencilFunc;
    }
    get GLStencilOp(): IGLStencilOp {
        return CoRenderer.GLStencilOp;
    }
    get GLBlendMode(): IGLBlendMode {
        return CoRenderer.GLBlendMode;
    }
    get GLBlendEquation(): IGLBlendEquation {
        return CoRenderer.GLBlendEquation;
    }

    get RendererDevice(): CoRendererDevice {
        return CoRenderer.RendererDevice;
    }
    get RendererState(): CoRendererState {
        return CoRenderer.RendererState;
    }
    createRendererInstance(): IRendererInstance {
        return CoRenderer.createRendererInstance();
    }

    isEnabled(): boolean {
        return typeof CoRenderer !== "undefined";
    }
}
const VoxRenderer = new T_CoRenderer();
export { VoxRenderer }
