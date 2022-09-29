import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import { ICoUIScene } from "./ICoUIScene";

interface IUISceneEntity {
	__$setScene(sc: ICoUIScene): void;
	getScene(): ICoUIScene;
	
	setVisible(v: boolean): void;
	isVisible(): boolean;
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntities(): ITransformEntity[];
	/**
	 * get renderable entity container for renderer scene
	 * @returns IDisplayEntityContainer instance
	 */
	getRContainer(): IDisplayEntityContainer;
	update(): void;
	destroy(): void;
}
export { IUISceneEntity };
