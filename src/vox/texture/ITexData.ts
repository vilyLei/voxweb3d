/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface ITexData {
    /**
     * 值为0表示 更新纹理数据而不会重新开辟空间, 值为0表示需要重新开辟空间并更新纹理数据, 值为-1表示不需要更新
     */
    status: number;
    updateToGpu(gl: any, samplerTarget: number, interType: number, format: number, type: number, force: boolean): void
}