/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import MeshBase from "../../vox/mesh/MeshBase";
import DisplayEntity from "../entity/DisplayEntity";
import IMatrix4 from "../math/IMatrix4";
import GeometryBase from "./GeometryBase";

class GeomDataNode {
    ivs: Uint16Array | Uint32Array = null;
    vs: Float32Array = null
    uvs: Float32Array = null;
    nvs: Float32Array = null;
    cvs: Float32Array = null;
    vsStride: number = 3;
    mat4: IMatrix4 = null;
    offset: Vector3D = null;
    
    constructor() { }
    destroy(): void {
        this.ivs = null;
        this.vs = null;
        this.uvs = null;
        this.nvs = null;
    }
}
/**
 * 合并多个geometry数据到单个
 */
class GeometryMerger extends GeometryBase {

    private m_nodes: GeomDataNode[] = [];
    constructor() {
        super();
    }
    static MergeSameIvs(src_ivs: Uint16Array | Uint32Array, src_vs: Float32Array, vsStride: number, total: number): Uint16Array | Uint32Array {
        
        let len = src_ivs.length;
        let new_ivs = new Uint16Array(len * total);
        new_ivs.set(src_ivs, 0);
        let ivsStep = src_vs.length / vsStride;
        let i = 0;
        let k0 = 0;
        let k1 = 0;
        for (k0 = 1; k0 < total; ++k0) {
            ivsStep = k0 * 24;
            i = len * k0;
            new_ivs.set(src_ivs, i);
            k1 = i + len;
            for (; i < k1; ++i) {
                new_ivs[i] += ivsStep;
            }
        }
        return new_ivs;
    }
    addEntity(entity: DisplayEntity, toWorld: boolean = true): void {

        let mesh = entity.getMesh();
        if (entity != null && mesh != null) {
            entity.update();
            let node = new GeomDataNode();
            node.ivs = mesh.getIVS();
            node.vs = mesh.getVS();
            node.uvs = mesh.getUVS();
            node.nvs = mesh.getNVS();
            node.cvs = mesh.getCVS();
            if (toWorld) {
                node.vs = node.vs.slice(0);
                let mat4 = entity.getMatrix();
                mat4.transformVectorsSelf(node.vs, node.vs.length);
            }
            this.m_nodes.push(node);
        }
    }
    addGeometry(geom: GeometryBase, mat4: IMatrix4 = null): void {
        if (geom != null && geom != this) {
            let node = new GeomDataNode();
            node.ivs = geom.getIVS();
            node.vs = geom.getVS();
            node.uvs = geom.getUVS();
            node.nvs = geom.getNVS();
            node.cvs = geom.getCVS();
            if(mat4 != null) {
                // to do ...
            }
            this.m_nodes.push(node);
        }
    }
    addMesh(mesh: MeshBase): void {

        if (mesh != null) {

            let node: GeomDataNode = new GeomDataNode();
            node.ivs = mesh.getIVS();
            node.vs = mesh.getVS();
            node.uvs = mesh.getUVS();
            node.nvs = mesh.getNVS();
            node.cvs = mesh.getCVS();
            this.m_nodes.push(node);
        }
    }

    merger(): void {

        let ivs: Uint16Array | Uint32Array = null;
        let vs: Float32Array = null;
        let uvs: Float32Array = null;
        let nvs: Float32Array = null;
        let cvs: Float32Array = null;
        let i: number = 0;
        let node: GeomDataNode = null;
        let tot = this.m_nodes.length;
        if (tot > 0) {

            let j = 0;
            let ivsLen = 0;
            let vsLen = 0;
            let uvsLen = 0;
            let nvsLen = 0;
            let cvsLen = 0;

            let ivsI = 0;
            let vsI = 0;
            let uvsI = 0;
            let nvsI = 0;
            let cvsI = 0;

            for (i = 0; i < tot; ++i) {
                node = this.m_nodes[i];
                ivsLen += node.ivs.length;
                vsLen += node.vs.length;
                if (node.uvs != null) uvsLen += node.uvs.length;
                if (node.nvs != null) nvsLen += node.nvs.length;
                if (node.cvs != null) cvsLen += node.cvs.length;
            }
            let vtxTotal = vsLen / node.vsStride;
            if (vtxTotal > 65535) {
                ivs = new Uint32Array(ivsLen);
            }
            else {
                ivs = new Uint16Array(ivsLen);
            }
            vs = new Float32Array(vsLen);
            if (uvsLen > 0) {
                uvs = new Float32Array(uvsLen);
            }
            if (nvsLen > 0) {
                nvs = new Float32Array(nvsLen);
            }
            if (cvsLen > 0) {
                cvs = new Float32Array(cvsLen);
            }
            let subIVSLen: number;
            let maxIndex: number = 0;
            let subIVS: Uint16Array | Uint32Array = null;
            let subVS: Float32Array = null;
            let subUVS: Float32Array = null;
            let subNVS: Float32Array = null;
            let subCVS: Float32Array = null;

            for (i = 0; i < tot; ++i) {
                node = this.m_nodes[i];

                subIVS = node.ivs;
                subIVSLen = subIVS.length;
                for (j = 0; j < subIVSLen; j++) {
                    ivs[ivsI++] = subIVS[j] + maxIndex;
                }
                subVS = node.vs;
                maxIndex += subVS.length / 3;

                vs.set(subVS, vsI);
                vsI += subVS.length;

                if (uvsLen > 0) {
                    subUVS = node.uvs;
                    uvs.set(subUVS, uvsI);
                    uvsI += subUVS.length;
                }
                if (nvsLen > 0) {
                    subNVS = node.nvs;
                    nvs.set(subNVS, nvsI);
                    nvsI += subNVS.length;
                }
                if (cvsLen > 0) {
                    subCVS = node.cvs;
                    cvs.set(subCVS, cvsI);
                    cvsI += subCVS.length;
                }
            }

            this.m_ivs = ivs;
            this.m_vs = vs;
            this.m_uvs = uvs;
            this.m_nvs = nvs;
            this.m_cvs = cvs;
        }
        else {
            throw Error("meshs total less than 2.");
        }
        for (i = 0; i < tot; ++i) {
            this.m_nodes[i].destroy();
        }
        this.m_nodes = [];
    }
}

export { GeometryMerger };