import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IBillboardBase } from "./IBillboardBase";

interface IBillboard extends IBillboardBase {

	initializeSquare(size: number, texList: IRenderTexture[]): void;
	initialize(bw: number, bh: number, texList: IRenderTexture[]): void;
}
export { IBillboard }