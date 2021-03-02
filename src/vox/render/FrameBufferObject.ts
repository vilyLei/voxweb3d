/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as FrameBufferTypeT from "../../vox/render/FrameBufferType";
import * as TextureConstT from "../../vox/texture/TextureConst";
import * as IRenderResourceT from '../../vox/render/IRenderResource';
import * as RTTTextureProxyT from "../../vox/texture/RTTTextureProxy";
import * as RenderFBOProxyT from "../../vox/render/RenderFBOProxy";
import * as Color4T from "../../vox/material/Color4";


import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import FrameBufferType = FrameBufferTypeT.vox.render.FrameBufferType;
import TextureTarget = TextureConstT.vox.texture.TextureTarget;
import TextureFormat = TextureConstT.vox.texture.TextureFormat;
import IRenderResource = IRenderResourceT.vox.render.IRenderResource;

import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;
import RenderFBOProxy = RenderFBOProxyT.vox.render.RenderFBOProxy;
import Color4 = Color4T.vox.material.Color4;

export namespace vox
{
    export namespace render
    {
		export class FrameBufferObject
		{
			private m_uid:number = -1;
			private static s_uid:number = 0;
			// renderer context unique id
			private m_rcuid:number = 0;
			private m_texRes:IRenderResource;
			constructor(rcuid:number,texResource:IRenderResource,frameBufType:number)
    		{
				this.m_rcuid = rcuid;
				this.m_texRes = texResource;
				this.m_bufferLType = frameBufType;
				this.m_uid = FrameBufferObject.s_uid++;
    		}
			private m_COLOR_ATTACHMENT0:number = 0x0;	
    		private m_fbo:any = null;
    		private m_depthStencilRBO:any = null;
    		private m_depthRBO:any = null;
    		private m_colorRBO:any = null;
    		private m_width:number = 512;
    		private m_height:number = 512;
    		private m_bufferLType:number = 0;
			private m_gl:any = null;
			private m_fboTarget:number = 0;
			private m_texTargetTypes:number[] = [0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0];
			private m_attachmentMaskList:boolean[] = [true,true,true,true,true,true,true,true];
			private m_preAttachTotal:number = 0;
			private m_preAttachIndex:number = 0;
    		private m_activeAttachmentTotal:number = 0;
    		private m_attachmentIndex:number = 0;
			private m_clearDepthArr = new Float32Array(1);
			private m_clearColorArr = new Float32Array(4);
			private m_stencilValueArr = new Int16Array(4);
			private m_fboSizeChanged:boolean = false;
			//
			sizeFixed:boolean = false;
			//devPRatio:number = 1.0;
    		writeDepthEnabled:boolean = true;
    		writeStencilEnabled:boolean = false;
    		multisampleEnabled:boolean = false;
    		multisampleLevel:number = 0;
			getUid():number
			{
				return this.m_uid;
			}
			resetAttachmentMask(boo:boolean):void
			{
				let i:number = this.m_attachmentMaskList.length - 1;
				while(i >= 0)
				{
					this.m_attachmentMaskList[i] = boo;
					--i;
				}
			}
			setAttachmentMaskAt(index:number, boo:boolean):void
			{
				this.m_attachmentMaskList[index] = boo;
			}
			getActiveAttachmentTotal():number
			{
				return this.m_activeAttachmentTotal;
			}
			getAttachmentTotal():number
			{
				return this.m_attachmentMaskList.length;
			}
    		bindToBackbuffer(frameBufferType:number):void
			{
				switch (frameBufferType)
				{
				case FrameBufferType.DRAW_FRAMEBUFFER:
					this.m_gl.bindFramebuffer(this.m_gl.DRAW_FRAMEBUFFER, null);
					break;
				case FrameBufferType.READ_FRAMEBUFFER:
					this.m_gl.indFramebuffer(this.m_gl.READ_FRAMEBUFFER, null);
					break;
				default:
					this.m_gl.bindFramebuffer(this.m_gl.FRAMEBUFFER, null);
				}
			}

			bind(frameBufferType:number):void
			{
				if (this.m_fbo != null)
				{
					switch (frameBufferType)
					{
					case FrameBufferType.DRAW_FRAMEBUFFER:
						this.m_gl.bindFramebuffer(this.m_gl.DRAW_FRAMEBUFFER, this.m_fbo);
						break;
					case FrameBufferType.READ_FRAMEBUFFER:
						this.m_gl.bindFramebuffer(this.m_gl.READ_FRAMEBUFFER, this.m_fbo);
						break;
					default:
						this.m_gl.bindFramebuffer(this.m_gl.FRAMEBUFFER, this.m_fbo);
					}
				}
			}
			
