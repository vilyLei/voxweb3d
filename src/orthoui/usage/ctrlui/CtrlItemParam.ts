import { CtrlInfo, ItemCallback } from "./CtrlInfo";
// ns: string, uuid: string, selectNS: string, deselectNS: string, flag: boolean, visibleAlways: boolean = false
// ns: string, uuid: string, progress: number, visibleAlways: boolean = false
// ns: string, uuid: string, value: number, minValue: number, maxValue: number, visibleAlways: boolean = false

interface CtrlItemParam {

    name: string;
    uuid: string;
    callback: ItemCallback;
    /**
     * 存放 颜色值等参数
     */
    values?: number[];
    /**
     * 取值说明: "number_value"(数值调节按钮),"progress"(百分比调节按钮),"status_select"(状态选择按钮)
     */
    type: string;
    /**
     * 是否需要动态拾取颜色
     */
    colorPick?: boolean;
    /**
     * 状态选择按钮选中的状态名
     */
    selectNS?: string;
    /**
     * 状态选择按钮取消选中的状态名
     */
    deselectNS?: string;
    /**
     * 状态选中按钮初始状态
     */
    flag?: boolean;
    /**
     * 是否总是显示
     */
    visibleAlways?: boolean;
    /**
     * 百分比按钮(取值于0.0 -> 1.0)初始值
     */
    progress?: number;
    /**
     * 数值调节按钮的初始值
     */
    value?: number;
    /**
     * 数值调节按钮的取值范围最小值
     */
    minValue?: number;
    /**
     * 数值调节按钮的取值范围最大值
     */
    maxValue?: number;
}
export { CtrlInfo, ItemCallback, CtrlItemParam }