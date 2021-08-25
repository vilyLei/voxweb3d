/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {TextureConst} from "../../vox/texture/TextureConst";
import BytesTextureProxy from "../../vox/texture/BytesTextureProxy";
import RenderProxy from "../../vox/render/RenderProxy";
import RendererDeviece from "../render/RendererDeviece";

class FontTexCharGrid
{
  constructor()
  {
  }
  width:number = 4;
  height:number = 4;
  x:number = 0;
  y:number = 0;
  uvs:Float32Array = new Float32Array(8);
  toString():string
  {
    return "FontTexCharGrid(x="+this.x+",y="+this.y+",width="+this.width+",height="+this.height+")";
  }
}
export class FontTexCharTable
{
  constructor()
  {
  }
  
  private m_texWidth:number = 512;
  private m_texHeight:number = 256;
  private m_gridMp:Map<string,FontTexCharGrid> = new Map();
  layoutDataStr:string = "";
  initialize(texW:number,texH:number):void
  {
    this.m_texWidth = texW;
    this.m_texHeight = texH;
  }
  private m_minX:number = 0;
  private m_minY:number = 0;
  private m_maxX:number = 0;
  private m_maxY:number = 0;
  // for example: chars = "ABC", layoutData = "0,0,13,22,14,0,13,22,28,0,13,22"
  addCharsByRawData(chars:string,layoutData:string):void
  {
    let i:number = 0;
    let k:number = 0;
    let arr = layoutData.split(",");
    let len = arr.length / 4;
    for(; i < len; ++i)
    {
      k = i * 4;
      this.addUV8RawDataFromChar(chars.charAt(i), parseInt(arr[k]),parseInt(arr[k+1]),parseInt(arr[k+2]),parseInt(arr[k+3]));
    }
  }
  addUV8RawDataFromChar(char:string,px:number,py:number,pw:number,ph:number):void
  {
    if(this.m_gridMp.get(char) == null)
    {
      //0.0,1.0,
      //1.0,1.0,
      //1.0,0.0,
      //0.0,0.0,
      let grid:FontTexCharGrid = new FontTexCharGrid();
      let uvs:Float32Array = grid.uvs;
      let ptw:number = this.m_texWidth;
      let pth:number = this.m_texHeight;
      this.m_minX = px/ptw;
      this.m_minY = py/pth;
      this.m_maxX = (px + pw)/ptw;
      this.m_maxY = (py + ph)/pth;
      uvs[0] = this.m_minX; uvs[1] = this.m_maxY;
      uvs[2] = this.m_maxX; uvs[3] = this.m_maxY;
      uvs[4] = this.m_maxX; uvs[5] = this.m_minY;
      uvs[6] = this.m_minX; uvs[7] = this.m_minY;
      //
      grid.x = px;
      grid.y = py;
      grid.width = pw;
      grid.height = ph;
      this.m_gridMp.set(char,grid);
    }
  }
  getGridByChar(char:string):FontTexCharGrid
  {
    return this.m_gridMp.get(char);
  }
  getUV8FromChar(char:string,outfloat8Arr:Float32Array,offset:number = 0):void
  {
    let grid:FontTexCharGrid = this.m_gridMp.get(char);
    if(grid == null)grid = this.m_gridMp.get("?");
    outfloat8Arr.set(grid.uvs,offset);
  }
  getVtxFromChar(char:string,vtxFloatArr:Float32Array,offset:number = 0):void
  {
    let grid:FontTexCharGrid = this.m_gridMp.get(char);
    if(grid == null)grid = this.m_gridMp.get("?");
    let pos_arr:number[] = [
      0,0,0,
      grid.width,0,0,
      grid.width,grid.height,0,
      0,grid.height,0
    ];
    vtxFloatArr.set(pos_arr,offset);
  }
  getUV8AndVtxFromChar(char:string,outFloatArr:Float32Array,vtxFloatArr:Float32Array,offsetuv:number = 0,offsetvtx:number = 0):void
  {
    let grid:FontTexCharGrid = this.m_gridMp.get(char);
    if(grid == null)grid = this.m_gridMp.get("?");
    outFloatArr.set(grid.uvs,offsetuv);
    //
    let pos_arr:number[] = [
      0,0,0,
      grid.width,0,0,
      grid.width,grid.height,0,
      0,grid.height,0
    ];
    vtxFloatArr.set(pos_arr,offsetvtx);
  }
  