			getFBO():object { return this.m_fbo; }
			getDepthStencilRBO():object { return this.m_depthStencilRBO; }
			getDepthRBO():object { return this.m_depthRBO; }
			getWidth():number { return this.m_width; }
			getHeight():number { return this.m_height; }
    		getFramebufferType():number{return this.m_bufferLType;}
    
            /**
             * bind a texture to fbo attachment by attachment index
             * @param texProxy  RTTTextureProxy instance
             * @param enableDepth  enable depth buffer yes or no
             * @param enableStencil  enable stencil buffer yes or no
             * @param attachmentIndex  fbo attachment index
             */
    		renderToTexAt(rgl:any, texProxy:RTTTextureProxy, attachmentIndex:number):void
			{
				let inFormat:number = texProxy!=null?texProxy.internalFormat:-1;
				
				if (attachmentIndex == 0)
				{
					// 注意, 防止多次重复调用的没必要重设
					this.m_gl.bindFramebuffer(this.m_fboTarget, this.m_fbo);
					if(inFormat != TextureFormat.DEPTH_COMPONENT)
					{
						this.m_activeAttachmentTotal = 0;
						this.m_attachmentIndex = 0;
					}
				}
				let targetType:number = -1;
				let rTex:any = null;
				//trace("FrameBufferObject::use(), texProxy != null: "+(texProxy != null));
				if (texProxy != null)
				{
					targetType = texProxy.getTargetType();
					texProxy.uploadFromFbo(this.m_texRes,this.m_width,this.m_height);
					rTex = this.m_texRes.getGpuBuffer(texProxy.getResUid());					
				}
				else
				{
					targetType = this.m_texTargetTypes[this.m_activeAttachmentTotal];
				}
				this.framebufferTextureBind(rgl,targetType, inFormat, rTex);
			}
			private framebufferTexture2D(rgl:any,targetType:number, inFormat:number,rTex:any):void
			{
				switch(inFormat)
				{
					case TextureFormat.DEPTH_COMPONENT:
						rgl.framebufferTexture2D(this.m_fboTarget, this.m_gl.DEPTH_ATTACHMENT, rgl.TEXTURE_2D, rTex,0);
					break;
					case TextureFormat.DEPTH_STENCIL:
						rgl.framebufferTexture2D(this.m_fboTarget, this.m_gl.DEPTH_STENCIL_ATTACHMENT, rgl.TEXTURE_2D, rTex,0);
					break;
					default:
						if(this.m_attachmentMaskList[this.m_activeAttachmentTotal])
						{
							rgl.framebufferTexture2D(this.m_fboTarget, this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex, rgl.TEXTURE_2D, rTex, 0);
							++this.m_attachmentIndex;
							if (rTex != null)
							{
								this.m_texTargetTypes[this.m_activeAttachmentTotal] = targetType;
							}
							else
							{
								this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
							}
						}
						else
						{
							this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
						}
						++this.m_activeAttachmentTotal;
					break;
				}
			}
			private framebufferTextureBind(rgl:any, targetType:number,inFormat:number, rTex:any):void
			{
				// current texture attachments
				switch (targetType)
				{
				case TextureTarget.TEXTURE_2D:
					this.framebufferTexture2D(rgl, targetType, inFormat, rTex);					
					break;
				case TextureTarget.TEXTURE_CUBE:
					for (let i:number = 0; i < 6; ++i)
					{
						if(this.m_attachmentMaskList[this.m_activeAttachmentTotal])
						{
							rgl.framebufferTexture2D(this.m_fboTarget, this.m_COLOR_ATTACHMENT0 + this.m_attachmentIndex, rgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, rTex, 0);
							++this.m_attachmentIndex;
							if (rTex != null)
							{
								this.m_texTargetTypes[this.m_activeAttachmentTotal] = targetType;
							}
							else
							{
								this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
							}
						}
						else
						{
							this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
						}
						++this.m_activeAttachmentTotal;
					}
					break;
				case TextureTarget.TEXTURE_SHADOW_2D:
					if(this.m_attachmentMaskList[this.m_activeAttachmentTotal])
					{
						rgl.framebufferTexture2D(this.m_gl.FRAMEBUFFER, this.m_gl.DEPTH_ATTACHMENT, this.m_gl.TEXTURE_2D, rTex, 0);
						if (rTex != null)
						{
							this.m_texTargetTypes[this.m_activeAttachmentTotal] = targetType;
						}
						else
						{
							this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
						}
					}
					else
					{
						this.m_texTargetTypes[this.m_activeAttachmentTotal] = 0;
					}
					++this.m_activeAttachmentTotal;
					break;
				default:
					break;
				}
			}
			reset():void
			{
				this.m_preAttachTotal = -1;
				this.m_preAttachIndex = -1;
    		}
    
