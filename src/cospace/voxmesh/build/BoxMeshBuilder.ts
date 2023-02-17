/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

import { MeshBuilder } from "./MeshBuilder";
import { IBoxMeshBuilder } from "./IBoxMeshBuilder";

class BoxMeshBuilder extends MeshBuilder implements IBoxMeshBuilder {

    constructor() {
        super();
    }
    private m_posList: number[][] = new Array(8);
    private m_cv: IVector3D;

    flatNormal = true;
    normalScale = 1.0;
    uScale = 1.0;
    vScale = 1.0;
    flipVerticalUV = false;
    uvPartsNumber = 0;

    createCube(cubeSize: number): IRawMesh {
        let h = cubeSize * 0.5;
        let minV = CoMath.createVec3(-h, -h, -h);
        let maxV = CoMath.createVec3(h, h, h);
        return this.create(minV, maxV);
    }
    create(minV: IVector3D, maxV: IVector3D): IRawMesh {

        this.m_cv = minV.clone().addBy(maxV).scaleBy(0.5);
        
        this.m_posList[0] = [maxV.x, minV.y, maxV.z];
        this.m_posList[1] = [maxV.x, minV.y, minV.z];
        this.m_posList[2] = [minV.x, minV.y, minV.z];
        this.m_posList[3] = [minV.x, minV.y, maxV.z];

        this.m_posList[4] = [maxV.x, maxV.y, maxV.z];
        this.m_posList[5] = [maxV.x, maxV.y, minV.z];
        this.m_posList[6] = [minV.x, maxV.y, minV.z];
        this.m_posList[7] = [minV.x, maxV.y, maxV.z];

        return this.createMesh();
    }
    scaleUVFaceAt(uvs: Float32Array, faceI: number, u: number, v: number, du: number, dv: number) {
        if (uvs != null && faceI >= 0 && faceI < 6) {
            let i: number = faceI * 8;
            let t: number = i + 8;
            for (; i < t; i += 2) {
                uvs[i] = u + uvs[i] * du;
                uvs[i + 1] = v + uvs[i + 1] * dv;
            }
        }
    }
    // private initUVData(baseI: number, uvs: Float32Array): void {
    //     let uScale = this.uScale;
    //     let vScale = this.vScale;
    //     let i: number = 0;
    //     if (this.flipVerticalUV) {
    //         while (i < baseI) {
    //             uvs[i] = 1.0 * uScale; uvs[i + 1] = 1.0 * vScale;
    //             uvs[i + 2] = 0.0 * uScale; uvs[i + 3] = 1.0 * vScale;
    //             uvs[i + 4] = 0.0 * uScale; uvs[i + 5] = 0.0 * vScale;
    //             uvs[i + 6] = 1.0 * uScale; uvs[i + 7] = 0.0 * vScale;
    //             i += 8;
    //         }
    //     }
    //     else {
    //         while (i < baseI) {
    //             uvs[i] = 0.0 * uScale; uvs[i + 1] = 0.0 * vScale;
    //             uvs[i + 2] = 1.0 * uScale; uvs[i + 3] = 0.0 * vScale;
    //             uvs[i + 4] = 1.0 * uScale; uvs[i + 5] = 1.0 * vScale;
    //             uvs[i + 6] = 0.0 * uScale; uvs[i + 7] = 1.0 * vScale;
    //             i += 8;
    //         }
    //     }
    // }
    protected setMeshData(mesh: IRawMesh): void {

        let facePosIds: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 4, 5, 1, 0, 5, 6, 2, 1, 7, 6, 2, 3, 4, 7, 3, 0];

        let faceTotal: number = 6;
        let vtxTotal = 24;
        let i: number = 0;
        let k: number = 0;
        let baseI: number = 0;

        let vs = new Float32Array(72);
        let ivs = new Uint16Array(36);
        let flags: number[] = [3, 2, 3, 3, 2, 2];
        for (i = 0; i < 6; ++i) {
            if (flags[i] == 3) {
                ivs[baseI] = k + 3; ivs[baseI + 1] = k + 2; ivs[baseI + 2] = k + 1;
                ivs[baseI + 3] = k + 3; ivs[baseI + 4] = k + 1; ivs[baseI + 5] = k;
            }
            else {
                ivs[baseI] = k + 2; ivs[baseI + 1] = k + 3; ivs[baseI + 2] = k;
                ivs[baseI + 3] = k + 2; ivs[baseI + 4] = k; ivs[baseI + 5] = k + 1;
            }
            baseI += 6;
            k += 4;
        }


        
        let idList: number[] = facePosIds;
        let list: number[][] = this.m_posList;
        let arr: number[];
        
