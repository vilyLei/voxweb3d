/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRayControl } from "../base/IRayControl";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IVector3D from "../../../vox/math/IVector3D";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;


/**
 * 旋转编辑控制
 */
class RotationCtr {
    private static s_list: RotationCtr[] = [];

    uuid = "RotationCircle";
    moveSelfEnabled = true;
    outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    pickTestRadius = 20;
    constructor(){        
        RotationCtr.s_list.push(this);
    }
    // run(camera: IRenderCamera, rtv: IVector3D): void;
    isSelected(): boolean {
        return false;
    }
    select(): void {

    }
    deselect(): void {

    }
    setVisible(visible: boolean): void {

    }
    getVisible(): boolean {
        return false;
    }
    /**
     * 设置所有旋转控制器对象可见性
     * @param v true 表示可见, false表示隐藏
     */
    protected setAllVisible(v: boolean): void {
        let ls = RotationCtr.s_list;
        for (let i = 0; i < ls.length; ++i) {
            ls[i].setVisible(v);
        }
    }
    /**
     * 仅仅隐藏自身， 或者仅仅显示自身
     * @param v v true 表示仅自身可见其他不可见, false表示仅自身隐藏其他可见
     */
    protected setThisVisible(v: boolean): void {
        let ls = RotationCtr.s_list;
        if(v) {
            for (let i = 0; i < ls.length; ++i) {
                ls[i].setVisible(ls[i] == this);
            }
        }else {
            for (let i = 0; i < ls.length; ++i) {
                ls[i].setVisible(ls[i] != this);
            }
        }
    }
}

export { RotationCtr }