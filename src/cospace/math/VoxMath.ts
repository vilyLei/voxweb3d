
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import { IVector3D, CoMathConst, CoOrientationType, CoVec3, IMatrix4, IAABB, IAABB2D, ICoMath } from "./ICoMath";

declare var CoMath: ICoMath;
interface inter_T_CoMath{
}
var OrientationType: CoOrientationType;
var MathConst: CoMathConst;
var Vector3D: CoVec3;
class T_CoMath {
    
    private init(): void {
        if(this.isEnabled()) {
            OrientationType = CoMath.OrientationType;
            MathConst = CoMath.MathConst;
            Vector3D = CoMath.Vector3D;
        }
    }
	private m_init = true;
	initialize(callback: (urls: string[]) => void = null, url: string = ""): boolean {
        this.init();
		this.m_init = !this.isEnabled();
		if (this.m_init) {
			this.m_init = false;
			if (url == "" || url === undefined) {
                url = "static/cospace/math/CoMath.umd.min.js";
			}
			new ModuleLoader(1, (): void => {
                this.init();
				if (callback != null && this.isEnabled()) callback([url]);
			}).load(url);

            return true;
		}
        return false;
	}
    isEnabled(): boolean {
        return typeof CoMath !== "undefined";
    }
    get Vector3D(): CoVec3 {
        return CoMath.Vector3D;
    }
    get MathConst(): CoMathConst {
        return CoMath.MathConst;
    }

    get OrientationType(): CoOrientationType {
        return CoMath.OrientationType;
    }
    /**
     * create a Vector3D instance
     * @param px the default vaue is 0.0
     * @param py the default vaue is 0.0
     * @param pz the default vaue is 0.0
     * @param pw the default vaue is 1.0
     */
    createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D {
        return CoMath.createVec3(px, py, pz, pw);
    }
    /**
     * 
     * @param pfs32 the default value is null
     * @param index the default value is 0
     * @returns IMatrix4 instance
     */
    createMat4(pfs32?: Float32Array, index?: number): IMatrix4 {
        return CoMath.createMat4(pfs32, index);
    }
    createAABB(): IAABB {
        return CoMath.createAABB();
    }
    createAABB2D(px?: number, py?: number, pwidth?: number, pheight?: number): IAABB2D {
        return CoMath.createAABB2D(px, py, pwidth, pheight);
    }

    isZero(v: number): boolean {
        return CoMath.isZero(v);
    }
    isNotZero(v: number): boolean {
        return CoMath.isNotZero(v);
    }
    /**
     * example:
     *     isGreaterPositiveZero(0.1) is true
     *     isGreaterPositiveZero(0.000000001) is false
     *     isGreaterPositiveZero(-0.1) is false
     * @param v number value
     * @returns a positive number value and its value is greater zero, return true, otherwize false
     */
    isGreaterPositiveZero(v: number): boolean {
        return CoMath.isGreaterPositiveZero(v);
    }
    /**
     * example:
     *      isLessNegativeZero(-0.1) is true
     *      isLessNegativeZero(-000000001) is false
     *      isLessNegativeZero(0.1) is false
     * @param v number value
     * @returns a negative number value and its value is less zero, return true, otherwise false
     */
    isLessNegativeZero(v: number): boolean {
        return CoMath.isLessNegativeZero(v);
    }
    /**
     * example:
     * 	isLessPositiveZero(+0.00000001) is true
     *  isLessPositiveZero(-1.3) is true
     *  isLessPositiveZero(1.3) is false
     * @param v number value
     * @returns true or false
     */
    isLessPositiveZero(v: number): boolean {
        return CoMath.isLessPositiveZero(v);
    }
    /**
     * example:
     * 	isGreaterNegativeZero(-0.00000001) is true
     *  isGreaterNegativeZero(+1.3) is true
     *  isGreaterNegativeZero(-1.3) is false
     * @param v number value
     * @returns true or false
     */
    isGreaterNegativeZero(v: number): boolean {
        return CoMath.isGreaterNegativeZero(v);
    }
    isPostiveZero(v: number): boolean {
        return CoMath.isPostiveZero(v);
    }
    isNegativeZero(v: number): boolean {
        return CoMath.isNegativeZero(v);
    }
    isGreaterRealZero(v: number): boolean {
        return CoMath.isGreaterRealZero(v);
    }
    isLessRealZero(v: number): boolean {
        return CoMath.isLessRealZero(v);
    }
}
const VoxMath = new T_CoMath();
export { OrientationType, Vector3D, MathConst, VoxMath };
