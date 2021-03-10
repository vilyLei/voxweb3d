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
            getUid():number;
            /**
             * @returns return renderer context unique id
             */
            getRCUid():number;
            /**
             * @returns return a renderer process index of the renderer
             */
            getRPIndex():number;
            getUnitsTotal():number;
            getEnabled():boolean;
            getSortEnabled():boolean;
            /**
             * execute rendering
             */
            run():void;
        }
    }
}