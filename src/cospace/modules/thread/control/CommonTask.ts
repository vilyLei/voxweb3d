/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import { StreamType, ITaskReceiveData } from "../base/ITaskReceiveData";
import { ThreadTask } from "./ThreadTask";
import { ThreadCodeSrcType } from "./ThreadCodeSrcType";
import { TaskUniqueNameDependency, TaskJSFileDependency } from "./TaskDependency";
import { CommonTaskListener } from "./CommonTaskListener";
import { ICommonTask } from "./ICommonTask";


/**
 * 通用多线程任务
 */
class CommonTask<DataType, DescriptorType> extends ThreadTask implements ICommonTask<DataType, DescriptorType> {

  private m_listener: CommonTaskListener<DataType, DescriptorType> = null;
  private m_taskClass: number = -1;
  /**
   * @param src 子线程中代码模块的js文件url 或者 依赖的唯一名称
   * @param taskClass 任务分类类型id
   */
  constructor(src: string, taskClass: number, stcType: ThreadCodeSrcType) {
    super();
    this.m_taskClass = taskClass;
    switch(stcType) {
      case ThreadCodeSrcType.JS_FILE_CODE:
        this.dependency = new TaskJSFileDependency(src);
        break;
        case ThreadCodeSrcType.DEPENDENCY:
          this.dependency = new TaskUniqueNameDependency(src);
          break;
      default:
        break;
    }
  }
  addTaskData(taskCmd: string, streams: StreamType[] = null, descriptor: DescriptorType = null, threadBindingData: boolean = false): void {
    this.addDataWithParam(taskCmd, streams, descriptor, threadBindingData);
  }
  setListener(l: CommonTaskListener<DataType, DescriptorType>): void {
    this.m_listener = l;
  }
  // return true, task finish; return false, task continue...
  parseDone(data: ITaskReceiveData<DataType, DescriptorType>, flag: number): boolean {
    
    if (this.m_listener != null) {
      return this.m_listener.threadTaskFinish(data, flag);
    }
    return true;
  }
  // 这个函数的返回值与子线程中的对应处理代码模块 getTaskClass() 函数返回值必须一致。不同类型的任务此返回值务必保持唯一性
  getTaskClass(): number {
    return this.m_taskClass;
  }
  destroy(): void {
    super.destroy();
    this.m_listener = null;
  }
}

export { CommonTask };
