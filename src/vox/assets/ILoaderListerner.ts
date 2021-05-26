/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface ILoaderListerner {
    loaded(buffer: ArrayBuffer, uuid: string): void;
    loadError(status: number, uuid: string): void;
}