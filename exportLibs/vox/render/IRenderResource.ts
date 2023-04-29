/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * the renderer runtime resource management implements
 */
export interface IRenderResource {
    
    createResByParams3(resUid: number, param0: number, param1: number, param2: number): boolean;
    /**
     * @returns return system gpu context
     */
    getRC(): any;
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    /**
     * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
     * @param resUid renderer runtime resource unique id
     * @returns has or has not resource by unique id
     */
    hasResUid(resUid: number): boolean;
    /**
     * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
     * @param resUid renderer runtime resource unique id
     */
    bindToGpu(resUid: number): void;

    /**
     * get system gpu context resource buf
     * @param resUid renderer runtime resource unique id
     * @returns system gpu context resource buf
     */
    getGpuBuffer(resUid: number): any;
    /**
     * frame begin run this function
     */
    renderBegin(): void;
    /**
     * frame update
     */
    update(): void;
}
export default IRenderResource;