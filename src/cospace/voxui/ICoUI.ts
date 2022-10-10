import { IClipLabel } from "./entity/IClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";
import { IColorClipLabel } from "./entity/IColorClipLabel";
import { ITextLabel } from "./entity/ITextLabel";
import { IColorLabel } from "./entity/IColorLabel";
import { IButton } from "./button/IButton";
import { IFlagButton } from "./button/IFlagButton";
import { ICoUIScene } from "./scene/ICoUIScene";
import { IRectTextTip } from "./entity/IRectTextTip";
import { ITipInfo } from "./base/ITipInfo";
import { IUILayout } from "./layout/IUILayout";
import { IPromptPanel } from "./panel/IPromptPanel";

interface ICoUI {
	createColorLabel(): IColorLabel;
	createUILayout(): IUILayout;
	createTipInfo(): ITipInfo;
	createRectTextTip(): IRectTextTip;
	createRectTextTip(): IRectTextTip;
	createClipLabel(): IClipLabel;
	createClipColorLabel(): IClipColorLabel;
	createColorClipLabel(): IColorClipLabel;
	createTextLabel(): ITextLabel;
	
	createButton(): IButton;
	createFlagButton(): IFlagButton;
	createPromptPanel(): IPromptPanel;

	createUIScene(): ICoUIScene;
}
export { ICoUI };
