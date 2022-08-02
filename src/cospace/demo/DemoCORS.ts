import { FileIO } from "../../app/slickRoad/io/FileIO";
import MathConst from "../../vox/math/MathConst";
import DivLog from "../../vox/utils/DivLog";
import { HttpFileLoader } from "../modules/loaders/HttpFileLoader";

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
		let total = 10;
		for (let i = 0; i < total; ++i) {
			const begin = Math.round(Math.random() * 500);
			const end = begin + 10 + Math.round(Math.random() * 500);
			this.loadFile(url, begin * 2, end * 2);
		}

		// const begin = 128;
		// const end = begin + 30;
		// this.loadFile(url, begin * 2, end * 2);
		if(total > 0) return;

		// url = "http://localhost:9090/static/assets/box.jpg";
		// url = "http://localhost:9090/static/assets/obj/apple_01.obj";
		// url = "http://localhost:9090/static/assets/obj/base.obj";
		// this.loadFile(url);

		url = "http://localhost:9090/static/assets/bin/u16_8192.bin";
		// this.loadFile(url,256,256 + 520);
		// this.loadFile(url,256,256 + 530);
		// this.loadFile(url,256,256 + 560);
		// this.loadFile(url,256,256 + 570);
		// this.loadFile(url,256,256 + 580);
		// this.loadFile(url,256,256 + 590);
		// this.loadFile(url,256,256 + 600);
	}
	private loadFile(url: string, rangeBegin: number = 0, rangeEnd: number = 0): void {
		let loader = new HttpFileLoader();
		let headInfo = rangeEnd > rangeBegin ? "bytes=" + rangeBegin + "-" + rangeEnd : "";
		console.log("headInfo: ",headInfo);
		// console.log("url: ",url);
		if(headInfo != "")url += "?rv="+headInfo
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
						// 可能是从 disk cache 用 range 的方式加载出了错，需要重新尝试加载
						let bytesTotal = rangeEnd - rangeBegin
						if(u16Buf.buffer.byteLength > bytesTotal) {
							this.loadFileWithDiskCache(url, rangeBegin, rangeEnd);
						} else {
							console.error(headInfo,",load range error, bytes total: ", rangeEnd - rangeBegin);
						}
					}
				}
			},
			(progress: number, url: string) => {
				let progressInfo = Math.round(progress * 100) + "%";
				console.log("progress progressInfo: ", progressInfo);
			},
			(status: number, url: string) => {},
			"blob",
			headInfo
		);
	}
	private loadFileWithDiskCache(url: string, rangeBegin: number = 0, rangeEnd: number = 0): void {
		let loader = new HttpFileLoader();
		let headInfo = rangeEnd > rangeBegin ? "bytes=" + rangeBegin + "-" + rangeEnd : "";
		loader.load(
			url,
			(buf: ArrayBuffer, url: string): void => {
				console.log("DemoCORS::loadFile() from disk cache, loaded buf:", buf, ",url: ", url);
				if (headInfo != "") {
					let u16Buf = new Uint16Array(buf);
					console.log(headInfo, ", u16Buf: ", u16Buf[0], u16Buf[1], u16Buf[u16Buf.length - 2], u16Buf[u16Buf.length - 1]);
					let f0 = rangeBegin / 2 != u16Buf[0];
					let f1 = rangeEnd / 2 - 1 != u16Buf[u16Buf.length - 1];
					if (f0 || f1) {
						console.error(headInfo,",loadFileWithDiskCache with range error, bytes total: ", rangeEnd - rangeBegin);
						// 可能是从 disk cache 用 range 的方式加载出了错，需要重新尝试加载
					}else {
						console.warn(headInfo,",loadFileWithDiskCache success, bytes total: ", rangeEnd - rangeBegin);
					}
				}
			},
			(progress: number, url: string) => {
				let progressInfo = Math.round(progress * 100) + "%";
				console.log("progress progressInfo: ", progressInfo);
			},
			(status: number, url: string) => {},
			"blob"
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
