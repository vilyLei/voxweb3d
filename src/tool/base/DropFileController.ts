
interface IFileUrlObj {
	name: string;
	type: string;
	resType: string;
	url: string;
	file?:any;
}
interface IDropFileListerner {
	isDropEnabled(): boolean;
	initFileLoad(files: IFileUrlObj[], type?: string): void;
}
class DropFileController {
	private m_htmlObj: HTMLElement = null;
	private m_listener: IDropFileListerner = null;
	static readonly Image_File = "image";
	static readonly Geometry_Model_File = "geometryModel";
	constructor() {}

	initialize(htmlObj: HTMLElement, listener: IDropFileListerner): void {
		if (this.m_htmlObj == null) {
			this.m_htmlObj = htmlObj;
			this.m_listener = listener;
			this.initDrop(this.m_htmlObj);
		}
	}
	private initDrop(htmlObj: HTMLElement): void {
		// --------------------------------------------- 阻止必要的行为 begin
		htmlObj.addEventListener(
			"dragenter",
			e => {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		htmlObj.addEventListener(
			"dragover",
			e => {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		htmlObj.addEventListener(
			"dragleave",
			e => {
				e.preventDefault();
				e.stopPropagation();
			},
			false
		);

		htmlObj.addEventListener(
			"drop",
			e => {
				e.preventDefault();
				e.stopPropagation();
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
							this.initFilesLoad(files, "drop");
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
													this.initFilesLoad(files, "drop");
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
	initFilesLoad(files: any, type: string = "undefine"): void {
		this.m_files = null;
		if (this.m_listener) {
			this.m_files = files;
			this.m_listener.initFileLoad(this.getFiles(), type);
		}
	}
	readonly imgKeys = ["jpg", "jpeg", "png", "gif", "bmp", "webp","jfif","ico","avif"];
	readonly geomModelKeys = ["obj", "ctm", "draco", "drc", "fbx"];
	private testFile(name: string): IFileUrlObj {
		let pns = name.toLocaleLowerCase();
		let suffixNS = "";
		if (pns.lastIndexOf(".") > 0) {
			suffixNS = pns.slice(pns.lastIndexOf(".") + 1);
			console.log("suffixNS: ", suffixNS);
		}
		if (this.imgKeys.includes(suffixNS)) {
			return { name: name, type: suffixNS, resType: DropFileController.Image_File, url: "" };
		}else if (this.geomModelKeys.includes(suffixNS)) {
			return { name: name, type: suffixNS, resType: DropFileController.Geometry_Model_File, url: "" };
		}
		return null;
	}
	createObjectURLEnabled = true;
	private getFiles(): IFileUrlObj[] {
		let flag = 1;
		let files = this.m_files;
		if (files) {
			if (files.length > 0) {
				let urls: IFileUrlObj[] = [];
				for (let i = 0; i < files.length; i++) {
					let obj = this.testFile(files[i].name);
					if (obj) {
						if(this.createObjectURLEnabled) {
							obj.url = window.URL.createObjectURL(files[i]);
						}else {
							obj.file = files[i];
						}
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