        k = 0;
        for (i = 0; i < vtxTotal; ++i) {
            arr = list[idList[i]];
            vs.set(arr, k);
            k += 3;
        }

        mesh.addFloat32Data(vs, 3);

        if (mesh.isUVSEnabled()) {
            let uvs = new Float32Array(48);
            if (this.uvPartsNumber == 4) {
                this.scaleUVFaceAt(uvs, 0, 0.5, 0.5, 0.5, 0.5);
                this.scaleUVFaceAt(uvs, 1, 0.0, 0.0, 0.5, 0.5);
                this.scaleUVFaceAt(uvs, 2, 0.5, 0.0, 0.5, 0.5);
                this.scaleUVFaceAt(uvs, 3, 0.0, 0.5, 0.5, 0.5);
                this.scaleUVFaceAt(uvs, 4, 0.5, 0.0, 0.5, 0.5);
                this.scaleUVFaceAt(uvs, 5, 0.0, 0.5, 0.5, 0.5);
            } else if (this.uvPartsNumber == 6) {

                this.scaleUVFaceAt(uvs, 0, 0.0, 0.0, 0.25, 0.5);
                this.scaleUVFaceAt(uvs, 1, 0.25, 0.0, 0.25, 0.5);
                this.scaleUVFaceAt(uvs, 2, 0.5, 0.0, 0.25, 0.5);
                this.scaleUVFaceAt(uvs, 3, 0.75, 0.0, 0.25, 0.5);
                this.scaleUVFaceAt(uvs, 4, 0.0, 0.5, 0.25, 0.5);
                this.scaleUVFaceAt(uvs, 5, 0.25, 0.5, 0.25, 0.5);
            }
            mesh.addFloat32Data(uvs, 2);
        }
        if (mesh.isNVSEnabled()) {
            let nvs = new Float32Array(72);
            baseI = 0;
            let nx = 0.0;
            let ny = 0.0;
            let nz = 0.0;
            let s = this.normalScale;
            if (this.flatNormal) {
                while (baseI < faceTotal) {
                    nx = 0.0; ny = 0.0; nz = 0.0;
                    switch (baseI) {
                        case 0:
                            ny = -1.0;
                            break;
                        case 1:
                            ny = 1.0;
                            break;
                        case 2:
                            nx = 1.0;
                            break;
                        case 3:
                            nz = -1.0;
                            break;
                        case 4:
                            nx = -1.0;
                            break;
                        case 5:
                            nz = 1.0;
                            break;
                        default:
                            break;
                    }

                    i = baseI * 12;
                    nx *= s;
                    ny *= s;
                    nz *= s;
                    nvs[i] = nx; nvs[i + 1] = ny; nvs[i + 2] = nz;
                    nvs[i + 3] = nx; nvs[i + 4] = ny; nvs[i + 5] = nz;
                    nvs[i + 6] = nx; nvs[i + 7] = ny; nvs[i + 8] = nz;
                    nvs[i + 9] = nx; nvs[i + 10] = ny; nvs[i + 11] = nz;

                    ++baseI;
                }
            }
            else {
                let centV = this.m_cv;
                let d = 0.0;
                while (baseI < vtxTotal) {
                    i = baseI * 3;
                    nx = vs[i] - centV.x;
                    ny = vs[i + 1] - centV.y;
                    nz = vs[i + 2] - centV.z;
                    d = Math.sqrt(nx * nx + ny * ny + nz * nz);

                    if (d > 0.000001) {
                        nvs[i] = nx / d;
                        nvs[i + 1] = ny / d;
                        nvs[i + 2] = nz / d;
                    }
                    ++baseI;
                }
            }

            mesh.addFloat32Data(nvs, 3);
        }
        mesh.setIVS(ivs);
    }
}
export { BoxMeshBuilder };