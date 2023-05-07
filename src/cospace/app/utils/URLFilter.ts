export default class URLFilter {

	static isEnabled(): boolean {
		let hostUrl = window.location.href;
		return hostUrl.indexOf(".artvily.com") > 0;
	}
	static filterUrl(url: string): string {
		if(url.indexOf("blob:") < 0) {
			console.log("use common tex url");
			let hostUrl = window.location.href;
			console.log("KKKK >> KKKK hostUrl: ", hostUrl);
			console.log("KKKK >> KKKK url: ", url);
			if (hostUrl.indexOf(".artvily.") > 0) {
				hostUrl = "http://www.artvily.com:9090/";
				url = hostUrl + url;
			}
		}
		return url;
	}
	static getFileName(url: string, lowerCase: boolean = false): string {
		if(url.indexOf("blob:") < 0) {
			let i = url.lastIndexOf("/");
			if(i < 0) {
				return "";
			}
			let j = url.indexOf(".", i);
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
	static getFileNameAndSuffixName(url: string, lowerCase: boolean = false): string {
		if(url.indexOf("blob:") < 0) {
			let i = url.lastIndexOf("/");
			let j = url.indexOf(".", i);
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
	static getFileSuffixName(url: string, lowerCase: boolean = false): string {
		if(url.indexOf("blob:") < 0) {
			let i = url.lastIndexOf("/");
			let j = url.indexOf(".", i);
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
