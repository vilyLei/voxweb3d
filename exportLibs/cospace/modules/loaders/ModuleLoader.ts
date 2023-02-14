import { PackedLoader } from "./PackedLoader";
interface I_ModuleLoader {
}
class ModuleLoader extends PackedLoader {
	/**
	 * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
	 * @param callback 完成所有响应的之后的回调
	 * @param urlChecker url 转换与检查
	 */
	constructor(times: number, callback: (m?: PackedLoader) => void = null, urlChecker: (url: string) => string = null) {
		super(times, callback, urlChecker);
	}
	protected loadData(url: string): void {
		
		let req = new XMLHttpRequest();
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
		try {
			scriptEle.innerHTML = data as string;
			document.head.appendChild(scriptEle);
		} catch (e) {
			console.error("ModuleLoader::loadedData() apply script ele error.");
			throw e;
		}
	}
}

export { ModuleLoader };
