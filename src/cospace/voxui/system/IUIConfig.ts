interface IFontFormat {
	font: string;
	size: number;
	bold: boolean;
	italic: boolean;
	fontColor: number[];
}
interface IUIConfig {
	initialize(configUrl: string, callback: () => void): void;
	destroy(): void;
	getUIModuleByName(moduleName: string): unknown | null;
}

export { IFontFormat, IUIConfig }
