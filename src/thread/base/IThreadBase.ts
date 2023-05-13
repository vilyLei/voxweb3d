/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IThreadSendData} from "../../thread/base/IThreadSendData";
interface IThreadBase
{
    sendDataTo(sendData:IThreadSendData):void;
    isFree():boolean;
}

export default IThreadBase;