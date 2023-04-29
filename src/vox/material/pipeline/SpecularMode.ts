/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface ISpecularMode {

}
enum SpecularMode {
    /**
     * 使用设置的纯色 rgb 作为镜面光的颜色系数
     */
    Default = 1,
    /**
     * 使用 之前计算出来的 片段 color rgb 作为镜面光的颜色系数
     */
    FragColor = 2,
    /**
     * 使用 SpecularMap color rgb 作为镜面光的颜色系数
     */
    SpecularMapColor = 3
}
export { SpecularMode };