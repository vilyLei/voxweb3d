
interface CoRendererDevice {
	readonly GPU_VENDOR: string;
	readonly GPU_RENDERER: string;
	MAX_TEXTURE_SIZE: number;
	MAX_RENDERBUFFER_SIZE: number;
	MAX_VIEWPORT_WIDTH: number;
	MAX_VIEWPORT_HEIGHT: number;
	SHOWLOG_ENABLED: boolean;
	SHADERCODE_TRACE_ENABLED: boolean;
	// true: force vertex shader precision to highp
	VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED: boolean;
	// true: force fragment shader precision to highp
	FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED: boolean;
	SetWebBodyColor(rbgColorString?: string): void;
	IsMobileWeb(): boolean;
	IsWinExternalVideoCard(): boolean;
	IsWebGL1(): boolean;
	IsWebGL2(): boolean;
	IsMobileWeb(): boolean;
	IsSafariWeb(): boolean;
	IsIOS(): boolean;
	IsIpadOS(): boolean;
	IsAndroidOS(): boolean;
	SetLanguage(language: string): void;
    GetLanguage(): string;
}
export { CoRendererDevice };
