import IDataMesh from "../../vox/mesh/IDataMesh";
import IRawMesh from "../../vox/mesh/IRawMesh";
import IBoundsMesh from "../../vox/mesh/IBoundsMesh";
import { IPlaneMeshBuilder } from "./build/IPlaneMeshBuilder";
import { ILineMeshBuilder } from "./build/ILineMeshBuilder";
import { IConeMeshBuilder } from "./build/IConeMeshBuilder";
import { IBoxMeshBuilder } from "./build/IBoxMeshBuilder";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import { ICoMesh } from "./ICoMesh";
import { ISphereMeshBuilder } from "./build/ISphereMeshBuilder";

declare var CoMesh: ICoMesh;

interface I_CoMesh {
}

class T_CoMesh {

	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
                url = "static/cospace/comesh/CoMesh.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

            return true;
		}
        return false;
	}
    isEnabled(): boolean {
        return typeof CoMesh !== "undefined";
    }
	/**
	 * plane mesh builder
	 */
	get plane(): IPlaneMeshBuilder {
		return CoMesh.plane;
	}
	/**
	 * line mesh builder
	 */
	get line(): ILineMeshBuilder {
		return CoMesh.line;
	}
	/**
	 * cone mesh builder
	 */
	get cone(): IConeMeshBuilder {
		return CoMesh.cone;
	}
	/**
	 * box mesh builder
	 */
	get box(): IBoxMeshBuilder {
		return CoMesh.box;
	}
	/**
	 * box mesh builder
	 */
	get sphere(): ISphereMeshBuilder {
		return CoMesh.sphere;
	}

	createDataMesh(): IDataMesh {
		return CoMesh.createDataMesh();
	}
	createRawMesh(): IRawMesh {
		return CoMesh.createRawMesh();
	}	
	createBoundsMesh(): IBoundsMesh {
		return CoMesh.createBoundsMesh();
	}
}
const VoxMesh = new T_CoMesh;
export { VoxMesh };
