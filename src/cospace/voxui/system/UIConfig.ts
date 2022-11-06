
import {IFontFormat, IUIConfig} from "./IUIConfig";

class UIConfig implements IUIConfig {
	private m_callback: () => void;
	constructor(){}
	initialize(configUrl: string, callback: () => void): void {
		// load the cofig text file
		this.m_callback = callback;
		
	}
	destroy(): void {

	}
	getModuleByName(moduleName: string): unknown {
		return null;
	}
}

export { UIConfig }
