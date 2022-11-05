/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderEntity from "../../../vox/render/IRenderEntity";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import { VtxBufRenderData } from "../../../vox/mesh/VtxBufRenderData";
import { IRenderableEntityBlock } from "./IRenderableEntityBlock";
import IDataMesh from "../../mesh/IDataMesh";
import DataMesh from "../../mesh/DataMesh";
import IVector3D from "../../math/IVector3D";
import IMatrix4 from "../../math/IMatrix4";
import IAABB from "../../geom/IAABB";
import AABB from "../../geom/AABB";
import Vector3D from "../../math/Vector3D";
import Matrix4 from "../../math/Matrix4";

class RenderableEntityBlock implements IRenderableEntityBlock {

    private m_initFlag: boolean = true;

    readonly screenPlane = new DisplayEntity();
    /**
     * center align in the XOY Plane, its size is 1
     */
    readonly unitXOYPlane = new DisplayEntity();
    /**
     * center align in the XOZ Plane, its size is 1
     */
    readonly unitXOZPlane = new DisplayEntity();
    /**
     * center align in the YOZ Plane, its size is 1
     */
    readonly unitYOZPlane = new DisplayEntity();
    /**
     * center align, its size is 1
     */
    readonly unitBox = new DisplayEntity();

    /**
     * axis origin align in the XOY Plane, its size is 1
     */
    readonly unitOXOYPlane = new DisplayEntity();
    /**
     * axis origin align in the XOZ Plane, its size is 1
     */
    readonly unitOXOZPlane = new DisplayEntity();
    /**
     * axis origin align in the YOZ Plane, its size is 1
     */
    readonly unitOYOZPlane = new DisplayEntity();
    /**
     * axis origin align, its size is 1
     */
    readonly unitOBox = new DisplayEntity();

    constructor() { }

    initialize(): void {

        if (this.m_initFlag) {
            this.m_initFlag = false;

            let vtxData = new VtxBufRenderData();

            let vs = new Float32Array([1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]);
            for (let i = 0; i < vs.length; ++i) { vs[i] *= 0.5; }
            let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]);
            let nvs = new Float32Array([0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
            let ivs = new Uint16Array([3, 2, 1, 3, 1, 0, 6, 7, 4, 6, 4, 5, 11, 10, 9, 11, 9, 8, 15, 14, 13, 15, 13, 12, 18, 19, 16, 18, 16, 17, 22, 23, 20, 22, 20, 21]);

            let dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitBox.setMesh(dm);
            vs = new Float32Array(vs);
            for (let i = 0; i < vs.length; ++i) { vs[i] += 0.5; }
            // console.log("obox vs: ",vs);
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitOBox.setMesh(dm);

            vs = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
            uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
            nvs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
            ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);

            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.screenPlane.setMesh(dm);

            for (let i = 0; i < vs.length; ++i) { vs[i] *= 0.5; }
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitXOYPlane.setMesh(dm);
            vs = new Float32Array(vs);
            for (let i = 0; i < vs.length;) { vs[i++] += 0.5; vs[i++] += 0.5; i++;}
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitOXOYPlane.setMesh(dm);


            vs = new Float32Array([0.5, 0, -0.5, -0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, 0.5]);
            nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitXOZPlane.setMesh(dm);
            vs = new Float32Array(vs);
            for (let i = 0; i < vs.length;) { vs[i++] += 0.5; i++; vs[i++] += 0.5;}
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitOXOZPlane.setMesh(dm);

            vs = new Float32Array([0, -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5]);
            nvs = new Float32Array([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0]);
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitYOZPlane.setMesh(dm);
            for (let i = 0; i < vs.length;) { i++; vs[i++] += 0.5; vs[i++] += 0.5;}
            dm = new DataMesh();
            dm.setVS(vs).setUVS(uvs).setNVS(nvs).setIVS(ivs).setVtxBufRenderData(vtxData);
            dm.vbWholeDataEnabled = true;
            dm.initialize();
            this.unitOYOZPlane.setMesh(dm);
        }
    }

    createVector3(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0): IVector3D {
        return new Vector3D(x, y, z, w);
    }
    createMatrix4(): IMatrix4 {
        return new Matrix4();
    }
    createAABB(): IAABB {
        return new AABB();
    }
    createEntity(): IRenderEntity {
        return new DisplayEntity();
    }
    createMesh(): IDataMesh {
        return new DataMesh();
    }
}

export { RenderableEntityBlock }