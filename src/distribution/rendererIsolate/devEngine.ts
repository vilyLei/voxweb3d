var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];
import {Vox3DEngine} from "./Vox3DEngine";
VoxCore["vox3DEngine"] = Vox3DEngine;
pwindow["VoxCore"] = VoxCore;
