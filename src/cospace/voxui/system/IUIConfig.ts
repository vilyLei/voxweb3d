interface IFontFormat {
	font: string;
	size: number;
	bold: boolean;
	italic: boolean;
}
interface IUIConfig {
	initialize(configUrl: string, callback: () => void): void;
	destroy(): void;
}

export { IFontFormat, IUIConfig }
