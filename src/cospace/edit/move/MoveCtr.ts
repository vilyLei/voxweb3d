/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {UserEditCtr} from "../base/UserEditCtr";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;


/**
 * 移动编辑控制
 */
class MoveCtr extends UserEditCtr {
    private static s_list: MoveCtr[] = [];

    protected m_editRS: IRendererScene = null;
    protected m_editRSPI: number = 0;
    outColor = CoMaterial.createColor4(0.9, 0.9, 0.9, 1.0);
    overColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
    pickTestRadius = 10;
    constructor(){
        super();
        this.m_ctrList = MoveCtr.s_list;
        this.m_ctrList.push(this);
    }
}

export { MoveCtr }