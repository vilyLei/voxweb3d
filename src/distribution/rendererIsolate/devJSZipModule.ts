
import {InstantiationType, ModuleRuntimeType} from "./Configure";
var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}

var VoxCore = pwindow["VoxCore"];
import {JSZipModule} from "./JSZipModule";
VoxCore["JSZipModule"] = JSZipModule;
VoxCore["JSZipModule_param"] = {
    moduleName:"jsZipModule",
    moduleClassName:"JSZipModule",
    runtimeType:ModuleRuntimeType.SYSTEM_MODULE,
    instantiationType:InstantiationType.MULTIPLE
};
