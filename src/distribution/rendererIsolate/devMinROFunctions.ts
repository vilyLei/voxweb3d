

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];
import {MinROFunctions} from "./MinROFunctions";
VoxCore["minROFunctions"] = MinROFunctions;
