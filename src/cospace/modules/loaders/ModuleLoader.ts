
import { PackedLoader } from "./PackedLoader";
class ModuleLoader extends PackedLoader{

	protected loadData(url: string): void {
		let codeLoader: XMLHttpRequest = new XMLHttpRequest();
		codeLoader.open("GET", url, true);
		codeLoader.onerror = function (err) {
			console.error("load error: ", err);
		}
		// codeLoader.onprogress = e => { };
		codeLoader.onload = evt => {
			this.loadedData(codeLoader.response, url);
			this.loadedUrl(url);
		}
		codeLoader.send(null);
	}

	protected loadedData(data: any, url: string): void {
		console.log("module js file loaded, url: ", url);
		let scriptEle = document.createElement("script");
		scriptEle.onerror = evt => {
			console.error("module script onerror, e: ", evt);
		};
		scriptEle.type = "text/javascript";
		scriptEle.innerHTML = data;
		document.head.appendChild(scriptEle);
	}
}

export { ModuleLoader };
