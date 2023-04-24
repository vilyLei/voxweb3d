import { IClipLabel } from "./entity/IClipLabel";
import { IClipColorLabel } from "./entity/IClipColorLabel";
import { IColorClipLabel } from "./entity/IColorClipLabel";
import { ITextLabel } from "./entity/ITextLabel";
import { IColorLabel } from "./entity/IColorLabel";
import { IButton } from "./button/IButton";
import { IFlagButton } from "./button/IFlagButton";
import { ISelectButtonGroup } from "./button/ISelectButtonGroup";
import { ICoUIScene } from "./scene/ICoUIScene";
import { IRectTextTip } from "./entity/IRectTextTip";
import { ITipInfo } from "./base/ITipInfo";
import { IUILayout } from "./layout/IUILayout";
import { IUIPanel } from "./panel/IUIPanel";
import { IPromptPanel } from "./panel/IPromptPanel";
import ICanvasTexAtlas from "../voxtexture/atlas/ICanvasTexAtlas";
import IColor4 from "../../vox/material/IColor4";
import { IUIConfig } from "./system/IUIConfig";
import IRendererScene from "../../vox/scene/IRendererScene";
import { IUIEntityContainer } from "./entity/IUIEntityContainer";

interface ITextParam {

	text: string;
	textColor: IColor4;
	fontSize: number;
	font: string;
}
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
	createSelectButtonGroup(): ISelectButtonGroup;
	createTextButton(width: number, height: number, idns: string, texAtlas: ICanvasTexAtlas, textParam: ITextParam, colors: IColor4[]): IButton;

	creatUIEntityContainer(): IUIEntityContainer;
	createUIPanel(): IUIPanel;
	createPromptPanel(): IPromptPanel;
	/**
	 * @param uiConfig IUIConfig instance, its default value is null
	 * @param crscene IRendererScene instance, its default value is null
	 * @param atlasSize the default value is 512
	 * @param renderProcessesTotal the default value is 3
	 */
	createUIScene(uiConfig?: IUIConfig, crscene?: IRendererScene, atlasSize?: number, renderProcessesTotal?: number): ICoUIScene;
}
export { ITextParam, ICoUI };