			use(rgl:any):void
			{
				this.m_gl = rgl;
				if (this.m_fbo != null)
				{
					if (this.m_activeAttachmentTotal > 1)
					{
						if (this.m_preAttachIndex != this.m_attachmentIndex)
						{
							this.m_preAttachIndex = this.m_attachmentIndex;
							let attachments:number[] = [];
							for (let i = 0; i < this.m_preAttachIndex; ++i)
							{
								attachments.push(this.m_COLOR_ATTACHMENT0 + i);
							}
							// support webgl2 and webgl1
							RenderFBOProxy.DrawBuffers(attachments);
						}
					}
					else if (this.m_preAttachIndex != this.m_attachmentIndex)
					{
						RenderFBOProxy.DrawBuffers([this.m_COLOR_ATTACHMENT0]);
						this.m_preAttachIndex = this.m_attachmentIndex;
					}
					this.m_preAttachTotal = this.m_activeAttachmentTotal;
				}
    		}
    		clearOnlyColor(color:Color4)
			{
				if (this.m_fbo != null)
				{
					if(RendererDeviece.IsWebGL2())
					{
						this.m_clearColorArr[0] = color.r;
						this.m_clearColorArr[1] = color.g;
						this.m_clearColorArr[2] = color.b;
						this.m_clearColorArr[3] = color.a;
						if (this.m_preAttachTotal > 1)
						{
							for (let i = 0; i < this.m_preAttachTotal; ++i)
							{
								this.m_gl.clearBufferfv(this.m_gl.COLOR, i, this.m_clearColorArr);
							}
						}
						else
						{
							this.m_gl.clearBufferfv(this.m_gl.COLOR, 0, this.m_clearColorArr);
						}
					}
					else
					{
						this.m_gl.clearColor(color.r, color.g, color.b, color.a);
					}
				}
				//trace("XXXXXXXXXXXXXXXXXXXX FrameBufferObject::clearOnlyColor(), m_fbo: ", m_fbo);
			}

