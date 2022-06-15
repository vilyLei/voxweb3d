import { DataFormat, DataUnitLock, DataClass, DataUnit } from "./DataUnit";
import { GeometryModelDataType } from "../../modules/base/GeometryModelDataType";

class TextureDataContainer {

  dataClass: DataClass;
  dataType: string;
  dataFormat: DataFormat = DataFormat.CTM;
  image: HTMLImageElement | HTMLCanvasElement = null;
  constructor() {
  }
  setFormatBUrl(url: string): void {
    if(url != "") {
      let k = url.lastIndexOf(".");
      
      if(k <= 0) {
        throw Error("illegal geometry data url: "+url);
      }
      switch(url.slice(k+1)) {
        case DataFormat.CTM:
          this.dataFormat = DataFormat.CTM;
          break;
        case DataFormat.Draco:
          this.dataFormat = DataFormat.Draco;
          break;
        default:
          throw Error("illegal geometry data url: "+url);
          break;
      }
    }
  }
}
class TextureDataUnit extends DataUnit {
  
  data: TextureDataContainer = null;
  constructor() {
    super();
    this.dataClass = DataClass.Geometry;
  }
  // // 模拟步机制试用
  // test(): void {
  //   this.m_timeoutId = setTimeout(this.update.bind(this), 1500);
  // }

  // private m_timeoutId: any = -1;
  // /**
  //  * 定时调度
  //  */
  // private update(): void {    
  //   if (this.m_timeoutId > -1) {
  //     clearTimeout(this.m_timeoutId);
  //   }
  //   console.log("TextureDataUnit::update();");
  //   this.toCpuPhase();
  // }
}

export { TextureDataContainer, DataUnitLock, TextureDataUnit, DataUnit };
