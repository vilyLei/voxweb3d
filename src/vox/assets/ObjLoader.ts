
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ObjDataParser } from "./ObjDataParser";
import { MTLLoader } from "./MTLLoader.js";
import JSZip from "jszip";
/**
 * obj loader
 */
class ObjLoader {
  static readonly OBJ_DATA_PARSE_ERROR: number = 7001;
  private m_objName: string[] = null;
  private m_mtlName: string[] = null;
  private m_textureName: string[] = null;
  private m_textureData: any[] = [];
  private m_objData: any = null;
  private m_mtlData: any = null;
  constructor() {
  }
  load(zipUrl: string): Promise<any> {
    //let img:any = new Image();
    //img.src = "static/assets/default.jpg";
    //document.body.appendChild(img);
    this.m_objName = [];
    this.m_mtlName = [];
    this.m_textureName = [];
    let self: ObjLoader = this;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      //target.loadedBuffer(<ArrayBuffer>reader.result);
      console.log("reader.onload....", e.target.result);
      self.parse(e.target.result);
    };
    const request = new XMLHttpRequest();
    request.open("GET", zipUrl, true);
    request.responseType = "blob";
    request.onload = () => {
      if (request.status <= 206) {
        reader.readAsArrayBuffer(request.response);
      } else {
        console.log("loaded error request.status: ", request.status);
      }
    };
    request.onerror = e => {
      console.log("load error request.status: ", request.status);
    };
    request.send();
    //return new Promise((resolve, reject) => {
    //    let suffix:string = objZip.name.split(".").pop();
    //    console.log("objZip file name suffix: ",suffix);
    //}
    //);
    return null;
  }
  private parse(buffer: ArrayBuffer): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("parse buffer: ", buffer);
      let objZip: JSZip = new JSZip();
      objZip.loadAsync(buffer).then((file: any) => {
        //readName
        file.forEach((fileName: string) => {
          //let index:number = fileName.search("__MACOSX/");
          let suffix: string = fileName
            .split(".")
            .pop()
            .toLocaleLowerCase();
          console.log("suffix: ", suffix);
          switch (suffix) {
            case "obj":
              this.m_objName.push(fileName);
              break;
            case "mtl":
              this.m_mtlName.push(fileName);
              break;
            case "jpg":
            case "png":
            case "jpeg":
            case "bmp":
            case "tif":
              this.m_textureName.push(fileName);
              break;
          }
        });
        return file;
      }
      ).then((file: any) => {
        //readFiles
        const objname = this.m_objName;
        const mtlname = this.m_mtlName;
        const texturename = this.m_textureName;
        if (objname.length == 1 && mtlname.length == 1) {
          file //OBJ
            .file(objname[0])
            .async("string")
            .then((objdata: any) => {
              this.m_objData = objdata;
            })
            .then(() => {
              file //MTL
                .file(mtlname[0])
                .async("string")
                .then((mtldata: any) => {
                  this.m_mtlData = mtldata;
                })
                .then(() => {
                  //Texture
                  if (texturename[0] != "") {
                    this.parseTextureData(file, texturename).then(
                      pdata => {
                        resolve(pdata);
                      },
                      error => {
                        reject(error);
                      }
                    );
                  } else {
                    //  this._analyticOBJMTL(this.m_objData, this.m_mtlData).then(
                    //    sco => {
                    //      resolve(sco);
                    //    },
                    //    error => {
                    //      reject(error);
                    //    }
                    //  );
                  }
                });
            });
        } else if (objname.length == 1 && mtlname.length == 0) {
          console.log("XXXXXXXXXXXXXXXXXXXXXXXXX");
          /*
          file // only OBJ
            .file(objname[0])
            .async("string")
            .then(objdata => {
              this.m_objData = objdata;
            })
            .then(() => {
              this._analyticOBJMTL(this.m_objData, this.m_mtlData).then(
                sco => {
                  resolve(sco);
                },
                error => {
                  reject(error);
                }
              );
            });
            //*/
        } else if (objname.length > 1) {
          //reject(ErrorCode.Obj2scoMoreOBJ);
          //this._clear();
        } else if (mtlname.length > 1) {
          //reject(ErrorCode.Obj2scoMoreMTL);
          //this._clear();
        } else {
          //reject(ErrorCode.Obj2scoEmptyOBJ);
          //this._clear();
        }
      });
    });
  }

  private async parseTextureData(file: JSZip, texturename: string[]): Promise<any> {
    const allTextureData = [];

    function fileOrBlobToDataURL(obj: any, cb: any) {
      var a = new FileReader();
      a.readAsDataURL(obj);
      a.onload = (e: any) => {
        cb(e.target.result);
      };
    }
    // Blob to image
    function blobToImage(blob: any, cb: any) {
      fileOrBlobToDataURL(blob, (dataurl: any) => {
        // for a test
        //  let img:any = new Image();
        //  img.src = dataurl;
        //  img.onload = (result:any) =>
        //  {
        //    console.log("img size: ",img.width,img.height);
        //  }
        //  document.body.appendChild(img);
      });
    }
    for (let i = 0; i < texturename.length; i++) {
      //const textureData = file.file(texturename[i]).async("base64");
      const textureData = file.file(texturename[i]).async("blob");
      allTextureData.push(textureData);
    }
    await Promise.all(allTextureData).then(dataArray => {
      for (let i = 0; i < dataArray.length; i++) {
        console.log("dataArray[" + i + "]: ", dataArray[i]);
        this.m_textureData.push(dataArray[i]);

        blobToImage(dataArray[i], null);
      }
    });
    return await this.buildOBJData(this.m_objData, this.m_mtlData);
  }
  private async buildOBJData(objdata: string, mtldata?: string): Promise<any> {

    const objLoader = new ObjDataParser();
    let objects = objLoader.Parse(this.m_objData);
    console.log("objects,", objects);

    const mtlLoader = new MTLLoader();
    const materials = mtlLoader.parse(mtldata, null).materials;
    console.log("materials,", materials);
    return new Promise((resolve, reject) => {
    });
  }
}


export { ObjLoader };