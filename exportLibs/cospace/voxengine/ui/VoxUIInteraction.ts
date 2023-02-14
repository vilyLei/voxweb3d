
import { IMouseInteraction } from "./IMouseInteraction";
import { ICoKeyboardInteraction } from "./ICoKeyboardInteraction";
import { ICoUIInteraction } from "./ICoUIInteraction";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";

declare var CoUIInteraction: ICoUIInteraction;

interface I_CoUIInteraction {
}

class T_CoUIInteraction {
    
	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
        
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
                url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

            return true;
		}
        return false;
	}
    createMouseInteraction(): IMouseInteraction {
        return CoUIInteraction.createMouseInteraction();
    }
    createKeyboardInteraction(): ICoKeyboardInteraction {
        return CoUIInteraction.createKeyboardInteraction();
    }
    isEnabled(): boolean {
        return typeof CoUIInteraction !== "undefined";
    }
}
const VoxUIInteraction = new T_CoUIInteraction();
export { VoxUIInteraction }
