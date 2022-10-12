
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IButton } from "./IButton";

interface IFlagButton extends IButton {

	initializeWithSize(atlas: ICanvasTexAtlas, pw?: number, ph?: number, borderWidth?: number, dis?: number): IFlagButton;
	/**
	 * @param flag true or false
	 * @param sendEvent the default value is false
	 */
	setFlag(flag: boolean, sendEvent?: boolean): void;
	getFlag(): boolean;
}
export { IFlagButton };
