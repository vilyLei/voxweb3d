/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 基本事件类

interface IEventBase {
    uuid: string;
    getClassType(): number;
    /**
     * the default value is 0
     */
    phase: number;
    // 事件类型
    type: number;
    // 事件发送者
    target: any;
    // 事件产生者, 例如容器发送了一个mouse down事件, 则容器是target而ray pick到的这个 entity就是currentTarget
    currentTarget: any;
    data: any;
    preventDefault(): void;
    reset(): void;
}
export default IEventBase;