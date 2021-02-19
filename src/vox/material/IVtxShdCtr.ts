
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace material
    {
        export interface IVtxShdCtr
        {
            getLayoutBit():number;
            getLocationsTotal():number;
            getLocationTypeByIndex(index:number):number;
            getLocationSizeByIndex(index:number):number;
            
            testVertexAttribPointerType(attribType:number):boolean;
            vertexAttribPointerTypeFloat(attribType:number, stride:number, offset:number):void;
            getVertexAttribByTpye(attribType:number):number;

        }
    }
}
