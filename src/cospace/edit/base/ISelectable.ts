/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEntityTransform from "../../../vox/entity/IEntityTransform";
/**
 * selectable entity behavior normalization
 */
interface ISelectable extends IEntityTransform {
    uuid: string;
    isSelected(): boolean;
    select(): void;
    deselect(): void;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
}
export { ISelectable };