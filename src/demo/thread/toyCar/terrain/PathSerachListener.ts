/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface PathSerachListener {
    getSearchPathData(): Uint16Array[];
    receiveSearchedPathData(streams: Uint16Array[]): void;
}
export { PathSerachListener };