
import { PackedLoader } from "./PackedLoader";
class ModuleLoader extends PackedLoader{
	constructor(times: number, callback: (m?: PackedLoader) => void = null){super(times, callback)}
	protected loadData(url: string): void {
		let req: XMLHttpRequest = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onerror = function (err) {
			console.error("load error: ", err);
		}
		// req.onprogress = e => { };
		req.onload = evt => {
			this.loadedData(req.response, url);
			this.loadedUrl(url);
		}
		req.send(null);
	}

	protected loadedData(data: string | ArrayBuffer, url: string): void {
		console.log("ModuleLoader::loadedData(), module js file loaded, url: ", url);
		let scriptEle = document.createElement("script");
		scriptEle.onerror = evt => {
			console.error("module script onerror, e: ", evt);
		};
		scriptEle.type = "text/javascript";
		try
		{
			console.log("ModuleLoader::loadedData(), module compile A, url: ", url);
			scriptEle.innerHTML = data as string;
			document.head.appendChild(scriptEle);
			console.log("ModuleLoader::loadedData(), module compile B, url: ", url);
		}catch(e) {
			console.error("ModuleLoader::loadedData() apply script ele error.");
			throw e;
		}
	}
}

export { ModuleLoader };
