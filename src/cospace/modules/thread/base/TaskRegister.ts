import { ThreadCodeSrcType } from "../control/ThreadCodeSrcType";
import { TaskDescriptor } from "./TaskDescriptor";

class TaskRegister {
    private m_taskTotal: number = 0;
    private m_map: Map<string, number> = new Map();
    constructor() {
    }
    buildTaskInfo(des: TaskDescriptor): void {
        let keyuns = des.moduleName;
        switch(des.type) {
            case ThreadCodeSrcType.JS_FILE_CODE:
                keyuns = des.src;
                break;
            case ThreadCodeSrcType.DEPENDENCY:
                keyuns = des.src;
                break;
            default:
                break;
        }
        let i: number = -1;
        if(keyuns != "") {
            if(this.m_map.has(keyuns)) {
                i = this.m_map.get(keyuns);
            } else {
                i = this.m_taskTotal++;
                this.m_map.set(keyuns, i);
            }
        }else {
            console.error("keyuns's value is empty!!!");
        }
        console.log("keyuns: ", keyuns);
        des.taskclass = i;
        des.info =  {taskClass: i, keyuns: keyuns};
    }
}
export { TaskRegister };
