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
