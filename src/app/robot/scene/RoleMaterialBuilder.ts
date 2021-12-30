import Vector3D from "../../../vox/math/Vector3D";
import TextureProxy from "../../../vox/texture/TextureProxy";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";

import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";
import LambertLightMaterial from "../../../vox/material/mcase/LambertLightMaterial";
import MaterialBase from "../../../vox/material/MaterialBase";

class RoleMaterialBuilder {

    constructor() { }

    private m_materialCtx: CommonMaterialContext;
    initialize(materialCtx: CommonMaterialContext): void {
        
        if (this.m_materialCtx == null) {
            this.m_materialCtx = materialCtx;
            
        }
    }
    
    createLambertMaterial(diffuseMap: TextureProxy, normalMap: TextureProxy = null, aoMap: TextureProxy = null): LambertLightMaterial {

        let trackMaterial = this.m_materialCtx.createLambertLightMaterial(false);
        trackMaterial.diffuseMap = diffuseMap;
        trackMaterial.normalMap = normalMap != null ? normalMap : this.m_materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
        trackMaterial.aoMap = aoMap != null ? aoMap : this.m_materialCtx.getTextureByUrl("static/assets/rock_a.jpg");
        trackMaterial.fogEnabled = false;
        trackMaterial.initializeByCodeBuf( true );
        trackMaterial.setBlendFactor(0.6, 0.7);

        return trackMaterial;
    }
    createMaterial(diffuseMap: TextureProxy, normalMap: TextureProxy = null, aoMap: TextureProxy = null): MaterialBase {
        return this.createLambertMaterial(diffuseMap, normalMap, aoMap);
    }
}
export { RoleMaterialBuilder };