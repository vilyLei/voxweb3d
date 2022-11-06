interface IFontFormat {
	font: string;
	size: number;
	bold: boolean;
	italic: boolean;
}
interface IUIConfig {
	initialize(callback: () => void): void;
	destroy(): void;
}

export { IFontFormat, IUIConfig }
