
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
interface I_CoModuleLoader {
}
class CoModuleLoader extends ModuleLoader {
	/**
	 * @param times 记录总共需要的加载完成操作的响应次数。这个次数可能是由load直接产生，也可能是由于别的地方驱动。
	 * @param callback 完成所有响应的之后的回调
	 */
	constructor(times: number, callback: (m?: ModuleLoader) => void = null) {
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
				return url;
			}
			return url;
		}
		this.setUrlChecker( urlChecker );
	}
}

export { CoModuleLoader };
