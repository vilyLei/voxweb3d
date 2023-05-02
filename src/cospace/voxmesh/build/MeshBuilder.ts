/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IMatrix4 from "../../../vox/math/IMatrix4";

import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import { IMeshBuilder } from "./IMeshBuilder";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class MeshBuilder implements IMeshBuilder {

    protected m_bufSortFormat = 0x0;
    vbWholeDataEnabled = false;
    wireframe = false;
    polyhedral = true;
    transMatrix: IMatrix4 = null;
    constructor() {
    }

    createIVSBYSize(size: number): Uint16Array | Uint32Array {
        return size > 65535 ? new Uint32Array(size) : new Uint16Array(size);
    }
    createIVSByArray(arr: number[]): Uint16Array | Uint32Array {
        return arr.length > 65535 ? new Uint32Array(arr) : new Uint16Array(arr);
    }
    /**
     * @param layoutBit vertex shader vertex attributes layout bit status.
     *                  the value of layoutBit comes from the material shdder program.
     */
    setBufSortFormat(layoutBit: number): void {
        this.m_bufSortFormat = layoutBit;
    }
    applyMaterial(material: IRenderMaterial, texEnabled: boolean = false): void {
        texEnabled = texEnabled || material.getTextureAt(0) != null;
        material.initializeByCodeBuf(texEnabled );
        this.m_bufSortFormat = material.getBufSortFormat();
    }
    protected createMesh(): IRawMesh {

        let mesh = CoRScene.createRawMesh();
        mesh.setTransformMatrix(this.transMatrix);
        mesh.setBufSortFormat(this.m_bufSortFormat);
        mesh.reset();

        this.setMeshData(mesh);

        mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
        mesh.wireframe = this.wireframe;
        mesh.setPolyhedral(this.polyhedral);
        mesh.initialize();
        mesh.toElementsTriangles();

        this.transMatrix = null;
        this.m_bufSortFormat = 0x0;
        return mesh;
    }
    protected setMeshData(mesh: IRawMesh): void {
       
    }
}
export { MeshBuilder }