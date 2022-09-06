
import {IThreadSendData} from "../../thread/base/IThreadSendData";
import { TaskDataRouter } from "./TaskDataRouter";
interface IThreadBase
{
    getUid(): number;
    sendDataTo(sendData:IThreadSendData):void;
    sendRouterDataTo(router: TaskDataRouter): void;
    isFree():boolean;
    sendPoolDataToThread(): void;
    destroy(): void;
}

export { IThreadBase };