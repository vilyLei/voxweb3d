import { IRTJsonData } from "../data/IRTJsonData";
// import { HTTPUrl } from "../utils/HTTPUtils";

interface IRTaskDataParam {
	taskid?: number;
	phase?: string;
	version?: number;
	filepath?: string;
	taskname?: string;
	success: boolean;
	drcsTotal?: number;
	// bgTransparent?: number;
	fileName?: string;
	imgsTotal?: number;
	time?: number;
	sizes?: number[];
	rnode?: any;
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
	imgResolution = [512, 512];
	imgsTotal = 1;

	miniImgUrls: string[] = [];
	bigImgUrl = "";
	modelLoadStatus = 0;
	currentTaskAlive = false;
	drcNames: string[] = [];

	rnode: any = null;
	reneringTimes = 0;
	rtJsonData: IRTJsonData = null;
	constructor() {}
	isFinish(): boolean {
		return this.phase == "finish";
	}
	isCurrTaskAlive(): boolean {
		return this.currentTaskAlive;
	}
	reset(): void {}
	isModelDataLoaded(): boolean {
		return this.modelLoadStatus == 2;
	}
	copyFromJson(d: IRTaskDataParam): void {
		let t = this;
		if (d.taskid !== undefined) t.taskid = d.taskid;
		if (d.version !== d.version) t.version = d.version;
		if (d.filepath !== undefined) t.filepath = d.filepath;
		if (d.taskname !== undefined) t.taskname = d.taskname;
		if (d.success !== undefined) t.success = d.success;
		if (d.filepath !== undefined) t.filepath = d.filepath;
		if (d.fileName !== undefined) t.fileName = d.fileName;
		if (d.phase !== undefined) t.phase = d.phase;
		if (d.imgsTotal !== undefined) this.imgsTotal = d.imgsTotal;
		if (d.sizes !== undefined) this.imgResolution = d.sizes;
		if (d.rnode !== undefined) this.rnode = d.rnode;
		if ((d as any).bgTransparent !== undefined) this.bgTransparent = (d as any).bgTransparent == 1;
		this.updateUrl();
	}
	private getUrlParams(): string {
		let params = "?ver=" + Math.random() + "-" + Math.random() * Date.now() + "&rrtime=" + this.reneringTimes;
		return params;
	}
	updateUrl(): void {
		let filepath = this.filepath;
		let suffix = this.bgTransparent ? "png" : "jpg";
		let i = filepath.lastIndexOf("/");
		let imgDirUrl = filepath.slice(2, i + 1);

		this.bigImgUrl = imgDirUrl + "bld_rendering." + suffix + this.getUrlParams();
		console.log("this.bigImgUrl: ", this.bigImgUrl);
		let sizes = this.imgResolution;
		let miniUrl = imgDirUrl + "bld_rendering_mini_0." + suffix + this.getUrlParams();
		console.log("0 miniUrl: ", miniUrl);

		this.miniImgUrls = [];
		this.miniImgUrls.push(miniUrl);
		if (this.imgsTotal == 1) {
			if (sizes[0] <= 512 || sizes[1] <= 512) {
				if (sizes[0] > 128 && sizes[1] > 128) {
					this.miniImgUrls.push(this.bigImgUrl);
				}
			}
		} else if (this.imgsTotal > 1) {
			miniUrl = imgDirUrl + "bld_rendering_mini_1." + suffix + this.getUrlParams();
			console.log("1 miniUrl: ", miniUrl);
			this.miniImgUrls.push(miniUrl);
		}
		console.log("this.imgsTotal: ", this.imgsTotal);
		for (let i = 0; i < this.miniImgUrls.length; i++) {
			console.log(i, ", mini url: ", this.miniImgUrls[i]);
		}
		// console.log("this.miniImgUrls: ", this.miniImgUrls);
	}
}
export { IRTaskDataParam, RTaskData };
