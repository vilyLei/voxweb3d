import ITexArea from "./ITexArea";

export default interface ITextureAtlas {

    getUid(): number;
    getWidth(): number;
    getHeight(): number;
    setMinSize(minSize: number): void;

    getAreaByName(uniqueNS: string): ITexArea;

    getTexAreaByXY(px: number, py: number): ITexArea;
    addSubTexArea(uniqueNS: string, areaWidth: number, areaHeight: number): ITexArea;
}
