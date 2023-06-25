import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import { CoModuleVersion } from "../utils/CoModuleLoader";
import { CoDataModule } from "./CoDataModule";
interface I_CoGeomModelLoader {

}
class CoGeomModelLoader {
	private static s_coapp = new CoDataModule();
	private m_loadedCall: (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat, url?: string) => void = null;
	private m_loadedAllCall: (total: number, url?: string) => void = null;
	private m_loadTotal = 0;
	private m_loadedTotal = 0;

	verTool: CoModuleVersion = null;
	constructor() {
	}

	setListener(loadedCallback: (models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat, url?: string) => void, loadedAllCallback: (total: number, url?: string) => void): void {
		this.m_loadedCall = loadedCallback;
		this.m_loadedAllCall = loadedAllCallback;
	}
	load(urls: string[], typeNS: string = ""): void {
		CoGeomModelLoader.s_coapp.verTool = this.verTool;
		if (urls != null && urls.length > 0) {

			CoGeomModelLoader.s_coapp.initialize(null, true);
			let purls = urls.slice(0);
			CoGeomModelLoader.s_coapp.deferredInit((): void => {
				for (let i = 0; i < purls.length; ++i) {
					this.loadModel(purls[i], typeNS);
				}
			});
		}
	}
	loadWithType(urls: string[], types: string[]): void {
		CoGeomModelLoader.s_coapp.verTool = this.verTool;
		if (urls != null && urls.length > 0) {

			CoGeomModelLoader.s_coapp.initialize(null, true);
			let purls = urls.slice(0);
			CoGeomModelLoader.s_coapp.deferredInit((): void => {
				for (let i = 0; i < purls.length; ++i) {
					this.loadModel(purls[i], types[i]);
				}
			});
		}
	}

	private reset(): void {
		this.m_loadedTotal = 0;
		this.m_loadTotal = 0;
	}
	private loadModel(url: string, typeNS: string = ""): void {
		console.log("CoGeomModelLoader::loadModel(), url: ", url);

		let ns = typeNS;
		if (typeNS == "") {
			let k0 = url.lastIndexOf(".") + 1;
			let k1 = url.lastIndexOf("?");
			ns = k1 < 0 ? url.slice(k0) : url.slice(k0, k1);
		}
		ns = ns.toLocaleLowerCase();

		let type = CoDataFormat.Undefined;
		switch (ns) {
			case "obj":
				type = CoDataFormat.OBJ;
				break;
			case "fbx":
				type = CoDataFormat.FBX;
				break;
			case "drc":
				type = CoDataFormat.Draco;
				break;
			case "ctm":
				type = CoDataFormat.CTM;
				break;
			default:
				break;
		}
		if (type != CoDataFormat.Undefined) {
			this.loadGeomModel(url, type);
		} else {
			console.error("Can't support this model data format, url: ", url);
		}
	}
	private loadGeomModel(url: string, format: CoDataFormat): void {

		let ins = CoGeomModelLoader.s_coapp;
		if (ins != null) {
			let unit = ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					if (format != CoDataFormat.FBX) {
						this.loadedModels(unit.data.models, unit.data.transforms, format, unit.url);
						this.m_loadTotal++;
						this.loadedModelFromUnit(unit, status);
					}
				},
				true
			);
			if (format == CoDataFormat.FBX) {
				unit.data.modelReceiver = (models: CoGeomDataType[], transforms: Float32Array[], index: number, total: number): void => {
					// console.log("Loaded a fbx model XXX: ", index, ",", total);
					if(index == 0) {
						this.m_loadTotal++;
					}
					this.loadedModels(models, transforms, format, unit.url);
					this.loadedModelFromUnit(unit, 0, (index + 1) == total);
				};
			}
		}
	}
	private loadedModels(models: CoGeomDataType[], transforms: Float32Array[], format: CoDataFormat, url?: string): void {
		if (this.m_loadedCall != null) {
			this.m_loadedCall(models, transforms, format, url);
		}
	}
	private loadedModelFromUnit(unit: CoGeomDataUnit, status: number = 0, flag: boolean = true): void {
		if(flag)this.m_loadedTotal++;
		if (this.m_loadedTotal >= this.m_loadTotal) {
			let total = this.m_loadedTotal;
			this.reset();
			this.m_loadedAllCall(total, unit.url);
		}
	}
	destroy(): void {

		this.m_loadedCall = null;
	}
}
export { CoGeomDataType, CoDataFormat, CoGeomModelLoader };
