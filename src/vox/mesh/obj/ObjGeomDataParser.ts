/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ObjStrDataParser } from "./ObjStrDataParser";
import { ObjDataParser } from "../../../vox/assets/ObjDataParser";
import IObjGeomDataParser from "./IObjGeomDataParser";

export default class ObjGeomDataParser implements IObjGeomDataParser {

    private m_ivs: Uint16Array | Uint32Array = null;
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;
    private m_strDataParser: ObjStrDataParser = null;
    moduleScale: number = 1.0;
    baseParsering: boolean = false;
    constructor() {
    }
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    getIVS(): Uint16Array | Uint32Array | Uint32Array { return this.m_ivs; }

    parse(objDataStr: string, dataIsZxy: boolean = false): void {

        if (this.baseParsering) {

            this.m_strDataParser = new ObjStrDataParser();
            this.m_strDataParser.parseStrData(objDataStr, this.moduleScale, dataIsZxy);

            this.m_vs = new Float32Array(this.m_strDataParser.getVS());
            this.m_uvs = new Float32Array(this.m_strDataParser.getUVS());
            this.m_nvs = new Float32Array(this.m_strDataParser.getNVS());
            let ivs = this.m_strDataParser.getIVS();
            this.m_ivs = ivs.length <= 65535 ? new Uint16Array(ivs) : new Uint32Array(ivs);
        }else {

            let objParser = new ObjDataParser();
            let objMeshes = objParser.Parse(objDataStr);
			console.log("objMeshes: ", objMeshes);
            let objMeshesTotal: number = objMeshes.length;
            let vsTotalLen: number = 0;
            for (let i: number = 0; i < objMeshesTotal; ++i) {
                vsTotalLen += objMeshes[i].geometry.vertices.length;
            }
            let vtxTotal = vsTotalLen / 3;
            let uvsTotalLen: number = 2 * vtxTotal;
            this.m_vs = new Float32Array(vsTotalLen);

            let k: number = 0;
            for (let i: number = 0; i < objMeshesTotal; ++i) {
                this.m_vs.set(objMeshes[i].geometry.vertices, k);
                k += objMeshes[i].geometry.vertices.length;
            }

            if (this.moduleScale != 1.0) {
                for (let i: number = 0; i < objMeshesTotal; ++i) {
                    this.m_vs[i] *= this.moduleScale;
                }
            }

            this.m_uvs = new Float32Array(uvsTotalLen);
            k = 0;
            for (let i: number = 0; i < objMeshesTotal; ++i) {
                this.m_uvs.set(objMeshes[i].geometry.uvs, k);
                k += objMeshes[i].geometry.uvs.length;
            }
            this.m_nvs = new Float32Array(vsTotalLen);
            k = 0;
            for (let i: number = 0; i < objMeshesTotal; ++i) {
                this.m_nvs.set(objMeshes[i].geometry.normals, k);
                k += objMeshes[i].geometry.normals.length;
            }
            this.m_ivs = vtxTotal <= 65535 ? new Uint16Array(vtxTotal) : new Uint32Array(vtxTotal);
            for (let i: number = 0; i < vtxTotal; ++i) {
                this.m_ivs[i] = i;
            }
            if (dataIsZxy) {
                let vs = this.m_vs;
                let px: number;
                let py: number;
                let pz: number;
                for (let i: number = 0; i < vtxTotal; ++i) {
                    px = vs[k];
                    py = vs[k + 1];
                    pz = vs[k + 2];
                    vs[k] = py;
                    vs[k + 1] = pz;
                    vs[k + 2] = px;
                    k += 3;
                }
            }
        }
    }
}
