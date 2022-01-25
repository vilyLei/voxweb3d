import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";
import LambertLightDecorator from "../../../vox/material/mcase/LambertLightDecorator";
import { VertUniformComp } from "../../../vox/material/component/VertUniformComp";
import { IAppLambert } from "../interfaces/IAppLambert";

class Instance implements IAppLambert {
    private m_rscene: IRendererScene = null;
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {
        this.m_rscene = rsecne;
    }

    createMaterial(vertUniformEnabled: boolean = true): IMaterial {

        let vertUniform: VertUniformComp = vertUniformEnabled ? new VertUniformComp() : null;
        let decor = new LambertLightDecorator();
        decor.vertUniform = vertUniform;
        return this.m_rscene.materialBlock.createMaterial( decor );
    }
    
    // createPBRMaterial(vertUniformEnabled: boolean = true): IMaterial {

    //     // let vertUniform: VertUniformComp = vertUniformEnabled ? new VertUniformComp() : null;
    //     // let decor = new PBRDecorator();
    //     // decor.vertUniform = vertUniform;
    //     // let m = new Material();
    //     // m.setDecorator(decor);
    //     return this.m_rscene.materialBlock.createMaterial( null );

    //     // return m;
    // }
}

export { Instance }
