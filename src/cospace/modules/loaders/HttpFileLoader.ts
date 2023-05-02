/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface I_HttpFileLoader {
}
class HttpFileLoader {
	crossOrigin = 'anonymous';
	constructor() {
	}

	setCrossOrigin( crossOrigin: string ): void  {
		this.crossOrigin = crossOrigin;
	}
	async load(url: string,
		onLoad: (buf: ArrayBuffer | string | object, url: string) => void,
		/**
		 * @param progress its value is 0.0 -> 1.0
		 */
		onProgress: (progress: number, url: string) => void = null,
		onError: (status: number, url: string) => void = null,
		responseType: XMLHttpRequestResponseType = "blob",
		headRange: string = ""
	) {
		// console.log("HttpFileLoader::load(), A url: ", url);
		// console.log("loadBinBuffer, headRange != '': ", headRange != "");
		if(onLoad == null) {
			throw Error("onload == null !!!");
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			if(onLoad) onLoad(<ArrayBuffer>reader.result, url);
		};
		const request = new XMLHttpRequest();
		request.open("GET", url, true);
		if (headRange != "") {
			request.setRequestHeader("Range", headRange);
		}
		request.responseType = responseType;

		request.onload = (e) => {
			// console.log("loaded binary buffer request.status: ", request.status, e);
			// console.log("HttpFileLoader::load(), B url: ", url);
			if (request.status <= 206) {
				switch(responseType) {
					case "arraybuffer":
					case "blob":
						reader.readAsArrayBuffer(request.response);
						break;
					case "json":
						if(onLoad) onLoad(<object>request.response, url);
						break;
					case "text":
						if(onLoad) onLoad(<string>request.response, url);
						break;
					default:
						if(onLoad) onLoad(<any>request.response, url);
						break;
				}
				// if(responseType == "blob" || responseType == "arraybuffer") {
				// 	reader.readAsArrayBuffer(request.response);
				// }else {
				// 	if(onLoad) onLoad(<string>request.response, url);
				// }
			} else if(onError){
				onError(request.status, url);
			}
		};
		if(onProgress != null) {
			request.onprogress = (evt: ProgressEvent) => {
				// console.log("progress evt: ", evt);
				// console.log("progress total: ", evt.total, ", loaded: ", evt.loaded);
				let k = 0.0;
				if (evt.total > 0 || evt.lengthComputable) {
					k = Math.min(1.0, (evt.loaded / evt.total));
				} else {
					let content_length: number = parseInt(request.getResponseHeader("content-length"));
					// var encoding = req.getResponseHeader("content-encoding");
					// if (total && encoding && encoding.indexOf("gzip") > -1) {
					if (content_length > 0) {
						// assuming average gzip compression ratio to be 25%
						content_length *= 4; // original size / compressed size
						k = Math.min(1.0, (evt.loaded / content_length));
					} else {
						console.warn("lengthComputable failed");
					}
				}
				//let progressInfo = k + "%";
				//console.log("progress progressInfo: ", progressInfo);
				onProgress(k, url);
			}
		}
		if(onError != null) {
			request.onerror = (e) => {
				console.error(
					"load error, request.status: ",
					request.status,", url: ",url
				);
				onError(request.status, url);
			};
		}
		request.send(null);
	}
}

export { HttpFileLoader };
