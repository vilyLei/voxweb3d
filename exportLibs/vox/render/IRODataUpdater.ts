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
         * the renderer runtime texture resource management implements
         */
        export interface IRODataUpdater
        {
            /**
             * @returns return system gpu context
             */
            getRC():any;
            /**
             * @returns return renderer context unique id
             */
            getRCUid():number;
            /**
             * check whether the renderer runtime resource(by renderer runtime resource unique id) exists in the current renderer context
             * @param resUid renderer runtime resource unique id
             * @returns has or has not resource by unique id
             */
            hasResUid(resUid:number):boolean;
            /**
             * bind the renderer runtime resource(by renderer runtime resource unique id) to the current renderer context
             * @param resUid renderer runtime resource unique id
             */
            bindToGpu(resUid:number):void;
            updateToGpu(resUid:number):void;
        }
    }
}