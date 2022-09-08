/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IDataMesh from "../../../vox/mesh/IDataMesh";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { IPlaneMeshBuilder } from "./IPlaneMeshBuilder";
import MeshVertex from "../../../vox/mesh/MeshVertex";
import { IMeshBuilder } from "./IMeshBuilder";

import { ICoRScene } from "../../voxengine/ICoRScene";
import IMatrix4 from "../../../vox/math/IMatrix4";
declare var CoRScene: ICoRScene;

class MeshBuilder {

    protected m_bufSortFormat: number = 0x0;
    vbWholeDataEnabled: boolean = false;
    wireframe: boolean = false;
    polyhedral: boolean = true;
    transMatrix: IMatrix4 = null;
    constructor() {
    }

    /**
     * @param layoutBit vertex shader vertex attributes layout bit status.
     *                  the value of layoutBit comes from the material shdder program.
     */
    setBufSortFormat(layoutBit: number): void {
        this.m_bufSortFormat = layoutBit;
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
        /*
        mesh.addFloat32Data(vs, 3);
        mesh.addFloat32Data(uvs, 2);
        mesh.addFloat32Data(nvs, 3);
        mesh.setIVS(ivs);
        //*/
    }
}
export { MeshBuilder }