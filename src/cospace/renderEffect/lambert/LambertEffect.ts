import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";
import LambertLightDecorator from "../../../vox/material/mcase/LambertLightDecorator";
import { VertUniformComp } from "../../../vox/material/component/VertUniformComp";
import { ILambertEffectInstance } from "./ILambertEffect";

class LambertEffectInstance implements ILambertEffectInstance {
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
}

function create(): ILambertEffectInstance {
    return new LambertEffectInstance();
}
export { LambertEffectInstance, create }
