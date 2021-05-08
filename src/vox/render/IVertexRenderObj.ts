/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IVertexRenderObj
{
    /**
     * indices buffer object.
     */
    ibuf:any;
    /**
     * be used by the renderer runtime, the value is 2 or 4.
     */
    ibufStep:number;
    getMid():number;
    getVtxUid():number;
    run():void;
    restoreThis():void;
    __$attachThis():void;
    __$detachThis():void;
}
export default IVertexRenderObj;