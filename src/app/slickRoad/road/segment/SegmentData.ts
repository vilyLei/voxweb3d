import { Pos3D } from "../../base/Pos3D";
import TextureProxy from "../../../../vox/texture/TextureProxy";

class SegmentData {

    posTable: Pos3D[][] = null;
    texturePath: string = "";
    uScale: number = 1.0;
    vScale: number = 1.0;
    uvType: number = 0;
    constructor() {
    }
    reset(): void {
        this.posTable = null;
    }
}

export { SegmentData };