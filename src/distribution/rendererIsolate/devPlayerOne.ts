

var pwindow: any = window;
if(pwindow["VoxCore"] == undefined) {
    pwindow["VoxCore"] = {};
}
var VoxCore = pwindow["VoxCore"];
import {PlayerOne} from "./PlayerOne";
VoxCore["PlayerOne"] = PlayerOne;
