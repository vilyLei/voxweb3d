import IVector3D from "../../vox/math/IVector3D";
import ILine from "./base/ILine";
import IRayLine from "./base/IRayLine";
import ISegmentLine from "./base/ISegmentLine";
import IPlane from "./base/IPlane";
import ISphere from "./base/ISphere";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";

import { CoIntersection, CoLine, CoRayLine, CoPlaneUtils, CoSurfaceNormal, ICoAGeom } from "./ICoAGeom";
declare var CoAGeom: ICoAGeom;

interface I_CoAGeom {
}

class T_CoAGeom {

	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
                url = "static/cospace/ageom/CoAGeom.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

            return true;
		}
        return false;
	}
    isEnabled(): boolean {
        return typeof CoAGeom !== "undefined";
    }
	get Intersection(): CoIntersection {
		return CoAGeom.Intersection;
	}
	get Line(): CoLine {
		return CoAGeom.Line;
	}
	get RayLine(): CoRayLine {
		return CoAGeom.RayLine;
	}
	get PlaneUtils(): CoPlaneUtils {
		return CoAGeom.PlaneUtils;
	}
	get SurfaceNormal(): CoSurfaceNormal {
		return CoAGeom.SurfaceNormal;
	}

	/**
	 * create a algorithm geometry 3D Space Line Instance
	 */
	createLine(): ILine {
		return CoAGeom.createLine();
	}
	/**
	 * create a algorithm geometry 3D Space Line Instance
	 */
	createRayLine(): IRayLine {
		return CoAGeom.createRayLine();
	}
	/**
	 * create a algorithm geometry 3D Space Segment RayLine Instance
	 */
	createSegmentLine(): ISegmentLine {
		return CoAGeom.createSegmentLine();
	}
	/**
	 * create a algorithm geometry 3D Space Plane Instance
	 */
	createPlane(): IPlane {
		return CoAGeom.createPlane();
	}
	/**
	 * create a algorithm geometry 3D Space Sphere Instance
	 */
	createSphere(): ISphere {
		return CoAGeom.createSphere();
	}
}

const VoxAGeom = new T_CoAGeom();
export { VoxAGeom };
