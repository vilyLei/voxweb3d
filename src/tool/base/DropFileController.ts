
interface IFileUrlObj {
	name: string;
	type: string;
	resType: string;
	url: string;
}
interface IDropFileListerner {
	isDropEnabled(): boolean;
	initFileLoad(files: IFileUrlObj[]): void;
}
class DropFileController {
	private m_canvas: HTMLCanvasElement = null;
	private m_listener: IDropFileListerner = null;
	constructor() {}

	initialize(canvas: HTMLCanvasElement, listener: IDropFileListerner): void {
		if (this.m_canvas == null) {
			this.m_canvas = canvas;
			this.m_listener = listener;
			this.initDrop(this.m_canvas);
		}
	}
	private initDrop(canvas: HTMLCanvasElement): void {
		// --------------------------------------------- 阻止必要的行为 begin
		canvas.addEventListener(
			"dragenter",
			e => {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		canvas.addEventListener(
			"dragover",
			e => {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		canvas.addEventListener(
			"dragleave",
			e => {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		canvas.addEventListener(
			"drop",
			e => {
				e.preventDefault();
				e.stopPropagation();
				console.log("canvas drop evt.", e);
				this.receiveDropFile(e);
			},
			false
		);
	}
	private m_files: any[] = null;
	private receiveDropFile(e: DragEvent): void {
		this.m_files = null;
		if (this.m_listener.isDropEnabled()) {
			let dt = e.dataTransfer;
			// 只能拽如一个文件或者一个文件夹里面的所有文件。如果文件夹里面有子文件夹则子文件夹中的文件不会载入
			let files: any = [];
			let filesTotal: number = 0;
			let filesCurrTotal: number = 0;

			if (dt.items !== undefined) {
				let items = dt.items;
				// Chrome有items属性，对Chrome的单独处理
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
					let entity = item.webkitGetAsEntry();
					if (entity != null) {
						if (entity.isFile) {
							let file = item.getAsFile();
							// console.log("drop a file: ", file);
							files.push(file);
							this.initFileLoad(files);
							filesTotal = 1;
						} else if (entity.isDirectory) {
							// let file = item.getAsFile();
							let dr = (entity as any).createReader();
							// console.log("drop a dir, dr: ", dr);
							dr.readEntries((entries: any) => {
								filesTotal = entries.length;
								if (filesTotal > 0) {
									// 循环目录内容
									entries.forEach((entity: any) => {
										if (entity.isFile) {
											entity.file((file: any) => {
												files.push(file);
												filesCurrTotal++;
												if (filesTotal == filesCurrTotal) {
													this.initFileLoad(files);
												}
											});
										}
									});
								} else {
									this.alertShow(31);
								}
							});
							break;
						}
					}
					if (filesTotal > 0) {
						break;
					}
				}
				this.m_files = files;
			}
		}
	}
	private alertShow(flag: number): void {
		switch (flag) {
			case 31:
				alert("无法找到或无法识别对应的文件");
				break;
			default:
				break;
		}
	}
	private initFileLoad(files: any): void {
		this.m_files = null;
		if (this.m_listener) {
			this.m_files = files;
			this.m_listener.initFileLoad(this.getFiles());
		}
	}
	readonly imgKeys = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
	readonly geomModelKeys = ["obj", "ctm", "draco", "drc", "fbx"];
	private testFile(name: string): IFileUrlObj {
		let pns = name.toLocaleLowerCase();
		let suffixNS = "";
		if (pns.indexOf(".") > 0) {
			suffixNS = pns.slice(pns.indexOf(".") + 1);
			console.log("suffixNS: ", suffixNS);
		}
		if (this.imgKeys.includes(suffixNS)) {
			return { name: name, type: suffixNS, resType: "image", url: "" };
		}else if (this.geomModelKeys.includes(suffixNS)) {
			return { name: name, type: suffixNS, resType: "geometryModel", url: "" };
		}
		return null;
	}
	private getFiles(): IFileUrlObj[] {
		let flag = 1;
		let files = this.m_files;
		if (files) {
			if (files.length > 0) {
				let urls: IFileUrlObj[] = [];
				for (let i = 0; i < files.length; i++) {
					let obj = this.testFile(files[i].name);
					if (obj) {
						obj.url = window.URL.createObjectURL(files[i]);
						urls.push(obj);
					}
				}
				return urls;
			} else {
				flag = 31;
			}
		}
		this.alertShow(flag);
		return null;
	}
}

export { IFileUrlObj, IDropFileListerner, DropFileController };
