

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];
import {ROFunctions} from "./ROFunctions";
VoxCore["roFunctions"] = ROFunctions;
