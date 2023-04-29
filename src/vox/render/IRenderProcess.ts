/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRODisplaySorter from "../../vox/render/IRODisplaySorter";

/**
 * renderer rendering process class
 */
export default interface IRenderProcess {
	getUid(): number;
	/**
	 * @returns return renderer context unique id
	 */
	getRCUid(): number;
	/**
	 * @returns return a renderer process index of the renderer
	 */
	getRPIndex(): number;
	getUnitsTotal(): number;
	// getEnabled(): boolean;
	hasSorter(): boolean;
	setSorter(sorter: IRODisplaySorter): void;
	setSortEnabled(sortEnabled: boolean): void;
	getSortEnabled(): boolean;
	getStatus(): number;
	setEnabled(enabled: boolean): void;
	isEnabled(): boolean;
	/**
	 * update rendering status
	 */
	update(): void;
	/**
	 * execute rendering
	 */
	run(): void;
}
