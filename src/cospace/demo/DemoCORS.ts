import { FileIO } from "../../app/slickRoad/io/FileIO";
import MathConst from "../../vox/math/MathConst";
import DivLog from "../../vox/utils/DivLog";
import { HttpFileLoader } from "../modules/loaders/HttpFileLoader";
/*
class NetFileLoader {
	crossOrigin = "anonymous";
	constructor() {}
	setCrossOrigin(crossOrigin: string): void {
		this.crossOrigin = crossOrigin;
	}
	async load(
		url: string,
		onLoad: (buf: ArrayBuffer, url: string) => void,
		onProgress: (evt: ProgressEvent, url: string, req: XMLHttpRequest) => void = null,
		onError: (status: number, url: string) => void = null,
		responseType: XMLHttpRequestResponseType = "blob",
		headRange: string = ""
	) {
		// console.log("loadBinBuffer, headRange != '': ", headRange != "");
		if (onLoad == null) {
			throw Error("onload == null !!!");
		}
		const reader = new FileReader();
		reader.onload = e => {
			if (onLoad != null) onLoad(<ArrayBuffer>reader.result, url);
		};
		// XMLHttpRequest setRequestHeader Range
		const request = new XMLHttpRequest();
		request.open("GET", url, true);
		// request.withCredentials = true;
		if (headRange != "") {
			console.log("headRange: ", headRange);
			request.setRequestHeader("Range", headRange);
		}
		request.responseType = responseType;

		request.onload = e => {
			// console.log("loaded binary buffer request.status: ", request.status, e);
			if (request.status <= 206) {
				reader.readAsArrayBuffer(request.response);
			} else if (onError != null) {
				onError(request.status, url);
			}
		};
		if (onProgress != null) {
			request.onprogress = (e: ProgressEvent) => {
				onProgress(e, url, request);
			};
		}
		if (onError != null) {
			request.onerror = e => {
				console.error("load error, request.status: ", request.status, ", url: ", url);
				onError(request.status, url);
			};
		}
		request.send(null);
	}
}
//*/
/**
 * a demo
 */
export class DemoCORS {
	constructor() {}

	initialize(): void {
		console.log("DemoCORS::initialize()...");

		// 启用鼠标点击事件
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		console.log("ATH.LN2: ", Math.LN2);
		let url = "http://localhost:9090/static/assets/draco/clothRoll.rawmd";
		url = "http://localhost:9090/static/assets/bin/u16_8192.bin";
		//url = "http://www.artvily.com:9090/static/assets/bin/u16_8192.bin";
		for (let i = 0; i < 0; ++i) {
			const begin = Math.round(Math.random() * 500);
			const end = begin + 10 + Math.round(Math.random() * 500);
			this.loadFile(url, begin * 2, end * 2);
		}
		// return;
		url = "http://localhost:9090/static/assets/bin/u16_8192.bin";
		// url = "http://localhost:9090/static/assets/box.jpg";
		url = "http://localhost:9090/static/assets/obj/apple_01.obj";
		// url = "http://localhost:9090/static/assets/obj/base.obj";
		this.loadFile(url);
		// this.loadFile(url,256,256 + 128);
	}
	private loadFile(url: string, rangeBegin: number = 0, rangeEnd: number = 0): void {
		let loader = new HttpFileLoader();
		let headInfo = rangeEnd > rangeBegin ? "bytes=" + rangeBegin + "-" + rangeEnd : "";

		loader.load(
			url,
			(buf: ArrayBuffer, url: string): void => {
				console.log("DemoCORS::loadFile(), loaded buf:", buf, ",url: ", url);
				if (headInfo != "") {
					let u16Buf = new Uint16Array(buf);
					console.log(headInfo, ", u16Buf: ", u16Buf[0], u16Buf[1], u16Buf[u16Buf.length - 2], u16Buf[u16Buf.length - 1]);
					let f0 = rangeBegin / 2 != u16Buf[0];
					let f1 = rangeEnd / 2 - 1 != u16Buf[u16Buf.length - 1];
					if (f0 || f1) {
						console.error("load range error.");
					}
				}
			},
			(progress: number, url: string) => {
				let progressInfo = Math.round(progress * 100) + "%";
				console.log("progress progressInfo: ", progressInfo);
				/*
				console.log("progress evt: ", evt);
				console.log("progress total: ", evt.total, ", loaded: ", evt.loaded);
				let pro_value = 0;
				if (evt.total > 0 || evt.lengthComputable) {
					pro_value = Math.round((evt.loaded / evt.total) * 100);
				} else {
					var content_length: number = parseInt(req.getResponseHeader("content-length"));
					// var encoding = req.getResponseHeader("content-encoding");
					// if (total && encoding && encoding.indexOf("gzip") > -1) {
					if (content_length > 0) {
						// assuming average gzip compression ratio to be 25%
						content_length *= 4; // original size / compressed size
						pro_value = Math.round(Math.min(100, (evt.loaded / content_length) * 100));
					} else {
						console.log("lengthComputable failed");
					}
				}
				let progressInfo = pro_value + "%";
				console.log("progress progressInfo: ", progressInfo);
				*/
			},
			(status: number, url: string) => {},
			"blob",
			headInfo
		);
	}

	private mouseDown(evt: any): void {
		console.log("DemoCORS::mouseDown()...");
		return;
		let fio = new FileIO();
		let bytes = new Uint16Array(8192);
		for (let i = 0; i < bytes.length; ++i) {
			bytes[i] = i;
		}
		fio.downloadBinFile(bytes, "u16_8192", "bin");
	}

	run(): void {}
}

export default DemoCORS;
