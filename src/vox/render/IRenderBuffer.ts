/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderResource from "../../vox/render/IRenderResource";
interface IRenderBuffer
{
    /**
     * @returns 返回自己的 纹理资源 unique id, 这个id会被对应的资源管理器使用, 此方法子类可以依据需求覆盖
     */
    getResUid():number;
    __$updateToGpu(res:IRenderResource):void;
}
export default IRenderBuffer;