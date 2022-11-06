
import { TextPackedLoader } from "../../modules/loaders/TextPackedLoader";
import {IFontFormat, IUIConfig} from "./IUIConfig";

class UIConfig implements IUIConfig {
	private m_callback: () => void;
	private m_jsonRawData = "";
	private m_jsonObj: Object = null;
	constructor(){}
	initialize(configUrl: string, callback: () => void): void {
		// load the cofig text file
		this.m_callback = callback;
		let jsonLoader = new TextPackedLoader(1, (): void => {
			// console.log("jsonLoader loaded: ", jsonLoader.getDataByUrl(configUrl));
			this.m_jsonRawData = jsonLoader.getDataByUrl(configUrl) as string;
			this.m_jsonObj = JSON.parse(this.m_jsonRawData);
			console.log("this.m_jsonObj: ", this.m_jsonObj);
		}).load(configUrl);
	}
	getModuleByName(moduleName: string): unknown {
		return null;
	}
	destroy(): void {
	}
}

export { UIConfig }
