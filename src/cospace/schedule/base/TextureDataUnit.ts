import { DataFormat, DataUnitLock, DataClass, DataUnit } from "./DataUnit";

type HTMLImg = HTMLImageElement | HTMLCanvasElement;

class TextureDataContainer {

  dataClass: DataClass;
  dataType: string;
  dataFormat: DataFormat = DataFormat.Png;
  images: HTMLImg[] = null;
  imageDatas: Uint8Array[] = null;
  constructor() {
  }
  setFormatBUrl(url: string): void {
  }
}
class TextureDataUnit extends DataUnit {

  data: TextureDataContainer = null;
  constructor() {
    super();
    this.dataClass = DataClass.Texture;
  }
}

export { DataFormat, TextureDataContainer, DataUnitLock, TextureDataUnit, DataUnit };
