import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IRayControl } from "./IRayControl";

interface IUserEditController extends IRayControl {

    runningVisible: boolean;
    uuid: string;
    
    /**
     * initialize the DragMoveController instance.
     * @param editRendererScene a IRendererScene instance.
     * @param processid this destination renderer process id in the editRendererScene, its default value is 0
     */
    initialize(rc: IRendererScene, processid?: number): void;

    setTarget(target: IEntityTransform): void;
    getTarget(): IEntityTransform;
   
    run(): void;
    isSelected(): boolean;
    select(): void;
    deselect(): void;
    setVisible(visible: boolean): void;
    getVisible(): boolean;

}

export { IUserEditController };