  getUV8AndSizeFromChar(char:string,outFloatArr:Float32Array,sizeArr:number[],offsetuv:number = 0):void
  {
    let grid:FontTexCharGrid = this.m_gridMp.get(char);
    if(grid == null)grid = this.m_gridMp.get("?");
    outFloatArr.set(grid.uvs,offsetuv);
    sizeArr[0] = grid.width;
    sizeArr[1] = grid.height;
  }

  getUV8AndOffsetXYVtxFromChar(char:string,outUint8Arr:Uint8Array,vtxFloatArr:Float32Array,offsetX:number = 0,offsetY:number = 0,offsetuv:number = 0,offsetvtx:number = 0):void
  {
    let grid:FontTexCharGrid = this.m_gridMp.get(char);
    if(grid == null)grid = this.m_gridMp.get("?");
    outUint8Arr.set(grid.uvs,offsetuv);
    let pos_arr:number[] = [
      offsetX,offsetY,0,
      offsetX + grid.width,offsetY,0,
      offsetX + grid.width,offsetY + grid.height,0,
      offsetX,offsetY + grid.height,0
    ];
    vtxFloatArr.set(pos_arr,offsetvtx);
  }
}
//var fontCharTable = new FontTexCharTable();
export class FontTexDataBuilder
{
  constructor()
  {
  }
	private m_currPosX:number = 0;
	private m_currPosY:number = 0;
	private m_texText:string = "";
  private m_fontCharTable:FontTexCharTable = null;//new FontTexCharTable();
  setFontCharTable(table:FontTexCharTable):void
  {
    this.m_fontCharTable = table;
  }
	textFilte(srcStr:string):string
	{
		let len:number = srcStr.length;
		let newStr:string = "";
		let char:string = "";
		for(let i:number = 0; i < len; ++i)
		{
			char = srcStr.charAt(i);
			if(this.m_texText.indexOf(char) < 0 && newStr.indexOf(char) < 0)
			{
				newStr += char;
			}
		}
		return newStr;
	}
	pixMinPos:any = {x:0,y:0};
  pixMaxPos:any = {x:0,y:0};
  canvas:any = null;
  ctx2d:any = null;
	//let m_px = 0;
	private m_py:number = 0;
  private charTexWidth:number = 0;
  private px:number = 0;
  private py:number = 0;
  private ph:number = 0;
  private linedis:number = 2;
  private charHDis:number = 1;
  private tx:number = 0;
  private char:string = "";
  private meao:any = null;
	crateTextUVData(textStr:string,areaWidth:number,areaHeight:number,fontSize:number = 18):void
	{
		this.m_texText += textStr;
		let ctx2d:any = this.ctx2d;
		if(this.m_currPosY < 2)
		{
			this.m_currPosY = fontSize;
		}
		this.charTexWidth = 0;
		//ctx2d.textAlign = "start";
    ctx2d.textAlign = "left";
    ctx2d.fillStyle = "white";
		ctx2d.font = fontSize + "px Arial";
		//charAt
		let len = textStr.length;
		this.pixMinPos.x = 20000;
		this.pixMinPos.y = 20000;
		this.pixMaxPos.x = -20000;
		this.pixMaxPos.y = -20000;
    this.ph = fontSize + 8;
		for(let i = 0; i < len; i++)
		{
			this.char = textStr.charAt(i);
			this.meao = ctx2d.measureText( this.char );
			this.charTexWidth = Math.floor(this.meao.width) + 1.0;		
      this.tx = this.m_currPosX + this.charTexWidth;
      //console.log("this.char,this.m_currPosX,this.m_currPosY: "+this.char+","+this.m_currPosX+","+this.m_currPosY);
			if(this.tx < areaWidth)
			{
				ctx2d.fillText(this.char,this.m_currPosX,this.m_currPosY);
				this.m_py = this.m_currPosY-fontSize;

				if(this.pixMinPos.x > this.m_currPosX) this.pixMinPos.x = this.m_currPosX;
				if(this.pixMinPos.y > this.m_py) this.pixMinPos.y = this.m_py;
				this.px = this.m_currPosX + this.charTexWidth;
				this.py = this.m_py + this.ph;
				if(this.pixMaxPos.x < this.px) this.pixMaxPos.x = this.px;
				if(this.pixMaxPos.y < this.py) this.pixMaxPos.y = this.py;
        this.m_fontCharTable.addUV8RawDataFromChar(this.char,this.m_currPosX, this.m_py + 1,this.charTexWidth,this.ph);
				this.m_currPosX = this.tx + this.charHDis;
			}
			else
			{
				this.m_currPosX = 0;
				this.m_currPosY += this.ph + this.linedis;
				ctx2d.fillText(this.char,this.m_currPosX,this.m_currPosY);
				this.m_py = this.m_currPosY-fontSize;

				if(this.pixMinPos.x > this.m_currPosX) this.pixMinPos.x = this.m_currPosX;
				if(this.pixMinPos.y > this.m_py) this.pixMinPos.y = this.m_py;
				this.px = this.m_currPosX + this.charTexWidth;
				this.py = this.m_py + this.ph;
				if(this.pixMaxPos.x < this.px) this.pixMaxPos.x = this.px;
				if(this.pixMaxPos.y < this.py) this.pixMaxPos.y = this.py;
        this.m_fontCharTable.addUV8RawDataFromChar(this.char,this.m_currPosX, this.m_py + 1,this.charTexWidth,this.ph);
				this.m_currPosX += this.charTexWidth;
			}
		}
	}
}

