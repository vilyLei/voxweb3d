export default class URLFilter {

	static filterUrl(url: string): string {
		if(url.indexOf("blob:") < 0) {
			console.log("use common tex url");
			let hostUrl = window.location.href;
			if (hostUrl.indexOf(".artvily.") > 0) {
				hostUrl = "http://www.artvily.com:9090/";
				url = hostUrl + url;
			}
		}
		return url;
	}
}
