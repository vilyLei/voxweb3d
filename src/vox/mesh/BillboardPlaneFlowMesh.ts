/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";

// class VSData extends Float32Array {
// 	version = 0;
// }

/**
 * static billboard plane group
 */
export default class BillboardPlaneFlowMesh extends MeshBase {
    constructor(bufDataUsage: number = VtxBufConst.VTX_STATIC_DRAW) {
        super(bufDataUsage);
    }
    private m_vs: Float32Array = null;
    private m_vs2: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_uvs2: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_cvs: Float32Array = null;
    private m_nvs2: Float32Array = null;

    private m_vsVer = 0;
    private m_vs2Ver = 0;
    private m_uvsVer = 0;
    private m_uvs2Ver = 0;
    private m_nvsVer = 0;
    private m_cvsVer = 0;
    private m_nvs2Ver = 0;

    private m_total = 0;
    private m_endTime = 0;
    flipVerticalUV = false;
    vtxColorEnabled = false;

    setUVSFloatArr(uvsFloatArr8: Float32Array): void {
        if (this.m_uvs == null) {
            this.m_uvs = new Float32Array(8);
        }
        this.m_uvs.set(uvsFloatArr8, 0);
		this.m_uvsVer ++;
    }
    setUVSArr(uvsArr8: number[]): void {
        if (this.m_uvs == null) {
            this.m_uvs = new Float32Array(8);
        }
        this.m_uvs.set(uvsArr8, 0);
		this.m_uvsVer ++;
    }
    createData(total: number): void {
        if (this.m_vs == null && total > 0) {
            this.m_endTime = 0;
            this.m_total = total;
            let i = 0;
            let base = 0;
            let pdivs = [0, 1, 2, 0, 2, 3];
            let pivs = new Uint16Array(total * 6);
            let len = total * 6;
            for (i = 0; i < len;) {
                pivs[i++] = pdivs[0] + base;
                pivs[i++] = pdivs[1] + base;
                pivs[i++] = pdivs[2] + base;
                pivs[i++] = pdivs[3] + base;
                pivs[i++] = pdivs[4] + base;
                pivs[i++] = pdivs[5] + base;
                base += 4;
            }
            this.m_ivs = pivs;
            this.m_vs = new Float32Array(total * 16);       // half size x, half size y, min scale,max scale
            this.m_vs2 = new Float32Array(total * 16);      // x,y,z, brightness or alpha intensity
            this.m_vs2.fill(1.0);
            this.m_uvs = new Float32Array(total * 8);
            this.m_uvs2 = new Float32Array(total * 16);     // lifeTime, fadeIn end time factor, fadeOut begin time factor, beginTime

			if(this.vtxColorEnabled) {
				this.m_cvs = new Float32Array(total * 16);
				this.m_cvs.fill(1.0);
			}
            this.m_nvs = new Float32Array(total * 16);      // movement velocity x and y and z, begin time point
            this.m_nvs2 = new Float32Array(total * 16);     // acceleration
            let baseValues: number[] = [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
            for (i = 0; i < total; ++i) {
                this.m_nvs.set(baseValues, i * 16);
            }
            let pduvs: number[] = [];
            if (this.flipVerticalUV) {
                pduvs = [
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0
                ];
            }
            else {
                pduvs = [
                    0.0, 1.0,
                    1.0, 1.0,
                    1.0, 0.0,
                    0.0, 0.0
                ];
            }
            for (i = 0; i < total; ++i) {
                this.m_uvs.set(pduvs, i * 8);
            }
            this.bounds = new AABB();
        }
    }
    setSizeAndScaleAt(i: number, width: number, height: number, minScale: number, maxScale: number): void {
        if (i >= 0 && i < this.m_total) {
            let maxX: number = 0.5 * width;
            let maxY: number = 0.5 * height;
            let minX: number = -maxX;
            let minY: number = -maxY;
            let dscale: number = maxScale - minScale;
            i *= 16;
            this.m_vs[i++] = minX; this.m_vs[i++] = minY; this.m_vs[i++] = minScale; this.m_vs[i++] = dscale;
            this.m_vs[i++] = maxX; this.m_vs[i++] = minY; this.m_vs[i++] = minScale; this.m_vs[i++] = dscale;
            this.m_vs[i++] = maxX; this.m_vs[i++] = maxY; this.m_vs[i++] = minScale; this.m_vs[i++] = dscale;
            this.m_vs[i++] = minX; this.m_vs[i++] = maxY; this.m_vs[i++] = minScale; this.m_vs[i++] = dscale;
			this.m_vsVer++;
            this.bounds.addXYZ(minX, minY, minX);
            this.bounds.addXYZ(maxX, maxY, maxX);
        }
    }

    setColorAt(i: number, r: number, g: number, b: number, alphaOrBrn: number = 1.0): void {
		if (i >= 0 && i < this.m_total) {
            i *= 16;
            for (let j = 0; j < 4; ++j) {
                this.m_cvs[i++] = r; this.m_cvs[i++] = g; this.m_cvs[i++] = b; this.m_cvs[i++] = alphaOrBrn;
            }
			this.m_cvsVer++;
        }
	}
    setPositionAt(i: number, x: number, y: number, z: number): void {
        if (i >= 0 && i < this.m_total) {
            i *= 16;
            for (let j = 0; j < 4; ++j) {
                this.m_vs2[i++] = x; this.m_vs2[i++] = y; this.m_vs2[i++] = z; i++;
            }
			this.m_vs2Ver++;
        }
    }
    setVelocityAt(i: number, spdX: number, spdY: number, spdZ: number): void {
        if (i >= 0 && i < this.m_total) {
            i *= 16;
            for (let j = 0; j < 4; ++j) {
                this.m_nvs[i++] = spdX; this.m_nvs[i++] = spdY; this.m_nvs[i++] = spdZ; i++;
            }
			this.m_nvsVer++;
        }
    }
    setAccelerationAt(i: number, accX: number, accY: number, accZ: number): void {
        if (i >= 0 && i < this.m_total) {
            i *= 16;
            for (let j = 0; j < 4; ++j) {
                this.m_nvs2[i++] = accX; this.m_nvs2[i++] = accY; this.m_nvs2[i++] = accZ; i++;
            }
			this.m_nvs2Ver++;
        }
    }
    setAlphaAt(i: number, alpha: number): void {
        if (i >= 0 && i < this.m_total) {
            i = i * 16 + 3;
            for (let j = 0; j < 4; ++j) {
                this.m_vs2[i] = alpha;
                i += 4;
            }
			this.m_vs2Ver++;
        }
    }
    setBrightnessAt(i: number, brightness: number): void {
        if (i >= 0 && i < this.m_total) {
            i = i * 16 + 3;
            for (let j = 0; j < 4; ++j) {
                this.m_vs2[i] = brightness;
                i += 4;
            }
			this.m_vs2Ver++;
        }
    }
    setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void {
        if (i >= 0 && i < this.m_total) {
            i *= 8;
            if (this.flipVerticalUV) {
                this.m_uvs[i++] = u; this.m_uvs[i++] = v;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v + dv;
                this.m_uvs[i++] = u; this.m_uvs[i] = v + dv;
            }
            else {
                this.m_uvs[i++] = u; this.m_uvs[i++] = v + dv;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v + dv;
                this.m_uvs[i++] = u + du; this.m_uvs[i++] = v;
                this.m_uvs[i++] = u; this.m_uvs[i] = v;
            }
			this.m_uvsVer++;
        }
    }
    setTimeAt(i: number, lifeTime: number, fadeInEndFactor: number, fadeOutBeginFactor: number, beginTime: number = 0.0): void {
        if (i >= 0 && i < this.m_total) {
            if (lifeTime < 0.1) lifeTime = 0.1;
            if (fadeInEndFactor > 0.9) fadeInEndFactor = 0.9;
            if (fadeOutBeginFactor < fadeInEndFactor) fadeOutBeginFactor = fadeInEndFactor;
            i *= 16;
			const uvs2 = this.m_uvs2;
            for (let j = 0; j < 4; ++j) {
                uvs2[i++] = lifeTime; uvs2[i++] = fadeInEndFactor;
                uvs2[i++] = fadeOutBeginFactor; uvs2[i++] = beginTime;
            }

            if (this.m_endTime < (beginTime + lifeTime)) {
                this.m_endTime = beginTime + lifeTime;
            }
			this.m_uvs2Ver++;
        }
    }
    setTimeSpeedAt(i: number, timeSpeed: number): void {
        if (i >= 0 && i < this.m_total) {
            i = i * 16 + 3;
            for (let j = 0; j < 4; ++j) {
                this.m_nvs[i] = timeSpeed;
                i += 4;
            }
        }
		this.m_nvsVer++;
    }
    getEndTime(): number {
        return this.m_endTime;
    }
    initialize(): void {

		this.updateData();
        this.buildEnd();
    }
	updateData(): void {
		const rvb = ROVertexBuffer;
		rvb.Reset();
		rvb.AddFloat32DataVer(this.m_vsVer);
        rvb.AddFloat32Data(this.m_vs, 4);
		rvb.AddFloat32DataVer(this.m_uvsVer);
        rvb.AddFloat32Data(this.m_uvs, 2);
		rvb.AddFloat32DataVer(this.m_nvsVer);
        rvb.AddFloat32Data(this.m_nvs, 4);
		if(this.vtxColorEnabled) {
			rvb.AddFloat32DataVer(this.m_cvsVer);
			rvb.AddFloat32Data(this.m_cvs, 4);
		}
		rvb.AddFloat32DataVer(this.m_vs2Ver);
        rvb.AddFloat32Data(this.m_vs2, 4);
		rvb.AddFloat32DataVer(this.m_uvs2Ver);
        rvb.AddFloat32Data(this.m_uvs2, 4);
		rvb.AddFloat32DataVer(this.m_nvs2Ver);
        rvb.AddFloat32Data(this.m_nvs2, 4);

        rvb.vbWholeDataEnabled = this.vbWholeDataEnabled;
        // this.m_vbuf = rvb.CreateBySaveData(this.getBufDataUsage());
		if (this.m_vbuf != null) {
			rvb.UpdateBufData(this.m_vbuf);
		} else {
			let u = this.getBufDataUsage();
			let f = this.getBufSortFormat();
			if (this.vbWholeDataEnabled) {
				this.m_vbuf = rvb.CreateBySaveData(u, f);
			} else {
				this.m_vbuf = rvb.CreateBySaveDataSeparate(u);
			}
		}

        this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );

        this.vtCount = this.m_ivs.length;
        this.vtxTotal = 4 * this.m_total;
        this.trisNumber = 2 * this.m_total;
        //  console.log("vs: "+this.m_vs);
        //  console.log("nvs: "+this.m_nvs);
        //  console.log("uvs: "+this.m_uvs);
        //  console.log("ivs: "+this.m_ivs);
        //  console.log("this.m_ivs.length: "+this.m_ivs.length);
        //  console.log("vtCount: "+this.vtCount);
	}
    setUV(pu: number, pv: number, du: number, dv: number): void {
        if (this.m_vbuf != null) {
            this.m_vbuf.setData2fAt(0, 1, pu, pv + dv);
            this.m_vbuf.setData2fAt(1, 1, pu + du, pv + dv);
            this.m_vbuf.setData2fAt(2, 1, pu + du, pv);
            this.m_vbuf.setData2fAt(3, 1, pu, pv);
        }
    }
    __$destroy(): void {
        this.m_vs = null;
        this.m_vs2 = null;
        this.m_uvs = null;
        this.m_uvs2 = null;
        this.m_nvs = null;
        this.m_nvs2 = null;
        super.__$destroy();
    }
}
