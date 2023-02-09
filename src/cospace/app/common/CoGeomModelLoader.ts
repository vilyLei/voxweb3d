import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import { CoDataModule } from "./CoDataModule";

class CoGeomModelLoader {
	private m_coapp = new CoDataModule();
	private m_loadTotal = 0;
	private m_loadedTotal = 0;

	constructor(coapp: CoDataModule) {
		this.m_coapp = coapp;
	}

	loadModels(urls: string[], typeNS: string = ""): void {
		if (urls != null && urls.length > 0) {
			let purls = urls.slice(0);
			this.m_coapp.deferredInit((): void => {
				for (let i = 0; i < purls.length; ++i) {
					this.loadModel(purls[i], typeNS);
				}
			});
		}
	}

	private loadModel(url: string, typeNS: string = ""): void {
		console.log("loadModel, url: ", url);

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
		// let ins = this.m_coapp.coappIns;
		let ins = this.m_coapp;
		if (ins != null) {
			this.m_loadTotal++;
			let unit = ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					if (format != CoDataFormat.FBX) {
						this.loadedModels(unit.data.models, unit.data.transforms);
					}
					// this.createEntityFromUnit(unit, status);
				},
				true
			);
			if (format == CoDataFormat.FBX) {
				unit.data.modelReceiver = (models: CoGeomDataType[], transforms: Float32Array[], index: number, total: number): void => {
					// console.log("XXX: ", index, ",", total);
					this.loadedModels(models, transforms);
				};
			}
		}
	}
	private loadedModels(models: CoGeomDataType[], transforms: Float32Array[]): void {
		
	}

	destroy(): void {
		
		if(this.m_coapp != null) {
			// todo
			
			this.m_coapp = null;
		}
	}
}
export { CoGeomModelLoader };
