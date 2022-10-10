
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IButton } from "./IButton";

interface IFlagButton extends IButton {

	initializeWithSize(atlas: ICanvasTexAtlas, pw?: number, ph?: number, borderWidth?: number, dis?: number): IButton;

}
export { IFlagButton };
