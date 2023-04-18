// thanks: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie

class DocCookies {
	constructor() {

	}
	getItem(sKey: string): string | null {
		return (
			decodeURIComponent(
				document.cookie.replace(
					new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"),
					"$1"
				)
			) || null
		);
	}
	setItem(sKey: string, sValue: string, vEnd?: Date, sPath?: string, sDomain?: string, bSecure?: string): boolean {
		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}
		var sExpires = "";
		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd.getTime() === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
					break;
				case String:
					sExpires = "; expires=" + vEnd;
					break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
					break;
			}
		}
		document.cookie =
			encodeURIComponent(sKey) +
			"=" +
			encodeURIComponent(sValue) +
			sExpires +
			(sDomain ? "; domain=" + sDomain : "") +
			(sPath ? "; path=" + sPath : "") +
			(bSecure ? "; secure" : "");
		return true;
	}
	removeItem(sKey: string, sPath?: string, sDomain?: string): boolean {
		if (!sKey || !this.hasItem(sKey)) {
			return false;
		}
		document.cookie =
			encodeURIComponent(sKey) +
			"=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
			(sDomain ? "; domain=" + sDomain : "") +
			(sPath ? "; path=" + sPath : "");
		return true;
	}
	hasItem(sKey: string): boolean {
		return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
	}
	/* optional method: you can safely remove it! */
	keys(): string[] {
		var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
		}
		return aKeys;
	}
};
class CookieSystem {
	static readonly cookie = new DocCookies();
	// constructor() {}

}

export { DocCookies, CookieSystem };
