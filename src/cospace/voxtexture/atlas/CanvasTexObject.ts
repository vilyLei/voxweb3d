
import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

export class CanvasTexObject {

    constructor() { }

    uvs: Float32Array = null;
    texture: IRenderTexture = null;
    rect: IAABB2D = null;
    clampUVRect: IAABB2D = null;
    uniqueName: string = "";
    getWidth(): number {
        if (this.rect != null) return this.rect.width;
        return 0;
    }
    getHeight(): number {
        if (this.rect != null) return this.rect.height;
        return 0;
    }
    destroy(): void {
        this.uvs = null;
        this.texture = null;
        this.rect = null;
    }
}
export default CanvasTexObject;
