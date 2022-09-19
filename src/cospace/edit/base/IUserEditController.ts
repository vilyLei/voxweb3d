import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

interface IUserEditController extends IEntityTransform {

    runningVisible: boolean;
    uuid: string;
    
    /**
     * initialize the DragMoveController instance.
     * @param editRendererScene a IRendererScene instance.
     * @param processid this destination renderer process id in the editRendererScene, its default value is 0
     */
    initialize(rc: IRendererScene, processid?: number): void;
    
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    run(): void;
    isSelected(): boolean;
    select(targets: IEntityTransform[]): void;
    getTargets(): IEntityTransform[];
    deselect(): void;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    
    decontrol(): void;

}

export { IUserEditController };