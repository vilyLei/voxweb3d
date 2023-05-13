/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface PathSearchListener {
    
    buildSearchData(): void;
    getSearchPathData(): Uint16Array[];
    receiveSearchedPathData(streams: Uint16Array[]): void;
}
export { PathSearchListener };