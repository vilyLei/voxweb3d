import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Vector3D from "../../../vox/math/Vector3D";
import AABB from "../../../vox/geom/AABB";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class ShadowEntity {

    private static s_box: Box3DEntity = null;
    private static s_pos: Vector3D = new Vector3D();
    private static s_rotV: Vector3D = new Vector3D();
    private m_height: number = 0.0;
    private m_sizeScale: number = 0.7;

    srcEntity: IEntityTransform = null;
    entity: DisplayEntity = null;
    bounds: AABB = new AABB();
    constructor() {
    }

    initialize(): void {

        if(ShadowEntity.s_box == null) {
            ShadowEntity.s_box = new Box3DEntity();
            ShadowEntity.s_box.initializeCube(1.0);
        }
        let bounds = this.bounds;
        this.m_height = bounds.getHeight();
        let entity = new DisplayEntity();
        entity.copyMaterialFrom(ShadowEntity.s_box);
        entity.copyMeshFrom(ShadowEntity.s_box);
        entity.setScaleXYZ(bounds.getWidth() * this.m_sizeScale, this.m_height * 0.5, bounds.getLong() * this.m_sizeScale);
        entity.setXYZ(0.0, this.m_height + 20.0, 0.0);
        this.entity = entity;

    }
    setVisible(visible: boolean): void {
        this.entity.setVisible(visible);
    }
    setPosition(pv: Vector3D): void {
        //this.entity.setPosition( pv );
    }
    update(): void {
        
        if( this.srcEntity != null ) {
            let pv = ShadowEntity.s_pos;
            let rotV = ShadowEntity.s_rotV;
            this.srcEntity.getPosition( pv );
            this.srcEntity.getRotationXYZ( rotV );
            pv.y += this.m_height;
            
            this.entity.setPosition( pv );
            this.entity.setRotation3( rotV );
            this.entity.update();
        }
    }
}

export {ShadowEntity}