/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class FileLoader {

	constructor() {
	}
	
	async load(url: string,
		onLoad: (buf: ArrayBuffer, url: string) => void,
		onProgress: (evt: ProgressEvent, url: string) => void = null,
		onError: (status: number, url: string) => void = null,
		responseType: XMLHttpRequestResponseType = "blob",
		headRange: string = ""
	) {
		console.log("loadBinBuffer, headRange != '': ", headRange != "");
		if(onLoad == null) {
			throw Error("onload == null !!!");
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			if(onLoad != null) onLoad(<ArrayBuffer>reader.result, url);
		};
		const request = new XMLHttpRequest();
		request.open("GET", url, true);
		if (headRange != "") {
			request.setRequestHeader("Range", headRange);
		}
		request.responseType = responseType;

		request.onload = (e) => {
			console.log("loaded binary buffer request.status: ", request.status, e);
			if (request.status <= 206) {
				reader.readAsArrayBuffer(request.response);
			} else if(onError != null){
				onError(request.status, url);
			}
		};
		if(onProgress != null) {
			request.onprogress = (e: ProgressEvent) => {				
				onProgress(e, url);
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

export { FileLoader };
