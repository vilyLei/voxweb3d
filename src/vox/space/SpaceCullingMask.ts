/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

enum SpaceCullingMask
{
    NONE,
    // 需要做摄像机的可见剔除
    CAMERA,
    // project occlusion volume
    POV,
    // 包含在遮挡体内部的不会进行遮挡剔除计算
    INNER_POV_PASS,
    // 摄像机和POV都要做遮挡剔除
    CAMERA_AND_POV
}
export default SpaceCullingMask;