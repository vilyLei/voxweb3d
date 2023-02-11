import SelectionBar from "../../../orthoui/button/SelectionBar";
import ProgressBar from "../../../orthoui/button/ProgressBar";
import Color4 from "../../../vox/material/Color4";
import Vector3D from "../../../vox/math/Vector3D";
import { CtrlInfo, ItemCallback, CtrlItemParam } from "./CtrlItemParam";

class CtrlItemObj {
    constructor() { }
    type = "";
    uuid = "";
    btn: SelectionBar | ProgressBar = null;
    param: CtrlItemParam = null;
    color = [1.0, 1.0, 1.0];
    colorId = -1;
    info: CtrlInfo = null;
    
    setValueToParam(value: number): void {
        let param = this.param;
        if (param.type == "progress") {
            param.progress = value;
        } else {
            param.value = value;
        }
    }
    /**
     * 将颜色值由ui发送到外面
     */
    sendColorOut(color: Color4): void {
        let param = this.param;
        let vs = this.color;
        color.toArray3(vs);
        if (param.callback != null) {
            let f = param.type == "progress" ? param.progress : param.value;
            // console.log("sendColorOut f: ", f);
            let cvs = vs.slice();
            cvs[0] *= f; cvs[1] *= f; cvs[2] *= f;
            this.info = { type: param.type, uuid: this.uuid, values: cvs, flag: true, colorPick: true };
            param.callback(this.info);
        }
    }
    /**
     * 将数值由ui发送到外面
     */
    sendValueOut(value: number): void {
        let param = this.param;
        let fp = param.type == "progress";
        let f = fp ? param.progress : param.value;
        if (param.callback != null && Math.abs(f - value) > 0.00001) {
            if (fp) {
                param.progress = value;
            } else {
                param.value = value;
            }
            if (param.colorPick) {
                let cvs = this.color.slice();
                cvs[0] *= value; cvs[1] *= value; cvs[2] *= value;
                this.info = { type: param.type, uuid: this.uuid, values: cvs, flag: true, colorPick: true };
            } else {
                this.info = { type: param.type, uuid: this.uuid, values: [value], flag: true };
            }
            param.callback(this.info);
        }
    }
    /**
     * 将(用户已经修改的)参数同步到ui
     */
    updateparamToBtn(): void {

        let param = this.param;
        let t = param;
        // let visibleAlways = t.visibleAlways ? t.visibleAlways : false;
        t.colorPick = t.colorPick ? t.colorPick : false;

        switch (param.type) {
            case "number_value":
            case "number":

                t.value = t.value ? t.value : 0.0;
                t.minValue = t.minValue ? t.minValue : 0.0;
                t.maxValue = t.maxValue ? t.maxValue : 10.0;
                const b0 = this.btn as ProgressBar;
                b0.minValue = t.minValue;
                b0.maxValue = t.maxValue;
                b0.setValue(t.value, false);

                break;
            case "progress":

                t.progress = t.progress ? t.progress : 0.0;
                const b1 = this.btn as ProgressBar;
                b1.setProgress(t.progress, false);

                break;
            case "status":
            case "status_select":

                t.flag = t.flag ? t.flag : false;
                const b2 = this.btn as SelectionBar;
                if (t.flag) {
                    b2.select(false);
                }
                else {
                    b2.deselect(false);
                }
                break;
            default:
                break;
        }
    }
}
export { CtrlInfo, ItemCallback, CtrlItemParam, CtrlItemObj }