			clearOnlyDepth(depth:number = 1.0):void
			{
				if(RendererDeviece.IsWebGL2())
				{
					this.m_clearDepthArr[0] = depth;
					this.m_gl.clearBufferfv(this.m_gl.DEPTH, 0, this.m_clearDepthArr);
				}
				else
				{
					this.m_gl.clearDepth(depth);
				}
			}
			clearOnlyStencil(stencil:number):void
			{
				this.m_stencilValueArr[0] = stencil;
				this.m_gl.clearBufferuiv(this.m_gl.STENCIL, 0, this.m_stencilValueArr);
			}
			clearOnlyDepthAndStencil(depth:number, stencil:number):void
			{
				this.m_gl.clearBufferfi(this.m_gl.DEPTH_STENCIL, 0, depth, stencil);
			}
			invalidateFramebuffer():void
			{
				
			}
			//invalidateFramebuffer(target, attachments)
			private m_resizeW:number = 2;
			private m_resizeH:number = 2;
			// 一旦这个函数调用，则size的控制权以后都会由这个resize决定
			resize(pw:number, ph:number):void
			{
				if(this.m_resizeW != pw || this.m_resizeH != ph)
				{
					this.m_fboSizeChanged = true;
					this.m_resizeW = pw;
					this.m_resizeH = ph;
				}
			}
			initialize(rgl:any, pw:number, ph:number):void
			{
				this.m_gl = rgl;
				this.m_COLOR_ATTACHMENT0 = RenderFBOProxy.COLOR_ATTACHMENT0;
				if(this.m_fboSizeChanged)
				{
					pw = this.m_resizeW;
					ph = this.m_resizeH;
				}
				if (this.m_fbo == null)
				{
					this.createNewFBO(rgl, pw, ph);
					//console.log("FrameBufferObject create a new fbo: "+this);
				}
				else if (this.m_width != pw || this.m_height != ph)
				{
					// ready rebuild some new fbo's Renderbuffers.
					this.createNewFBO(rgl, pw, ph);
					console.log("FrameBufferObject ready rebuild another new fbo's Renderbuffers.fbo: "+this);
				}
			}
			destroy(rgl:any):void
			{
				if (this.m_fbo != null)
				{
					if (this.m_depthStencilRBO != null)
					{
						rgl.deleteFramebuffer(this.m_depthStencilRBO);
						this.m_depthStencilRBO = null;
					}
					if (this.m_depthRBO != null)
					{
						rgl.deleteFramebuffer(this.m_depthRBO);
						this.m_depthRBO = null;
					}
					if (this.m_colorRBO != null)
					{
						rgl.deleteFramebuffer(this.m_colorRBO);
						this.m_colorRBO = null;
					}
					rgl.deleteFramebuffer(this.m_fbo);
					this.m_fbo = null;
				}
				this.m_gl = null;
				this.m_fboTarget = 0;
				this.m_fboSizeChanged = false;
			}
			toString = function()
			{
				switch (this.m_bufferLType)
				{
				case FrameBufferType.DRAW_FRAMEBUFFER:
					return "[FrameBufferObject(DRAW_FRAMEBUFFER(uid="+this.m_uid+" width="+this.m_width+",height="+this.m_height+")]";
					break;
				case FrameBufferType.READ_FRAMEBUFFER:
					return "[FrameBufferObject(READ_FRAMEBUFFER(uid="+this.m_uid+" width="+this.m_width+",height="+this.m_height+")]";
					break;
				default:
					break;
				}
				return "[FrameBufferObject(FRAMEBUFFER(uid="+this.m_uid+" width="+this.m_width+",height="+this.m_height+")]";
			}
			private buildDepthStencilRBO(rgl:any, pw:number, ph:number):void
			{
				if(this.m_depthStencilRBO == null)this.m_depthStencilRBO = rgl.createRenderbuffer();
				if (this.multisampleEnabled)
				{
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
					rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.DEPTH_STENCIL, pw, ph);
					rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);

