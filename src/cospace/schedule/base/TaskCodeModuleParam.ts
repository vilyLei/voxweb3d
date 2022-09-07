
import { ModuleFileType } from "../../modules/base/ModuleFileType";
import { ITaskCodeModuleParam } from "./ITaskCodeModuleParam";
class TaskCodeModuleParam implements ITaskCodeModuleParam {
    /**
     * task module js file url
     */
    url: string;
    /**
     * task module name
     */
    name: string;
    /**
     * file data type(js text, binary data)
     */
    type: ModuleFileType;
    params?: (string | number)[];
    constructor(url: string, name: string, type: ModuleFileType = ModuleFileType.JS){
        this.url = url;
        this.name = name;
        this.type = type;
    }

}

export { TaskCodeModuleParam };
