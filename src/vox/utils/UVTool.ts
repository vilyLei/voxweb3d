/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
class UVTool {

    
    static GetUVParamsByRNCN(rn: number, cn: number): number[][] {

        let dw: number = 1.0 / cn;
        let dh: number = 1.0 / rn;
        let trn: number = rn;
        let tcn: number = cn;
        let params: number[][] = [];
        for(let i: number = 0; i < rn; ++i) {
            for(let j: number = 0; j < cn; ++j) {
                params.push([j * dw, i * dh, dw, dh]);
            }
        }
        return params;
    }
}
export {UVTool};