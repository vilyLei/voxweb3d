

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];
import {BaseRenderer} from "./BaseRenderer";
VoxCore["baseRenderer"] = BaseRenderer;
pwindow["VoxCore"] = VoxCore;
