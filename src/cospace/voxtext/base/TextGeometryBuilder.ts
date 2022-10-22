/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRawMesh from "../../../vox/mesh/IRawMesh";
import H5Text from "./H5Text";

// import RawMesh from "../../../vox/mesh/RawMesh";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

export default class TextGeometryBuilder {
	constructor() {}
	private m_ivs: Uint16Array = null;
	private m_vs: Float32Array = null;
	private m_uvs: Float32Array = null;
	private m_h5Text: H5Text = null;

	private m_width: number = 0;
	private m_height: number = 0;
	private m_charsTotal: number = 0;
	private m_text: string = "";

	flipVerticalUV: boolean = false;
	vtxUVEnabled: boolean = true;
	vertColorEnabled: boolean = false;
	alignFactorX: number = 0.5;
	alignFactorY: number = 0.5;
	vbWholeDataEnabled: boolean = true;
	getWidth(): number {
		return this.m_width;
	}
	getHeight(): number {
		return this.m_height;
	}
	private static s_initIvs: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);
	private static s_currIvs: Uint8Array = new Uint8Array([0, 1, 2, 0, 2, 3]);
	private static s_sizeArr: number[] = [0, 0];

	private createMesh(text: string, mesh: IRawMesh): IRawMesh {
		this.m_text = text;
		let charsTot = text.length;
		this.m_charsTotal = charsTot;

		if (charsTot > 0) {
			let tmb = TextGeometryBuilder;

			let ivs: Uint8Array = tmb.s_currIvs;
			ivs.set(tmb.s_initIvs, 0);
			if (this.m_ivs == null) {
				this.m_ivs = new Uint16Array(charsTot * 6);
				for (let i: number = 0; i < charsTot; ++i) {
					this.m_ivs.set(ivs, i * 6);
					ivs[0] += 4;
					ivs[1] += 4;
					ivs[2] += 4;
					ivs[3] += 4;
					ivs[4] += 4;
					ivs[5] += 4;
				}
			}

			let expand = false;
			let h5Text = this.m_h5Text;

			h5Text.createCharsTexFromStr(text);
			this.m_width = -1;
			this.m_height = 0;
			let sizeArr: number[] = tmb.s_sizeArr;
			let i: number = 0;
			let maxX: number = 0;
			let maxY: number = 0;
			let minX: number = 0;
			let minY: number = 0;
			expand = this.m_vs != null && charsTot * 8 > this.m_vs.length;
			let charTable = h5Text.getCharTable();
			if (expand) {
				let ivs = tmb.s_currIvs;
				ivs.set(tmb.s_initIvs, 0);
				this.m_ivs = new Uint16Array(charsTot * 6);
				this.m_uvs = new Float32Array(charsTot * 8);
				this.m_vs = new Float32Array(charsTot * 8);
				for (; i < charsTot; ++i) {
					this.m_ivs.set(ivs, i * 6);
					ivs[0] += 4;
					ivs[1] += 4;
					ivs[2] += 4;
					ivs[3] += 4;
					ivs[4] += 4;
					ivs[5] += 4;
					charTable.getUV8AndSizeFromChar(text.charAt(i), this.m_uvs, sizeArr, i * 8);
					if (this.m_height < sizeArr[1]) {
						this.m_height = sizeArr[1];
					}
					this.m_vs[i * 8] = sizeArr[0];
					this.m_width += sizeArr[0];
				}
			} else {
				if (this.m_vs == null) {
					this.m_uvs = new Float32Array(charsTot * 8);
					this.m_vs = new Float32Array(charsTot * 8);
				}

				for (; i < charsTot; ++i) {
					charTable.getUV8AndSizeFromChar(text.charAt(i), this.m_uvs, sizeArr, i * 8);
					if (this.m_height < sizeArr[1]) {
						this.m_height = sizeArr[1];
					}
					this.m_vs[i * 8] = sizeArr[0];
					this.m_width += sizeArr[0];
				}
			}
			let dis = 1.0;
			this.m_width += charsTot * dis;
			minX = -this.alignFactorX * this.m_width;
			minY = -this.alignFactorY * this.m_height;
			maxY = minY + this.m_height;
			let j: number = 0;
			for (i = 0; i < charsTot; ++i) {
				maxX = minX + this.m_vs[j];
				this.m_vs[j] = minX;
				this.m_vs[j + 1] = minY;
				this.m_vs[j + 2] = maxX;
				this.m_vs[j + 3] = minY;
				this.m_vs[j + 4] = maxX;
				this.m_vs[j + 5] = maxY;
				this.m_vs[j + 6] = minX;
				this.m_vs[j + 7] = maxY;
				minX = maxX + dis;
				j += 8;
			}

			let mesh = CoRScene.createRawMesh();
			// mesh = mesh == null ? new RawMesh() : mesh;
			mesh.reset();
			mesh.setIVS(this.m_ivs);
			mesh.addFloat32Data(this.m_vs, 2);
			mesh.addFloat32Data(this.m_uvs, 2);
			mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
			mesh.initialize();
			mesh.vtCount = charsTot * 6;
			mesh.vtxTotal = charsTot * 4;
			mesh.trisNumber = charsTot * 2;
			return mesh;
		}
		return null;
	}

	initialize(h5Text: H5Text): void {
		this.m_h5Text = h5Text;
	}
	create(text: string, mesh: IRawMesh = null): IRawMesh {
		return this.createMesh(text, mesh);
	}
	/*
    initialize(text: string, h5Text: H5Text): void {
        //console.log("RectPlaneMesh::initialize()...");
		this.m_h5Text = h5Text;
        let charsTot = text.length;
        let ivs = TextGeometryBuilder.s_currIvs;
        ivs.set(TextGeometryBuilder.s_initIvs, 0);
        if (this.m_ivs == null) {
            this.m_ivs = new Uint16Array(charsTot * 6);
        }
        for (let i: number = 0; i < charsTot; ++i) {
            this.m_ivs.set(ivs, i * 6);
            ivs[0] += 4;
            ivs[1] += 4;
            ivs[2] += 4;
            ivs[3] += 4;
            ivs[4] += 4;
            ivs[5] += 4;
        }
        this.createMesh(text);

        // ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        // this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
        // this.m_vbuf.setUintIVSData(this.m_ivs);
        // //this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLE_STRIP;
        // this.buildEnd();
    }
	//*/
	// updateCharStr(text: string): void {
	//     // if (this.m_vbuf != null && this.m_text != text) {
	//     //     this.createMesh(text);
	//     //     this.buildEnd();
	//     //     ROVertexBuffer.UpdateBufData(this.m_vbuf);
	//     // }
	// }
	destroy(): void {
		// if (this.isResFree()) {
		//     this.bounds = null;

		//     this.m_vs = null;
		//     this.m_uvs = null;
		//     super.__$destroy();
		// }
		this.m_h5Text = null;
	}
}
