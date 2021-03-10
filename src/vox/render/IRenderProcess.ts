/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRODisplaySorterT from '../../vox/render/IRODisplaySorter';

import IRODisplaySorter = IRODisplaySorterT.vox.render.IRODisplaySorter;

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
            hasSorter():boolean;
            setSorter(sorter:IRODisplaySorter):void;
            setSortEnabled(sortEnabled:boolean):void;
            getSortEnabled():boolean;
            /**
             * update rendering status
             */
            update():void;
            /**
             * execute rendering
             */
            run():void;
        }
    }
}