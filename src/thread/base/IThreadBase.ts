/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
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