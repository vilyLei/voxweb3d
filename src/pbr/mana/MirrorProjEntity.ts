/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../vox/entity/DisplayEntity"
import Vector3D from "../../vox/math/Vector3D";
import RendererState from "../../vox/render/RendererState";

export default class MirrorProjEntity {

    private m_pv: Vector3D = new Vector3D();
    private m_tempPosV: Vector3D = new Vector3D();
    private m_tempScaleV: Vector3D = new Vector3D();
    entity: DisplayEntity = null;
    mirrorPlane: DisplayEntity = null;
    constructor(){}

    toMirror(type: number = 0): void {
        
        if(type == 0) {

            this.mirrorPlane.getPosition(this.m_pv);
    
            this.entity.getPosition( this.m_tempPosV );
            this.entity.getScaleXYZ( this.m_tempScaleV );
            this.entity.setScaleXYZ(this.m_tempScaleV.x, -this.m_tempScaleV.y, this.m_tempScaleV.z);
            this.entity.update();
            
            let maxV: Vector3D = this.entity.getGlobalBounds().max;
            let dh: number = maxV.y - this.m_pv.y;
            
            this.entity.setXYZ(this.m_tempPosV.x, (this.m_tempPosV.y - dh - 0.1), this.m_tempPosV.z);
            this.entity.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
            this.entity.update();
        }
        else {
            this.entity.getScaleXYZ( this.m_tempScaleV );
            this.entity.setScaleXYZ(this.m_tempScaleV.x, -this.m_tempScaleV.y, this.m_tempScaleV.z);
            this.entity.update();
        }
    }
    toNormal(): void {
        
        this.entity.setRenderState(RendererState.BACK_CULLFACE_NORMAL_STATE);
        this.entity.setScaleXYZ(this.m_tempScaleV.x, this.m_tempScaleV.y, this.m_tempScaleV.z);
        this.entity.setPosition( this.m_tempPosV );
        this.entity.update();
    }
}