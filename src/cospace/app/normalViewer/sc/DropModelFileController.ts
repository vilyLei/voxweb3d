
interface IDropFileListerner {
	isDropEnabled(): boolean;
	initFileLoad(files: any[]): void;
}
class DropModelFileController {
	private m_canvas: HTMLCanvasElement = null;
	private m_listener: IDropFileListerner = null;
	constructor() { }

	initialize(canvas: HTMLCanvasElement, listener: IDropFileListerner): void {

		if (this.m_canvas == null) {
			this.m_canvas = canvas;
			this.m_listener = listener;
			this.initDrop(this.m_canvas);
		}
	}
	private initDrop(canvas: HTMLCanvasElement): void {

		// --------------------------------------------- 阻止必要的行为 begin
		canvas.addEventListener("dragenter", (e) => {
			e.preventDefault();
			e.stopPropagation();
		}, false);

		canvas.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		}, false);

		canvas.addEventListener("dragleave", (e) => {
			e.preventDefault();
			e.stopPropagation();
		}, false);

		canvas.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();
			console.log("canvas drop evt.", e);
			this.receiveDropFile(e);
		}, false);
	}

	private receiveDropFile(e: DragEvent): void {
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
							this.m_listener.initFileLoad(files);
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
													this.m_listener.initFileLoad(files);
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
			}
		}
	}
	alertShow(flag: number): void {
		switch (flag) {
			case 31:
				alert("没有找到对应的模型文件");
				break;
			default:
				break;
		}
	}
}

export { IDropFileListerner, DropModelFileController };
