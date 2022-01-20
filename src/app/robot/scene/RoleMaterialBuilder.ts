import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";
import LambertLightMaterial from "../../../vox/material/mcase/LambertLightMaterial";
import MaterialBase from "../../../vox/material/MaterialBase";
import BoxGroupTrack from "../../../voxanimate/primitive/BoxGroupTrack";
import { VertUniformComp } from "../../../vox/material/component/VertUniformComp";

class RoleMaterialBuilder {

    constructor() { }

    private m_materialCtx: CommonMaterialContext;
    fogEnabled: boolean = false;
    envAmbientLightEnabled: boolean = false;

    initialize(materialCtx: CommonMaterialContext): void {
        
        if (this.m_materialCtx == null) {
            this.m_materialCtx = materialCtx;
            
        }
    }
    
    createTrackLambertMaterial(boxTrack: BoxGroupTrack, diffuseMap: IRenderTexture,  normalMap: IRenderTexture = null, aoMap: IRenderTexture = null): LambertLightMaterial {
        
        let dataTex = boxTrack.animator.getPosDataTexture();
        let posTotal = boxTrack.animator.getPosTotal();
        let material = this.m_materialCtx.createLambertLightMaterial(true);
        material.fogEnabled = this.fogEnabled;
        material.envAmbientLightEnabled = this.envAmbientLightEnabled;
        material.diffuseMap = diffuseMap;
        material.normalMap = normalMap != null ? normalMap : this.m_materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
        material.aoMap = aoMap != null ? aoMap : this.m_materialCtx.getTextureByUrl("static/assets/rock_a.jpg");
        let vertUniform = material.vertUniform as VertUniformComp;
        vertUniform.uvTransformEnabled = true;
        material.vertUniform = vertUniform;
        vertUniform.curveMoveMap = dataTex;
        material.initializeByCodeBuf( true );
        material.setBlendFactor(0.6, 0.7);
        vertUniform.setCurveMoveParam(dataTex.getWidth(), posTotal);
        vertUniform.setCurveMoveDistance(0.0);
        vertUniform.setUVScale(2.0,1.0);
        return material;
    }
    createLambertMaterial(diffuseMap: IRenderTexture, normalMap: IRenderTexture = null, aoMap: IRenderTexture = null): LambertLightMaterial {

        let material = this.m_materialCtx.createLambertLightMaterial(false);
        material.fogEnabled = this.fogEnabled;
        material.envAmbientLightEnabled = this.envAmbientLightEnabled;
        material.diffuseMap = diffuseMap;
        material.normalMap = normalMap != null ? normalMap : this.m_materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
        material.aoMap = aoMap != null ? aoMap : this.m_materialCtx.getTextureByUrl("static/assets/rock_a.jpg");
        material.initializeByCodeBuf( true );
        material.setBlendFactor(0.6, 0.7);

        return material;
    }
    createBaseLambertMaterial(diffuseMap: IRenderTexture, normalMap: IRenderTexture = null, aoMap: IRenderTexture = null, envAmbientLightEnabled: boolean = false): LambertLightMaterial {

        let material = this.m_materialCtx.createLambertLightMaterial(false);
        material.fogEnabled = this.fogEnabled;
        material.envAmbientLightEnabled = envAmbientLightEnabled;
        material.diffuseMap = diffuseMap;
        material.normalMap = normalMap;
        material.aoMap = aoMap;
        material.initializeByCodeBuf( true );
        material.setBlendFactor(0.6, 0.7);

        return material;
    }
    createMaterial(diffuseMap: IRenderTexture, normalMap: IRenderTexture = null, aoMap: IRenderTexture = null): LambertLightMaterial {
        return this.createLambertMaterial(diffuseMap, normalMap, aoMap);
    }
}
export { RoleMaterialBuilder };