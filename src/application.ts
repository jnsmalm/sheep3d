/*MIT License

Copyright (c) 2018 Jens Malmborg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

import { Sheep3DTypeError } from "./utils";

export interface ApplicationOptions {
  width?: number
  height?: number
}

export class Application {
  readonly gl: WebGLRenderingContext
  readonly view: HTMLCanvasElement

  update: () => void = () => { }
  draw: () => void = () => { }

  constructor(options: ApplicationOptions = {}) {
    let { width = 640, height = 480 } = options

    this.view = <HTMLCanvasElement>document.createElement("canvas");
    this.view.width = width
    this.view.height = height

    try {
      this.gl = <WebGLRenderingContext>this.view.getContext("webgl") ||
        <WebGLRenderingContext>this.view.getContext("experimental-webgl")
    }
    catch {
      throw new Sheep3DTypeError(
        "Failed to initialize WebGL. Your browser may not support it.")
    }

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.viewport(0, 0, width, height)
    this.gl.enable(this.gl.CULL_FACE);

    let animationFrame = (time: number) => {
      this.clear()
      this.update()
      this.draw()
      requestAnimationFrame(animationFrame)
    }
    requestAnimationFrame(animationFrame)
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }
}