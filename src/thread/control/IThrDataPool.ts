/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IThreadSendData } from "../../thread/base/IThreadSendData";
import IThreadBase from "../../thread/base/IThreadBase";

interface IThrDataPool {
    addData(thrData: IThreadSendData): void;
    getDataTotal(): number;
    isEnabled(): boolean;
    isStartup(): boolean;
}

export {IThrDataPool};