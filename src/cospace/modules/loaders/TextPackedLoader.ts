
import { PackedLoader } from "./PackedLoader";
interface I_TextPackedLoader {
}

class TextPackedLoader extends PackedLoader{
	private m_dataMap: Map<string, string> = new Map();
	// /**
	//  * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
	//  * @param callback 完成所有响应的之后的回调
	//  * @param urlChecker url 转换与检查
	//  */
	// constructor(times: number, callback: (m?: PackedLoader) => void = null, urlChecker: (url: string) => string = null) {
	// 	super(times, callback, urlChecker);
	// }
	protected loadData(url: string): void {
		let req: XMLHttpRequest = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onerror = function (err) {
			console.error("load error: ", err);
		}
		// req.onprogress = e => { };
		req.onload = evt => {
			// this.loadedData(req.response, url);
			this.m_dataMap.set(url, req.response as string);
			this.loadedUrl(url);
		}
		req.send(null);
	}

	getDataByUrl(url: string): string {
		return this.m_dataMap.get(url);
	}
	clearAllData(): void {
		this.m_dataMap.clear();
	}
}

export { TextPackedLoader };
