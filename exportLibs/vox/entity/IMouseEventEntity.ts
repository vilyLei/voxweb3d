/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITransformEntity from "../../vox/entity/ITransformEntity";
export default interface IMouseEventEntity extends ITransformEntity {

    uuid: string;
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
    setEvtDsipatchData(data: any): void;
}