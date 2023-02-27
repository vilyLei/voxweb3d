/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

enum DisplayRenderSign {
    // 还没有加入 renderer
    NOT_IN_RENDERER = -1,
    // 正在进入 renderer
    GO_TO_RENDERER = 1,
    // 真正存在于 renderer, 也就是直接可以在 process 中使用了
    LIVE_IN_RENDERER = 2
}

export { DisplayRenderSign }