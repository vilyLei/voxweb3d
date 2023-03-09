import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import { HttpFileLoader } from "../../../cospace/modules/loaders/HttpFileLoader";
class ModelData {
	models: CoGeomDataType[] = [];
	transforms: Float32Array[] = [];
}
type ListenerType = (model: CoGeomDataType) => void;
class Bin4DataLoader {
	private m_vs: Float32Array;
	private m_uvs1: Float32Array;
	private m_uvs2: Float32Array;
	private m_nvs: Float32Array;
	private m_ivs: Uint16Array | Uint32Array;
	private m_listener: ListenerType;
	private m_loadingTotal = 0;
    private m_ivsUrl = "";
	constructor() {}

	setListener(listener: ListenerType): void {
		this.m_listener = listener;
	}
	loadData(vsUrl: string, uvs1Url: string = "", uvs2Url: string = "", nvsUrl: string = "", ivsUrl: string = ""): void {
		this.m_vs = null;
		this.m_uvs1 = null;
		this.m_uvs2 = null;
		this.m_nvs = null;
		this.m_ivs = null;
        this.m_ivs = null;
        this.m_ivsUrl = "";

		if (vsUrl != "") {
			this.m_loadingTotal++;
		}
		if (uvs1Url != "") {
			this.m_loadingTotal++;
		}
		if (uvs2Url != "") {
			this.m_loadingTotal++;
		}
		if (nvsUrl != "") {
			this.m_loadingTotal++;
		}
		if (ivsUrl != "") {
			this.m_loadingTotal++;
            this.m_ivsUrl = ivsUrl;
		}
        
		this.loadVS(vsUrl);
		this.loadUV1(uvs1Url);
		this.loadUV2(uvs2Url);
		this.loadNV(nvsUrl);
	}
	private loadIVS(url: string): void {
		if (url == "") return;
		let loader = new HttpFileLoader();
		loader.load(url, (buf: ArrayBuffer, url: string): void => {
            let vtxTotal = this.m_vs.length / 3;
            this.m_ivs = vtxTotal <= 65535 ? new Uint16Array(buf) : new Uint32Array(buf);
			this.update(url);
		});
	}
	private loadVS(url: string): void {
		if (url == "") return;
		let loader = new HttpFileLoader();
		loader.load(url, (buf: ArrayBuffer, url: string): void => {
			let fs = new Float32Array(buf);
			this.m_vs = fs;
			this.update(url);
            this.loadIVS(this.m_ivsUrl);
		});
	}
	private loadUV1(url: string): void {
		if (url == "") return;
		let loader = new HttpFileLoader();
		loader.load(url, (buf: ArrayBuffer, url: string): void => {
			let fs = new Float32Array(buf);
			this.m_uvs1 = fs;
			this.update(url);
		});
	}
	private loadUV2(url: string): void {
		if (url == "") return;
		let loader = new HttpFileLoader();
		loader.load(url, (buf: ArrayBuffer, url: string): void => {
			let fs = new Float32Array(buf);
			this.m_uvs2 = fs;
			this.update(url);
		});
	}
	private loadNV(url: string): void {
		if (url == "") return;
        // console.log("loadNV(), A url: ", url);
		let loader = new HttpFileLoader();
		loader.load(url, (buf: ArrayBuffer, url: string): void => {
			let fs = new Float32Array(buf);
			this.m_nvs = fs;
            // console.log("loadNV(), B loaded the normal data...");
			this.update(url);
		});
	}

	private update(url: string = ""): void {
		console.log("XXXX this.m_loadingTotal: ", this.m_loadingTotal);
		// console.log("       XXXX url: ", url);
		if (this.m_loadingTotal > 0) {

			this.m_loadingTotal--;
			if (this.m_loadingTotal < 1) {
                if(!this.m_ivs) {
                    let vtxTotal = this.m_vs.length / 3;
                    this.m_ivs = vtxTotal <= 65535 ? new Uint16Array(vtxTotal) : new Uint32Array(vtxTotal);
                    for (let i = 0; i < vtxTotal; ++i) {
                        this.m_ivs[i] = i;
                    }
                }
				let model: CoGeomDataType = {
					vertices: this.m_vs,
					uvsList: [this.m_uvs1, this.m_uvs2],
					normals: this.m_nvs,
					indices: this.m_ivs,
					wireframe: true
				};
				this.m_listener(model);
			}
		}
	}
}
export { ModelData, Bin4DataLoader };
