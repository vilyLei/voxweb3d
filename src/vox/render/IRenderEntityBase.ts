/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../../vox/display/IROTransform";
import IAABB from "../../vox/geom/IAABB";
import IMatrix4 from "../math/IMatrix4";
/**
 * to be used in the renderer runtime
 */
export default interface IRenderEntityBase {

    uuid: string;
    /**
     * mouse interaction enabled, the default value is false
     */
    mouseEnabled: boolean;

    /**
     * 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
     * the default value is SpaceCullingMask.CAMERA
     */
    spaceCullMask: number;
	/**
	 * 是否需要渲染中动态(自定义)排序, 如果这个值为true，则会加入到一个process中的sorting block
	 */
	//rsorting

    /**
     * renderer scene entity flag, be used by the renderer system
     * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
     * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
     * 第27位存放是否在container里面
     * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
     * 第30位位存放是否渲染运行时排序
     */
    __$rseFlag: number;

    // /**
    //  * recorde a draw status, the default value is false
    //  */
    // drawEnabled: boolean;
	isRendering(): boolean;
	isInRenderer(): boolean;
	setRendering(rendering: boolean): void;


    /**
     * @return 返回true表示当前entity能被用于渲染
     */
    isDrawEnabled(): boolean;

    getGlobalBounds(): IAABB;
    getLocalBounds(): IAABB;

    /**
     * @returns value < 12 , the instance is a renderable entity instance, otherwise it is a DisplayEntityContainer instance
     */
    getREType(): number;
    getUid(): number;
    setVisible(boo: boolean): IRenderEntityBase;
    getVisible(): boolean;
    isVisible(): boolean;
    getTransform(): IROTransform;
    update(): void;
    destroy(): void;

    getInvMatrix(): IMatrix4;
    getMatrix(): IMatrix4;
	hasParent(): boolean;
}
