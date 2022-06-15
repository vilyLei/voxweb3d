import { StreamType } from "../base/ITaskReceiveData";
import { CommonTaskListener } from "./CommonTaskListener";


/**
 * 通用多线程任务
 */
interface ICommonTask<DataType, DescriptorType> {
  
  setListener(l: CommonTaskListener<DataType, DescriptorType>): void;
  addTaskData(taskCmd: string, streams: StreamType[], descriptor: DescriptorType, threadBindingData: boolean): void;
  getTaskClass(): number;
  destroy(): void;
}

export { ICommonTask };
