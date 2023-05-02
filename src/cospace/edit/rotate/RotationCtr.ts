/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {UserEditCtr} from "../base/UserEditCtr";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;


/**
 * 旋转编辑控制
 */
class RotationCtr extends UserEditCtr {
    private static s_list: RotationCtr[] = [];

    outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    pickTestRadius = 20;
    constructor(){
        super();
        this.m_ctrList = RotationCtr.s_list;
        this.m_ctrList.push(this);
    }    
}

export { RotationCtr }