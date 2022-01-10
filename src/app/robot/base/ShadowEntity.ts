import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Vector3D from "../../../vox/math/Vector3D";
import AABB from "../../../vox/geom/AABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { RenderModule } from "../scene/RenderModule";
import AssetsModule from "../assets/AssetsModule";

class ShadowEntity {

    private static s_pos: Vector3D = new Vector3D();
    private static s_rotV: Vector3D = new Vector3D();
    private m_height: number = 0.0;
    sizeScaleX: number = 0.7;
    sizeScaleZ: number = 0.7;

    srcEntity: IEntityTransform = null;
    entity: DisplayEntity = null;
    bounds: AABB = new AABB();

    type: number = 0;
    constructor() {
    }

    initialize(): void {

        let bounds = this.bounds;
        this.m_height = bounds.getHeight();
        let entity = new DisplayEntity();
        let srcShdEntity = entity;
        if(this.type == 1) {
            srcShdEntity = AssetsModule.GetInstance().unitBox;
        }
        else {
            srcShdEntity = AssetsModule.GetInstance().unitSphere;
        }
        entity.copyMaterialFrom( srcShdEntity );
        entity.copyMeshFrom( srcShdEntity );
        entity.setScaleXYZ(bounds.getWidth() * this.sizeScaleX, this.m_height * 0.5, bounds.getLong() * this.sizeScaleZ);
        entity.setXYZ(0.0, this.m_height, 0.0);
        this.entity = entity;
        RenderModule.GetInstance().addShadowEntity(entity);

    }
    setVisible(visible: boolean): void {
        this.entity.setVisible(visible);
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