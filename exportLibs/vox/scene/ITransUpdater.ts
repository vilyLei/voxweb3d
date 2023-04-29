/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEntityUpdate from "./IEntityUpdate";

interface ITransUpdater {
    addItem(item: IEntityUpdate): void;
}

export default ITransUpdater;