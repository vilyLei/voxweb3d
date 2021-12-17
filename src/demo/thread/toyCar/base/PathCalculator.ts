/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import { TerrainPathStatus, TerrainPath } from "../terrain/TerrainPath";
import { TerrainData } from "../terrain/TerrainData";;

class PathCalculator {
    private static s_posList: Vector3D[] = new Array(256);
    constructor() {
    }
    static GetPathPosList(vs: Uint16Array, path: TerrainPath, terrData: TerrainData): Vector3D[] {

        let posList: Vector3D[] = PathCalculator.s_posList;//[];//new Array(vs.length >> 1);
        let k: number = 0;
        let r: number = path.r0;
        let c: number = path.c0;
        let preR: number = r;
        let preC: number = c;
        posList[k++] = terrData.getTerrainPositionByRC(r, c).clone();
        for (let i: number = vs.length - 1; i > 0;) {
            r = vs[i - 1];
            c = vs[i];
            let pv = null;//terrData.getTerrainPositionByRC(r, c);
            // posList[k++] = pv.clone();
            if (preR != r && preC != c) {
                // 前面新增
                if (preR == r) {
                    if (preC > c) {
                        pv = terrData.getTerrainPositionByRC(r, c + 1);
                        posList[k++] = pv.clone();
                    }
                    else if (preC < c) {
                        pv = terrData.getTerrainPositionByRC(r, c - 1);
                        posList[k++] = pv.clone();
                    }
                }
                else if (preC == c) {
                    if (preR > r) {
                        pv = terrData.getTerrainPositionByRC(r + 1, c);
                        posList[k++] = pv.clone();
                    }
                    else if (preR < r) {
                        pv = terrData.getTerrainPositionByRC(r - 1, c);
                        posList[k++] = pv.clone();
                    }
                }
            }
            pv = terrData.getTerrainPositionByRC(r, c);
            posList[k++] = pv.clone();
            if (preR != r && preC != c) {
                // 后面新增
                if (preR == r) {
                    if (preC > c) {
                        pv = terrData.getTerrainPositionByRC(r, c + 1);
                        posList[k++] = pv.clone();
                    }
                    else if (preC < c) {
                        pv = terrData.getTerrainPositionByRC(r, c - 1);
                        posList[k++] = pv.clone();
                    }
                }
                else if (preC == c) {
                    if (preR > r) {
                        pv = terrData.getTerrainPositionByRC(r + 1, c);
                        posList[k++] = pv.clone();
                    }
                    else if (preR < r) {
                        pv = terrData.getTerrainPositionByRC(r - 1, c);
                        posList[k++] = pv.clone();
                    }
                }
            }

            preR = vs[i - 1];
            preC = vs[i];
            i -= 2;
        }
        
        let list: Vector3D[] = new Array(k);
        for (let i: number = 0; i < k; i++) {
            list[i] = posList[i];
        }
        return list;
    }
}
export { PathCalculator };