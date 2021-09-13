

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
    runtimeType:"system_running", // 表示系统运行时自动执行, 如果取值为 default 则表示为 用户自定义执行
    instantiationType:"single" // 表示一个进程系统中只会有一个实例, 如果取值为 multiple 则表示可以有多个实例
};
