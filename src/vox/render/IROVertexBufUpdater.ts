/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as IRODisplayT from "../../vox/display/IRODisplay";
import * as IBufferBuilderT from '../../vox/render/IBufferBuilder';
import * as ROVertexResourceT from '../../vox/render/ROVertexResource';

import IRODisplay = IRODisplayT.vox.display.IRODisplay;
import IBufferBuilder = IBufferBuilderT.vox.render.IBufferBuilder;
import ROVertexResource = ROVertexResourceT.vox.render.ROVertexResource;

export namespace vox
{
    export namespace render
    {
        export interface IROVertexBufUpdater
        {
            /**
             * update texture system memory data to gpu memory data
             */
            updateDispVbuf(rc:IBufferBuilder,vtxRes:ROVertexResource,disp:IRODisplay):void
        }
    }
}