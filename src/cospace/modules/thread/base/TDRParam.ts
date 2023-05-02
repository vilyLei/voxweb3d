/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TaskDataRouter } from "./TaskDataRouter";

/**
 * TaskDataRouter 参数对象
 */
class TDRParam {
  status: number = 0;
  taskclass: number;
  cmd: number;
  taskCmd: string;
  threadIndex: number;
  constructor(ptaskclass: number, pcmd: number, ptaskCmd: string, pthreadIndex: number) {
    this.taskclass = ptaskclass;
    this.cmd = pcmd;
    this.taskCmd = ptaskCmd;
    this.threadIndex = pthreadIndex;
  }
}
export { TDRParam };
