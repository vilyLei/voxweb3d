
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
		console.log("module js file loaded, url: ", url);
		let scriptEle = document.createElement("script");
		scriptEle.onerror = evt => {
			console.error("module script onerror, e: ", evt);
		};
		scriptEle.type = "text/javascript";
		scriptEle.innerHTML = data as string;
		document.head.appendChild(scriptEle);
	}
}

export { ModuleLoader };
