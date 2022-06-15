import { ITaskReceiveData } from "../base/ITaskReceiveData";
interface CommonTaskListener<DataType, DescriptorType> {
  /**
   * @param data received data
   * @param flag thread operation status
   * @return the default value is true
   */
  threadTaskFinish(data: ITaskReceiveData<DataType, DescriptorType>, flag: number): boolean;
}

export { CommonTaskListener };
