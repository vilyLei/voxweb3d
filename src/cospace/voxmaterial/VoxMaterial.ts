import IColor4 from "../../vox/material/IColor4";
import IShaderMaterial from "../../vox/material/mcase/IShaderMaterial";
import { IMaterialDecorator } from "../../vox/material/IMaterialDecorator";
import { IMaterial } from "../../vox/material/IMaterial";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";
import IDefault3DMaterial from "../../vox/material/mcase/IDefault3DMaterial";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";


import { CoMaterialContextParam, ICoMaterial } from "./ICoMaterial";
declare var CoMaterial: ICoMaterial;

interface I_CoMaterial {
}
class T_CoMaterial {
    
	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
        this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
                url = "static/cospace/coMaterial/CoMaterial.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

            return true;
		}
        return false;
	}
    isEnabled(): boolean {
        return typeof CoMaterial !== "undefined";
    }
    /**
     * create a Color4 instance
     * @param pr the default vaue is 1.0
     * @param pg the default vaue is 1.0
     * @param pb the default vaue is 1.0
     * @param pa the default vaue is 1.0
     */
    createColor4(pr?: number, pg?: number, pb?: number, pa?: number): IColor4 {
        return CoMaterial.createColor4(pr, pg, pb, pa);
    }

    /**
     * build default 3d entity rendering material
     * @param normalEnabled the default value is false
     */
    createDefaultMaterial(normalEnabled?: boolean): IDefault3DMaterial {
        return CoMaterial.createDefaultMaterial(normalEnabled);
    }
    /**
     * build 3d line entity rendering material
     * @param dynColorEnabled the default value is true
     */
    createLineMaterial(dynColorEnabled?: boolean): IColorMaterial {
        return CoMaterial.createLineMaterial(dynColorEnabled);
    }
    /**
     * build 3d quad line entity rendering material
     * @param dynColorEnabled the default value is false
     */
    createQuadLineMaterial(dynColorEnabled?: boolean): IColorMaterial {
        return CoMaterial.createQuadLineMaterial(dynColorEnabled);
    }
    createShaderMaterial(shd_uniqueName: string): IShaderMaterial {
        return CoMaterial.createShaderMaterial(shd_uniqueName);
    }
    createMaterial(dcr: IMaterialDecorator): IMaterial {
        return CoMaterial.createMaterial(dcr);
    }
    creatMaterialContextParam(): CoMaterialContextParam {
        return CoMaterial.creatMaterialContextParam();
    }
    createMaterialContext(): IMaterialContext {
        return CoMaterial.createMaterialContext();
    }
}
const VoxMaterial = new T_CoMaterial();
export { VoxMaterial };
