/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";

class ObjStrDataParser {
	constructor() { }
	// older versions of 3dsmax use an invalid vertex order: 
	private m_vertexDataIsZxy: boolean = false;
	// some exporters mirror the UV texture coordinates
	private m_mirrorUv: boolean = false;
	// OBJ files do not contain vertex colors
	// but many shaders will require this data
	// if false, the buffer is filled with pure white
	private m_randomVertexColors: boolean = true;
	// constants used in parsing OBJ data
	static LINE_FEED: string = String.fromCharCode(10);
	static SPACE: string = String.fromCharCode(32);
	static SLASH: string = "/";
	static VERTEX: string = "v";
	static NORMAL: string = "vn";
	static UV: string = "vt";
	static INDEX_DATA: string = "f";
	// temporary vars used during parsing OBJ data
	private m_scale: number = 1.0;
	private m_faceIndex: number = 0;
	private m_vertices: number[] = null;//Array
	private m_verticesLen: number = 0;
	private m_normals: number[] = null;// Array
	private m_normalsLen: number = 0;
	private m_uvs: number[] = null;// Array
	private m_uvsLen: number = 0;
	//
	private m_cachedRawNVS: number[] = null;// Array
	private m_vtxTot: number = 0;
	// the raw data that is used to create Stage3d buffers
	private m_rawIVS: number[] = null;//Array
	private m_rawVS: number[] = null;//Array
	private m_rawUVS: number[] = null;//Array
	private m_rawNVS: number[] = null;//Array
	private m_rawCVS: number[] = null;//Array
	// 用于拆分处理
	private baseVertexIndex: number = 0;
	private baseNormalIndex: number = 0;
	private baseUvIndex: number = 0;
	//
	idns: string = "obj";
	// the class constructor - where everything begins
	parseStrData(objStr: string, scale: number, dataIsZxy: boolean = false, textureFlip: boolean = false): void {
		if (scale == undefined) scale = 1.0;
		if (dataIsZxy == undefined) dataIsZxy = false;
		if (textureFlip == undefined) textureFlip = false;
		//
		this.m_vertexDataIsZxy = dataIsZxy;
		this.m_mirrorUv = textureFlip;
		this.m_rawCVS = [];
		this.m_rawIVS = [];
		this.m_rawVS = [];
		this.m_rawUVS = [];
		this.m_rawNVS = [];
		this.m_scale = scale;
		// Get data as string.
		//var definition:String = readClass(objfile);
		// Init raw data containers.
		this.m_vertices = [];
		this.m_normals = [];
		this.m_uvs = [];
		// Split data in to lines and parse all lines.
		let lines = objStr.split(ObjStrDataParser.LINE_FEED);
		let loop = lines.length;
		for (let i = 0; i < loop; ++i) {
			this.parseLine(lines[i]);
		}
		//
		this.m_vtxTot = this.m_rawVS.length / 3.0;
	}
	getVtxTotal(): number {
		return this.m_vtxTot;
	}
	private m_matChange: boolean = true;
	private parseLine(line: string): void {
		// Split line into words.
		let words: string[] = line.split(ObjStrDataParser.SPACE);
		// Prepare the data of the line.
		let data: string[] = null;
		if (words.length > 0) {
			data = words.slice(1);
		}
		else {
			return;
		}
		// Check first word and delegate remainder to proper parser.
		let firstWord: string = words[0];
		switch (firstWord) {
			case ObjStrDataParser.VERTEX:
				this.parseVertex(data);
				break;
			case ObjStrDataParser.NORMAL:
				this.parseNormal(data);
				break;
			case ObjStrDataParser.UV:
				this.parseUV(data);
				break;
			case ObjStrDataParser.INDEX_DATA:
				this.parseIndex(data);
				break;
		}
	}
	private parseVertex(data: string[]): void {
		if ((data[0] == '') || (data[0] == ' '))
			data = data.slice(1); // delete blanks
		if (this.m_vertexDataIsZxy) {
			//if (!m_vertices.length) trace('zxy parseVertex: ' 
			// + data[1] + ',' + data[2] + ',' + data[0]);
			this.m_vertices.push(Number(data[1]) * this.m_scale);
			this.m_vertices.push(Number(data[2]) * this.m_scale);
			this.m_vertices.push(Number(data[0]) * this.m_scale);
		}
		else // normal operation: x,y,z
		{
			//if (!m_vertices.length) trace('parseVertex: ' + data);
			let loop: number = data.length;
			if (loop > 3) loop = 3;
			for (let i: number = 0; i < loop; ++i) {
				//let element:string = data[i];
				this.m_vertices.push(Number(data[i]) * this.m_scale);
			}
		}
		//trace("parseVertex data: "+data);
		//trace("parseVertex m_vertices:\n"+m_vertices);
		this.m_verticesLen = this.m_vertices.length;
	}
	getVS(): number[] {
		return this.m_rawVS;
	}
	private m_cvs: number[] = null;// Array
	getCVS(): number[] {
		if (this.m_cvs != null) {
			return this.m_cvs;
		}
		this.m_cvs = [];
		let i: number = 0;
		let len: number = this.m_rawVS.length / 3;
		for (; i < len; i++) {
			this.m_cvs.push(1, 1, 1, 1);
		}
		return this.m_cvs;
	}
	parseNormal(data: string[]): void {
		if ((data[0] == '') || (data[0] == ' ')) {
			data = data.slice(1); // delete blanks
		}
		//if (!m_normals.length) trace('parseNormal:' + data);
		let loop: number = data.length;
		//trace("parseNormal, data: ",data);
		if (loop > 3) loop = 3;
		for (let i: number = 0; i < loop; ++i) {
			let element = data[i];
			if (element != null) {
				// handle 3dsmax extra spaces
				this.m_normals.push(Number(element));
			}
		}
		this.m_normalsLen = this.m_normals.length;
	}
	getNVS(): number[] {
		return this.m_rawNVS;
	}
	private parseUV(data: string[]): void {
		if ((data[0] == '') || (data[0] == ' ')) {
			data = data.slice(1); // delete blanks
		}
		//if (!m_uvs.length) trace('parseUV:' + data);
		let loop: number = data.length;
		if (loop > 2) loop = 2;
		for (let i: number = 0; i < loop; ++i) {
			let element = data[i];
			this.m_uvs.push(Number(element));
		}
		this.m_uvsLen = this.m_uvs.length;
		//trace("parseUV m_uvs:\n"+m_uvs);
	}
	getUVS(): number[] {
		return this.m_rawUVS;
	}
	private parseIndex(data: string[]): void {
		//if (!m_rawIVS.length) trace('parseIndex:' + data);
		let triplet: string = "";
		let subdata: string[] = null;
		let vertexIndex: number = 0;
		let uvIndex: number = 0;
		let normalIndex: number = 0;
		let index: number = 0;
		// Process elements.
		let i: number = 0;
		let loop: number = data.length;
		let starthere: number = 0;
		while ((data[starthere] == '') || (data[starthere] == ' '))
			starthere++; // ignore blanks
		loop = starthere + 3;

		// loop through each element and grab values stored earlier
		// elements come as vertexIndex/uvIndex/normalIndex
		for (i = starthere; i < loop; ++i) {
			triplet = data[i];
			if (triplet == "") continue;
			subdata = triplet.split(ObjStrDataParser.SLASH);
			vertexIndex = (parseInt(subdata[0]) - 1) - this.baseVertexIndex;
			uvIndex = (parseInt(subdata[1]) - 1) - this.baseUvIndex;
			normalIndex = (parseInt(subdata[2]) - 1) - this.baseNormalIndex;
			// sanity check
			if (vertexIndex < 0) vertexIndex = 0;
			if (uvIndex < 0) uvIndex = 0;
			if (normalIndex < 0) normalIndex = 0;
			// Extract from parse raw data to mesh raw data.
			// Vertex (x,y,z)
			index = 3 * vertexIndex;
			this.m_rawVS.push(this.m_vertices[index],
				this.m_vertices[index + 1], this.m_vertices[index + 2]);
			// Color (vertex r,g,b,a)
			if (this.m_randomVertexColors) {
				this.m_rawCVS.push(Math.random(), Math.random(), Math.random(), 1);
			} else {
				this.m_rawCVS.push(1, 1, 1, 1); // pure white
			}
			// Normals (nx,ny,nz) - *if* included in the file
			if (this.m_normals.length) {
				index = 3 * normalIndex;
				this.m_rawNVS.push(this.m_normals[index],
					this.m_normals[index + 1], this.m_normals[index + 2]);
			}
			// Texture coordinates (u,v)
			index = 2 * uvIndex;
			if (this.m_mirrorUv) {
				this.m_rawUVS.push(1.0 - this.m_uvs[index], 1.0 - this.m_uvs[index + 1]);
			} else {
				this.m_rawUVS.push(this.m_uvs[index], this.m_uvs[index + 1]);
			}
		}
		//trace("m_rawNVS: ",m_rawNVS);
		// Create index buffer - one entry for each polygon
		this.m_rawIVS.push(this.m_faceIndex, this.m_faceIndex + 1, this.m_faceIndex + 2);
		this.m_faceIndex += 3;
	}
	getIVS(): number[] {
		return this.m_rawIVS;
	}
	getTriTotal(): number {
		return this.m_rawIVS.length / 3.0;
	}
	restoreNormals(): void {	// utility function
		this.m_rawNVS = this.m_cachedRawNVS.concat();
	}
} // end class
/**
 * objs data format parser
 * 
 * */
class ObjsStrDataParser {
	constructor() { }

	private m_parserArr: ObjStrDataParser[] = [];
	parseStrData(objDataStr: string, scale: number = 1.0, dataIsZxy: boolean = false, textureFlip: boolean = false): void {
		let list: string[] = objDataStr.split("# object");
		let i: number = 1;
		let parser: ObjStrDataParser = null;
		for (; i < list.length; ++i) {
			//trace("------------------------b-----b--------b---------------------");
			//trace("# object" + list[i]);
			parser = new ObjStrDataParser();
			parser.parseStrData("# object" + list[i], scale, dataIsZxy, textureFlip);
			this.m_parserArr.push(parser);
		}
	}
	getParserTotal(): number {
		return this.m_parserArr.length;
	}
	getParserAt(i: number): ObjStrDataParser {
		return this.m_parserArr[i];
	}

} // end class
export { ObjStrDataParser, ObjsStrDataParser }