export default interface ILoaderListerner {
    loaded(buffer: ArrayBuffer, uuid: string): void;
    loadError(status: number, uuid: string): void;
}