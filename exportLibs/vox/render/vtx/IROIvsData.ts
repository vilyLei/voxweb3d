/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IROIvsData {

    bufStep: number
    status: number;
    wireframe: boolean;
    shape: boolean;
    ivs: Uint16Array | Uint32Array;
    version: number;
    
    destroy(): void;
}