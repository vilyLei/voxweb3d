import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

export interface ICanvasTexObject {

    uvs: Float32Array;
    texture: IRenderTexture;
    rect: IAABB2D;
    clampUVRect: IAABB2D;
    uniqueName: string;
    getWidth(): number;
    getHeight(): number;
    destroy(): void;
}
export default ICanvasTexObject;