class H5FontSystem
{
  private constructor()
  {
  }
  private m_texWidth:number = 512;
  private m_texHeight:number = 256;
  private m_canvas:any = null;
  private m_ctx2D:any = null;
  private m_texBase:BytesTextureProxy = null;
  private m_fontSize:number = 18;
  private m_fontCharTable:FontTexCharTable = new FontTexCharTable();
  private m_fontTexDataBuilder:FontTexDataBuilder = new FontTexDataBuilder();
  private m_renderProxy:RenderProxy = null;
  setRenderProxy(renderProxy:RenderProxy):void
  {
    if(renderProxy != null)
    {
      this.m_renderProxy = renderProxy;
      if(this.m_texBase != null)
      {
        this.m_texBase.__$setRenderProxy(renderProxy);
      }

    }
  }
  isEnabled():boolean
  {
    return this.m_canvas != null;
  }
  getFontSize(): number {
    return this.m_fontSize;
  }
  initialize(canvas_id_name:string,fontSize:number = 10, texWidth:number = 512,texHeight:number = 512,canvas_visible:boolean = false,mipmapEnabled:boolean = false)
  {
    if(RendererDeviece.IsMobileWeb()) {
      fontSize *= 2;
      texWidth = texHeight = texHeight * 2;
    }
    if(this.m_canvas == null)
    {
      if(texWidth < 32) texWidth = 32;
      if(texHeight < 32) texHeight = 32;
      this.m_texWidth = texWidth;
      this.m_texHeight = texHeight;

      if(fontSize < 10)
      {
        fontSize = 10;
      }
      this.m_fontSize = fontSize;
      //
      var pdocument:any = null;
      try
      {
          if(document != undefined)
          {
              pdocument = document;
          }
      }
      catch(err)
      {
          console.log("H5FontSystem::initialize(), document is undefined.");
      }

      this.m_canvas = pdocument.getElementById(canvas_id_name);
      if(this.m_canvas == null)
      {
        this.m_canvas = document.createElement('canvas');

        this.m_canvas.style.width = '128px';
        this.m_canvas.style.height = '128px';
        this.m_canvas.style.display = 'bolck';
        this.m_canvas.style.overflow = 'hidden';
        this.m_canvas.style.left = '0px';
        this.m_canvas.style.top = '0px';
        this.m_canvas.style.position = 'absolute';
        this.m_canvas.style.backgroundColor = 'transparent';
        this.m_canvas.style.pointerEvents = 'none';
      }
      this.m_canvas.width = texWidth;
      this.m_canvas.height = texHeight;
      //console.log("H5FontSystem::initialize(), canvas_visible: "+canvas_visible);
      if(canvas_visible)
      {        
        document.body.appendChild(this.m_canvas);
        this.m_canvas.style.visibility = "visible";
      }
      else
      {
        this.m_canvas.style.visibility = "hidden";
      }
      this.m_ctx2D = this.m_canvas.getContext("2d");
      this.m_fontTexDataBuilder.canvas = this.m_canvas;
      this.m_fontTexDataBuilder.ctx2d = this.m_ctx2D;
      this.m_fontTexDataBuilder.setFontCharTable(this.m_fontCharTable);
      //
      this.m_fontCharTable.initialize(this.m_texWidth, this.m_texHeight);
      //
      this.m_texBase = new BytesTextureProxy(this.m_texWidth,this.m_texHeight);
      this.m_texBase.__$setRenderProxy(this.m_renderProxy);
      
      this.m_texBase.toAlphaFormat();
      this.m_texBase.mipmapEnabled = mipmapEnabled;
      this.m_texBase.minFilter = TextureConst.LINEAR;
      this.m_texBase.magFilter = TextureConst.NEAREST;

      this.createInitTexAndChars();
    }
  }
  private m_preSW:number = 0;
  private m_preSH:number = 0;
  setStyleSize(pw:number,ph:number):void
  {
    if(this.m_canvas != null)
    {
      if(this.m_preSW != pw || this.m_preSH != ph)
      {
        this.m_preSW = pw;
        this.m_preSH = ph;
        this.m_canvas.style.width = pw + "px";
        this.m_canvas.style.height = ph + "px";
      }
    }
  }
  setCanvasVisible(bool:boolean):void
  {
    if(bool)
    {
      this.m_canvas.style.visibility = "visible";
    }
    else
    {
      this.m_canvas.style.visibility = "hidden";
    }
  }
  getUV8FromChar(char:string,outfloat8Arr:Float32Array,offset:number = 0):void
  {
    this.m_fontCharTable.getUV8FromChar(char,outfloat8Arr,offset);
  }
  getCharTable():FontTexCharTable
  {
    return this.m_fontCharTable;
  }
  
