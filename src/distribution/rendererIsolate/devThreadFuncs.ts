
import {InstantiationType, ModuleRuntimeType} from "./Configure";
var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}

var VoxCore = pwindow["VoxCore"];
import {ThreadFuncs} from "./ThreadFuncs";
VoxCore["threadFuncs"] = ThreadFuncs;
VoxCore["threadFuncs_param"] = {
    moduleName:"threadFuncs",
    moduleClassName:"threadFuncs",
    runtimeType:ModuleRuntimeType.SYSTEM_RUNNING, // 表示系统运行时自动执行, 如果取值为 default 则表示为 用户自定义执行
    instantiationType:InstantiationType.SINGLE
};
