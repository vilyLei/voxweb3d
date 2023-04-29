/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface ILoaderListerner {
    loaded(buffer: ArrayBuffer, uuid: string): void;
    loadError(status: number, uuid: string): void;
}