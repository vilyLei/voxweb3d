import IRenderEntity from "../../../vox/render/IRenderEntity";
/**
 * renderable space transforming history recorder
 */
interface IDataRecorde {
	/**
	 * Ctrl + Z
	 */
	undo(): void;
	/**
	 * Ctrl + Y
	 */
	redo(): void;
}

export { IDataRecorde }
