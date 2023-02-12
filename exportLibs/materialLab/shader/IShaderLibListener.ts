interface IShaderLibListener {
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void;
}

export { IShaderLibListener }