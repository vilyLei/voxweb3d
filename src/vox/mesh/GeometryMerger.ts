/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import MeshBase from "../../vox/mesh/MeshBase";
import DisplayEntity from "../entity/DisplayEntity";
import Matrix4 from "../math/Matrix4";
import GeometryBase from "./GeometryBase";

class GeomDataNode {
    ivs: Uint16Array | Uint32Array = null;
    vs: Float32Array = null
    uvs: Float32Array = null;
    nvs: Float32Array = null;
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

    addEntity(entity: DisplayEntity, toWorld: boolean = true): void {

        if (entity != null) {

            let mesh: MeshBase = entity.getMesh();
            let node: GeomDataNode = new GeomDataNode();
            node.ivs = mesh.getIVS();
            node.vs = mesh.getVS();
            node.uvs = mesh.getUVS();
            node.nvs = mesh.getNVS();
            if (toWorld) {
                node.vs = node.vs.slice(0);
                let mat4: Matrix4 = entity.getMatrix();
                mat4.transformVectorsSelf(node.vs, node.vs.length);
            }
            this.m_nodes.push(node);
        }
    }
    addGeometry(geom: GeometryBase): void {
        if (geom != null && geom != this) {
            let node: GeomDataNode = new GeomDataNode();
            node.ivs = geom.getIVS();
            node.vs = geom.getVS();
            node.uvs = geom.getUVS();
            node.nvs = geom.getNVS();
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
            this.m_nodes.push(node);
        }
    }

    merger(): void {

        let ivs: Uint16Array | Uint32Array = null;
        let vs: Float32Array = null;
        let uvs: Float32Array = null;
        let nvs: Float32Array = null;
        let i: number = 0;
        let node: GeomDataNode = null;
        let tot: number = this.m_nodes.length;
        if (tot > 1) {

            let j: number = 0;
            let ivsLen: number = 0;
            let vsLen: number = 0;
            let uvsLen: number = 0;
            let nvsLen: number = 0;

            let ivsI: number = 0;
            let vsI: number = 0;
            let uvsI: number = 0;
            let nvsI: number = 0;

            for (i = 0; i < tot; ++i) {
                node = this.m_nodes[i];
                ivsLen += node.ivs.length;
                vsLen += node.vs.length;
                if (node.uvs != null) uvsLen += node.uvs.length;
                if (node.nvs != null) nvsLen += node.nvs.length;
            }
            let vtxTotal: number = vsLen / 3;
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
            let subIVSLen: number;
            let maxIndex: number = 0;
            let subIVS: Uint16Array | Uint32Array = null;
            let subVS: Float32Array = null;
            let subUVS: Float32Array = null;
            let subNVS: Float32Array = null;

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
            }

            this.m_ivs = ivs;
            this.m_vs = vs;
            this.m_uvs = uvs;
            this.m_nvs = nvs;
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