interface IUIButtonColor {
	// uint8 rgb color values, exmple: [170, 50, 30]
	out: number[];
	// uint8 rgb color values, exmple: [170, 50, 30]
	over: number[];
	// uint8 rgb color values, exmple: [170, 50, 30]
	down: number[];
	// uint8 rgb color values, exmple: [170, 50, 30]
	up: number[];
}
interface IUIButtonColorSet {
	/**
	 * button common color list
	 */
	common: IUIButtonColor;
	/**
	 * button selected color list
	 */
	selected: IUIButtonColor;
	/**
	 * button light color list
	 */
	light: IUIButtonColor;
}
interface IUIGlobalColor {
	/**
	 * uint8 rgb color values, exmple: [170, 50, 30]
	 */
	text: number[];
	/**
	 * uint8 rgb color values, exmple: [170, 50, 30]
	 */
	background: number[];
	/**
	 * uint8 rgb color values, exmple: [170, 50, 30]
	 */
	foreground: number[];
	/**
	 * uint8 rgb color values, exmple: [170, 50, 30]
	 */
	dark: number[];
	/**
	 * button color set
	 */
	button: IUIButtonColorSet;
}

export { IUIButtonColor, IUIButtonColorSet, IUIGlobalColor }
