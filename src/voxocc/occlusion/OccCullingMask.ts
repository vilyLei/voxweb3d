/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace voxocc
{
    export namespace occlusion
    {
        export class OccCullingMask
        {
            static NONE:number = 0;
            // 需要做摄像机的可见剔除
            static CAMERA:number = 1;
            // project occlusion volume
            static POV:number = 2;
            // 包含在遮挡体内部的不会进行遮挡剔除计算
            static INNER_POV_PASS:number = 4;
            // 摄像机和POV都要做遮挡剔除
            static CAMERA_AND_POV:number = 3;
            
        }
    }
}