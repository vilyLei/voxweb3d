
import URLFilter from "../../../tool/base/URLFilter";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
interface I_CoModuleLoader {
}
class CoModuleVersion {
	private m_infoObj: any = null;
	private m_verMap: Map<string, any> = new Map();
	constructor(infoObj: any){
		this.m_infoObj = infoObj;
		const versionInfo = this.m_infoObj;
		const versionInfoMap = this.m_verMap;
		let items = versionInfo.items;
		for (let i = 0; i < items.length; ++i) {
			const ia = items[i];
			versionInfoMap.set(ia.name, ia);
			if (ia.type) {
				if (ia.type == "dir") {
					let ls = ia.items;
					for (let i = 0; i < ls.length; ++i) {
						const ib = ls[i];
						versionInfoMap.set(ib.name, ib);
					}
				}
			}
		}
	}
	filterUrl(url: string): string {
		let isDL = url.indexOf("/dracoLib/") > 0;
		if(!isDL) {
			let name = URLFilter.getFileName(url, true);
			if(this.m_verMap.has(name)) {
				let item = this.m_verMap.get( name );
				url +="?ver=" + item.ver;
				console.log("### ### filterUrl(), name: ", name);
			}
		}
		return url;
	}
}
class CoModuleLoader extends ModuleLoader {
	/**
	 * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
	 * @param callback 完成所有响应的之后的回调
	 */
	constructor(times: number, callback: (m?: ModuleLoader) => void = null, versionFilter: CoModuleVersion = null) {
		super(times, callback, null);
		let urlChecker = (url: string): string => {
			if(url.indexOf(".artvily.") > 0) {
				return url;
			}
			let hostUrl = window.location.href;
			url = url.trim();
			if(hostUrl.indexOf(".artvily.") > 0) {
				let i = url.lastIndexOf("/");
				let j = url.indexOf(".", i);
				// hostUrl = "http://localhost:9000/test/";
				hostUrl = "http://www.artvily.com:9090/";
				let fileName = url.slice(i,j);
				if(url.indexOf(".umd.") > 0) {
					fileName = fileName.toLocaleLowerCase();
					url = hostUrl + url.slice(0,i) + fileName + ".js";
				}else {
					url = hostUrl + url;
				}

				if(fileName == "") {
					console.error("err: ",url);
					console.error("i, j: ",i,j);
				}
				console.log("urlChecker(), fileName:-"+fileName+"-");
				console.log("urlChecker(), new url: ", url);
				if(versionFilter) {
					url = versionFilter.filterUrl( url );
				}
				return url;
			}
			if(versionFilter) {
				url = versionFilter.filterUrl( url );
			}
			return url;
		}
		this.setUrlChecker( urlChecker );
	}
}

export { CoModuleVersion, CoModuleLoader };
