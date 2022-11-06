
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
			if(this.m_callback != null) {
				this.m_callback();
				this.m_callback = null;
			}
		}).load(configUrl);
	}
	getUIModuleByName(moduleName: string): unknown | null {
		if(moduleName != "") {
			let obj = this.m_jsonObj;
			if(obj != null) {
				let uiModule = (obj as any)["uiModule"];
				console.log("XXXX uiModule: ",uiModule);
				if(uiModule !== undefined) {
					let module = uiModule[moduleName];
					if(module !== undefined) {
						return module;
					}
				}
			}

		}
		return null;
	}
	destroy(): void {
	}
}

export { UIConfig }
