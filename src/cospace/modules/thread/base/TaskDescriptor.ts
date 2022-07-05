import { ThreadCodeSrcType } from "../control/ThreadCodeSrcType";
type TaskInfo = {taskClass:number, keyuns: string};
class TaskDescriptor {
    inited: boolean;
    /**
     * 此变量的值可能为: url 或 dependency unique name 或 string code
     */
    src: string;
    type: ThreadCodeSrcType;

    info: TaskInfo = null;
    /**
     * 线程中处理代码的入口类名
     */
    moduleName: string;
    constructor(type: ThreadCodeSrcType, src: string, moduleName: string) {
        this.inited = false;
        this.type = type;
        this.src = src;
        this.moduleName = moduleName;
    }
}
export { TaskInfo, TaskDescriptor };
