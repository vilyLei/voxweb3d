
import { IThreadSendData } from "../../thread/base/IThreadSendData";

interface IThrDataPool {
    addData(thrData: IThreadSendData): void;
    getDataTotal(): number;
    isEnabled(): boolean;
    isStartup(): boolean;
}

export {IThrDataPool};