  private m_areaBytes:Uint8Array = null;
  createCharsTexFromStr(srcStr:string):void
  {
	  srcStr = this.m_fontTexDataBuilder.textFilte( srcStr );
	  if(srcStr.length < 1)
	  {
	  	//console.log("don not need rebuild tex Data");
	  	return;
	  }

	  let rawFontText = srcStr;
    this.m_fontTexDataBuilder.crateTextUVData(rawFontText, this.m_texWidth,this.m_texHeight, this.m_fontSize);
	 
	  let index:number = 0;
	  let i:number = 0;
	  let j:number = 0;
    
	  let k:number = 0;
	  let t:number = 0;
	  let dw:number = this.m_fontTexDataBuilder.pixMaxPos.x - this.m_fontTexDataBuilder.pixMinPos.x;
	  let dh:number = this.m_fontTexDataBuilder.pixMaxPos.y - this.m_fontTexDataBuilder.pixMinPos.y;

	  //let fontTexData:any = this.m_ctx2D.getImageData(0,0,this.m_texWidth,this.m_texHeight);
	  let fontTexData:any = this.m_ctx2D.getImageData(this.m_fontTexDataBuilder.pixMinPos.x,this.m_fontTexDataBuilder.pixMinPos.y,dw,dh);
    let pixData:any = fontTexData.data;
    let rawBytes:Uint8Array = new Uint8Array(dw * dh);

	  //  for(i = this.m_fontTexDataBuilder.pixMinPos.y; i < this.m_fontTexDataBuilder.pixMaxPos.y; ++i)
	  //  {
	  //  	for(j = this.m_fontTexDataBuilder.pixMinPos.x; j < this.m_fontTexDataBuilder.pixMaxPos.x; ++j)
	  //  	{
    //      t = i * this.m_texWidth + j;
    //      index = t * 4;
    //      this.m_areaBytes[t] = pixData[index + 3];
    //      rawBytes[k] = this.m_areaBytes[t];
    //      k++;
	  //  	}
	  //  }
    let px:number = this.m_fontTexDataBuilder.pixMinPos.x;
    let py:number = this.m_fontTexDataBuilder.pixMinPos.y;
	  for(i = 0; i < dh; ++i)
	  {
	  	for(j = 0; j < dw; ++j)
	  	{
        t = (i + py) * this.m_texWidth + (px + j);
        index = (i * dw + j) * 4;
        this.m_areaBytes[t] = pixData[index + 3];
        rawBytes[k] = this.m_areaBytes[t];
        k++;
	  	}
	  }

    //console.log("update sub text alpha texture pixel data.");
    //console.log("min pos: ",this.m_fontTexDataBuilder.pixMinPos.x,this.m_fontTexDataBuilder.pixMinPos.y);
	  this.m_texBase.setPartDataFromeBytes(rawBytes,this.m_fontTexDataBuilder.pixMinPos.x,this.m_fontTexDataBuilder.pixMinPos.y,dw,dh);
    this.m_texBase.updateDataToGpu();
  }
  private createInitTexAndChars():void
  {
    let baseChars:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~`!@#$%^&*()_+-={}[]:\";\\|'<>,.?/\n ";
    let tempChars:string = "我心永恒光辉岁月";
    
    let rawFontText:string = baseChars + tempChars;
    //let rawUVData = m_fontTexDataBuilder.crateTextUVData(rawFontText, m_texWidth,m_texHeight, m_fontSize);
    this.m_fontTexDataBuilder.crateTextUVData(rawFontText, this.m_texWidth,this.m_texHeight, this.m_fontSize);

    let fontTexData:any = this.m_ctx2D.getImageData(0,0,this.m_texWidth,this.m_texHeight);
    let pixData:any = fontTexData.data;

    let i:number = 0;
    let j:number = 0;
    let index:number = 0;
    this.m_areaBytes = new Uint8Array(this.m_texWidth * this.m_texHeight);
    let k:number = 0;
    for(i = 0; i < this.m_texHeight; ++i)
    {
      for(j = 0; j < this.m_texWidth; ++j)
      {
        index = (i * this.m_texWidth + j) * 4;
        this.m_areaBytes[k] = pixData[index + 3];
        k++;
      }
    }
    //console.log("set initialization text alpha texture pixel data.");
    this.m_texBase.setDataFromBytes(this.m_areaBytes,0,this.m_texWidth,this.m_texHeight);
  }
  getTextureAt(index:number = 0):BytesTextureProxy
  {
    return this.m_texBase;
  }
  private static s_ins:H5FontSystem = null;
  static GetInstance():H5FontSystem
  {
    if(H5FontSystem.s_ins != null)
    {
      return H5FontSystem.s_ins;
    }
    H5FontSystem.s_ins = new H5FontSystem();
    return H5FontSystem.s_ins;
  }
}

export default H5FontSystem;