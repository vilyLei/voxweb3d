
import IRPODisplay from "../../vox/render/IRPODisplay";
import IRenderProxy from "./IRenderProxy";
import IRenderShader from "./IRenderShader";
import IRenderEntity from "./IRenderEntity";
export default interface IRPOUnit extends IRPODisplay {
    
    renderState: number;
    rcolorMask: number;

    shader: IRenderShader;
    rentity: IRenderEntity;
    /**
     * @param force the default value is false
     */
    applyShader(force?: boolean): void;
    copyMaterialFrom(unit: IRPOUnit): void;
    run2(rc: IRenderProxy): void;
    draw(rc: IRenderProxy): void;
}
