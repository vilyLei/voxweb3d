
import { PackedLoader } from "./PackedLoader";
class TextPackedLoader extends PackedLoader{
	private m_dataMap: Map<string, string> = new Map();
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
