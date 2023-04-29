/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderResource from '../../vox/render/IRenderResource';

/**
 * the renderer runtime texture resource management implements
 */
export interface IRenderTexResource extends IRenderResource
{
    /**
     * unlocked value will determine whether to lock
     */
    unlocked:boolean;
    /**
     * @returns get renderer runtime texture rexource total number
     */
    getTextureResTotal():number;
    /**
     * @returns get renderer runtime texture rexource reference total number
     */
    getAttachTotal():number;
}
export default IRenderTexResource;