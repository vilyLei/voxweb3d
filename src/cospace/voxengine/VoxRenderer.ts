import { IRendererInstance } from "../../vox/scene/IRendererInstance";
import { CoRendererDevice } from "./render/CoRendererDevice";
import { CoRendererState } from "./render/CoRendererState";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { ICoRenderer } from "./ICoRenderer";
declare var CoRenderer: ICoRenderer;

interface I_CoRenderer {
}

class T_CoRenderer {
    
	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {

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
