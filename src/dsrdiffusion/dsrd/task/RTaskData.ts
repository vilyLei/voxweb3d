import { HTTPUrl } from "../utils/HTTPUtils";

interface IRTaskDataParam {
	taskid: number;
	version: number;
	filepath: string;
	taskname: string;
	success: boolean;
	drcsTotal: number;
	fileName: string;
	time: number;
}
class RTaskData implements IRTaskDataParam {
	taskid = 0;
	version = -1;
	phase = "new";
	filepath = "";
	taskname = "";
	success = false;
	drcsTotal = 0;
	fileName = "";
	time = 0;
	bgTransparent = false;
	miniImgUrl = "";
	bigImgUrl = "";
	modelLoadStatus = 0;
	constructor() {}
	reset(): void {

	}
	isModelDataLoaded(): boolean {
		return this.modelLoadStatus == 2;
	}
	copyFromJson(d: IRTaskDataParam): void {
		let t = this;
		t.taskid = d.taskid;
		t.version = d.version;
		t.filepath = d.filepath;
		t.taskname = d.taskname;
		t.success = d.success;
		t.drcsTotal = d.drcsTotal;
		t.fileName = d.fileName;
		t.taskid = d.taskid;
		t.taskid = d.taskid;
		this.updateUrl();
	}
	updateUrl(): void {
		let filepath = this.filepath;
		let suffix = this.bgTransparent ? "png" : "jpg";
		let i = filepath.lastIndexOf("/");
		// let imgDirUrl = HTTPUrl.host + filepath.slice(3, i + 1);
		let imgDirUrl = filepath.slice(2, i + 1);
		this.miniImgUrl = imgDirUrl + "bld_rendering_mini." + suffix + "?ver=" + Math.random() + "-" + Math.random() * Date.now();
		this.bigImgUrl = imgDirUrl + "bld_rendering." + suffix + "?ver=" + Math.random() + "-" + Math.random() * Date.now();
		console.log("this.miniImgUrl: ", this.miniImgUrl);
		console.log("this.bigImgUrl: ", this.bigImgUrl);
	}
}
export { IRTaskDataParam, RTaskData };
