export default class URLFilter {
	static getDomain(url: string): string {
		var urlReg = /http:\/\/([^\/]+)/i;
		let domain = url.match(urlReg);
		return ((domain != null && domain.length > 0) ? domain[0] : "");
	}
	static getHostUrl(port?: string, end = "/"): string {
		let host = location.href;
		let domain = URLFilter.getDomain(host);
		let nsList = domain.split(":");
		host = nsList[0]+":"+nsList[1];
		return port ? host + ":"+port+"/" : domain + end;
	}
	static isEnabled(): boolean {
		let hostUrl = window.location.href;
		return hostUrl.indexOf(".artvily.com") > 0;
	}
	static filterUrl(url: string): string {
		if(url.indexOf("blob:") < 0) {
			let hostUrl = window.location.href;
			if (hostUrl.indexOf(".artvily.") > 0) {
				hostUrl = "http://www.artvily.com:9090/";
				url = hostUrl + url;
			}
		}
		return url;
	}
	static getFileName(url: string, lowerCase: boolean = false, force: boolean = false): string {
		if(url.indexOf("blob:") < 0 || force) {
			let i = url.lastIndexOf("/");
			if(i < 0) {
				return "";
			}
			let j = url.lastIndexOf(".", url.length);
			if(j < 0) {
				return "";
			}
			if((i+2) < j) {
				let str = url.slice(i+1,j)
				if(lowerCase) {
					return str.toLocaleLowerCase();
				}
				return str;
			}
		}
		return "";
	}
	static getFileNameAndSuffixName(url: string, lowerCase: boolean = false, force: boolean = false): string {
		if(url.indexOf("blob:") < 0 || force) {
			let i = url.lastIndexOf("/");
			let j = url.lastIndexOf(".", url.length);
			if(j < 0) {
				return "";
			}
			let str = url.slice(i+1);
			if(lowerCase) {
				return str.toLocaleLowerCase();
			}
			return str;
		}
		return "";
	}
	static getFileSuffixName(url: string, lowerCase: boolean = false, force: boolean = false): string {
		if(url.indexOf("blob:") < 0 || force) {
			let j = url.lastIndexOf(".", url.length);
			if(j < 0) {
				return "";
			}
			let str = url.slice(j+1);
			if(lowerCase) {
				return str.toLocaleLowerCase();
			}
			return str;
		}
		return "";
	}
}