					if(this.m_colorRBO == null)this.m_colorRBO = rgl.createRenderbuffer();
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
					rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
					rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);

				}
				else
				{
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
					rgl.renderbufferStorage(rgl.RENDERBUFFER,rgl.DEPTH_STENCIL, pw, ph);
					rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);
				}
			}
			private buildDepthRBO(rgl:any, pw:number, ph:number):void
			{
				if (this.m_depthRBO == null) this.m_depthRBO = rgl.createRenderbuffer();
				if (this.multisampleEnabled)
				{
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthRBO);
					rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.DEPTH_COMPONENT24, pw, ph);
					rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthRBO);

					if(this.m_colorRBO == null)this.m_colorRBO = rgl.createRenderbuffer();
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
					rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
					rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);
				}
				else
				{
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthRBO);
					if(RendererDeviece.IsWebGL2())
					{
						rgl.renderbufferStorage(rgl.RENDERBUFFER, rgl.DEPTH_COMPONENT24, pw, ph);
					}
					else
					{
						console.log("Only use webgl1 depth fbo buffer.");
						rgl.renderbufferStorage(rgl.RENDERBUFFER, rgl.DEPTH_COMPONENT16, pw, ph);
					}
					rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.DEPTH_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthRBO);
				}
			}
			private buildStencilRBO(rgl:any, pw:number, ph:number):void
			{
				if (this.m_depthStencilRBO == null)
				{
					//trace("FrameBufferObject create stencil buf...this.multisampleEnabled: "+this.multisampleEnabled+",this.multisampleLevel:"+this.multisampleLevel);
					if(this.m_depthStencilRBO == null)this.m_depthStencilRBO = rgl.createRenderbuffer();
					if(this.multisampleEnabled)
					{
						rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
						rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.STENCIL_INDEX8, pw, ph);
						rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);

						if(this.m_colorRBO == null)this.m_colorRBO = rgl.createRenderbuffer();
						rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
						rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
						rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);
					}
					else
					{
						rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_depthStencilRBO);
						rgl.renderbufferStorage(rgl.RENDERBUFFER,rgl.STENCIL_INDEX8, pw, ph);
						rgl.framebufferRenderbuffer(this.m_fboTarget, rgl.STENCIL_ATTACHMENT, rgl.RENDERBUFFER, this.m_depthStencilRBO);
					}
				}
			}
			private buildColorRBO(rgl:any, pw:number, ph:number):void
			{
				if (this.multisampleEnabled)
				{
					if(this.m_colorRBO == null)this.m_colorRBO = rgl.createRenderbuffer();
					rgl.bindRenderbuffer(rgl.RENDERBUFFER, this.m_colorRBO);
					rgl.renderbufferStorageMultisample(rgl.RENDERBUFFER, this.multisampleLevel, rgl.RGBA8, pw, ph);
					rgl.framebufferRenderbuffer(this.m_fboTarget, this.m_COLOR_ATTACHMENT0, rgl.RENDERBUFFER, this.m_colorRBO);
					//
				}
				console.log("FrameBufferObject create only color buf...this.multisampleEnabled: "+this.multisampleEnabled+",this.multisampleLevel:"+this.multisampleLevel);
			}
			private createNewFBO(rgl:any, pw:number, ph:number):void
			{
				let boo:boolean = this.m_fbo == null;
				
				this.m_preAttachTotal = this.m_activeAttachmentTotal = 0;
				this.m_preAttachIndex = this.m_attachmentIndex = 0;
				this.m_width = pw;
				this.m_height = ph;
				this.m_resizeW = pw;
				this.m_resizeH = ph;
				//trace("XXXXXXXXXXXXXX ready create framebuf, m_fbo: ", m_fbo);
				if(boo) this.m_fbo = rgl.createFramebuffer();
				//trace("XXXXXXXXXXXXXX doing create framebuf, m_fbo: ", m_fbo);
				switch (this.m_bufferLType)
				{
				case FrameBufferType.DRAW_FRAMEBUFFER:
					this.m_fboTarget = rgl.DRAW_FRAMEBUFFER;
					break;
				case FrameBufferType.READ_FRAMEBUFFER:
					this.m_fboTarget = rgl.READ_FRAMEBUFFER;
					break;
				default:
					this.m_fboTarget = rgl.FRAMEBUFFER;
					break;
				}
				rgl.bindFramebuffer(this.m_fboTarget, this.m_fbo);
				//console.log("FrameBufferObject::initialize() writeDepthEnabled: "+this.writeDepthEnabled+", writeDepthEnabled: " , this.writeDepthEnabled+" ,size("+pw + "," ,ph+")");
				if (this.writeDepthEnabled)
				{
					//trace("FrameBufferObject writeStencilEnabled: " ,this.writeStencilEnabled);
					if (this.writeStencilEnabled)
					{
						if (this.m_depthStencilRBO == null)
						{
							//trace("FrameBufferObject create depth and stencil buf...this.multisampleEnabled: "+this.multisampleEnabled+",this.multisampleLevel:"+this.multisampleLevel);
							this.buildDepthStencilRBO(rgl, pw,ph);
						}
					}
					else
					{
						this.buildDepthRBO(rgl, pw,ph);
					}
				}
				else if (this.writeStencilEnabled)
				{
					this.buildStencilRBO(rgl,pw,ph);
				}
				else
				{
					this.buildColorRBO(rgl, pw,ph);
				}
				if(boo)
				{
					let e = rgl.checkFramebufferStatus(this.m_fboTarget);
					//trace("XXXXX   XXXXXXXXx Err: "+e+", rgl.FRAMEBUFFER_COMPLETE: "+rgl.FRAMEBUFFER_COMPLETE);
					if(e !== rgl.FRAMEBUFFER_COMPLETE)
					{
						console.error("FrameBufferObject::createNewFBO(), Error: create failure!!!!");
					}
					else
					{
						console.log("FrameBufferObject::createNewFBO(), create success...,size: "+pw+","+ph);
					}
				}
			}
			static BindToBackbuffer(rc:any,frameBufferType:number):void
			{
				switch (frameBufferType)
				{
				case FrameBufferType.DRAW_FRAMEBUFFER:
					rc.bindFramebuffer(rc.DRAW_FRAMEBUFFER, null);
					break;
				case FrameBufferType.READ_FRAMEBUFFER:
					rc.indFramebuffer(rc.READ_FRAMEBUFFER, null);
					break;
				default:
					rc.bindFramebuffer(rc.FRAMEBUFFER, null);
					break;
				}
			}
		}
	}
}