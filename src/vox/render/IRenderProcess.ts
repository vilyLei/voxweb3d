/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace render
    {
        /**
         * renderer rendering process class
         */
        export interface IRenderProcess
        {
            /**
             * @returns get renderer unique id 
             */
            getWUid():number;
            getWEid():number;
            getUnitsTotal():number;
            run():void;
            getEnabled():boolean;
        }
    }
}