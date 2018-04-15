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

export class ShaderAttribute {
  constructor(readonly name: string,
    readonly size: number, readonly stride: number) { }

  static float(name: string) {
    return new ShaderAttribute(name, 1, 4)
  }

  static vec2(name: string) {
    return new ShaderAttribute(name, 2, 8)
  }

  static vec3(name: string) {
    return new ShaderAttribute(name, 3, 12)
  }

  static vec4(name: string) {
    return new ShaderAttribute(name, 4, 16)
  }

  static mat4(name: string) {
    return new ShaderAttribute(name, 16, 64)
  }
}

export class Shader {
  readonly glProgram: WebGLProgram

  private _uniformLocations: { [name: string]: WebGLUniformLocation } = {}
  private _attributeLocations: { [name: string]: number } = {}

  constructor(readonly gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string, readonly attributes: ShaderAttribute[]) {

    let program = gl.createProgram()
    if (!program) {
      throw new Sheep3DTypeError(`Failed to create shader program (${gl.getError()})`)
    }
    this.glProgram = program

    gl.attachShader(this.glProgram,
      this._createShader(gl.VERTEX_SHADER, vertexShaderSource))
    gl.attachShader(this.glProgram,
      this._createShader(gl.FRAGMENT_SHADER, fragmentShaderSource))
    gl.linkProgram(this.glProgram)

    if (gl.getProgramParameter(this.glProgram, gl.LINK_STATUS) === false) {
      throw new Sheep3DTypeError(`Failed to link shader program (${gl.getProgramInfoLog(this.glProgram)})`)
    }

    for (let attr of this.attributes) {
      let location = this.gl.getAttribLocation(this.glProgram, attr.name)
      if (location < 0) {
        throw new Sheep3DTypeError(`Attribute "${attr.name}" does not exist in shader`)
      }
      this._attributeLocations[attr.name] = location
    }
  }

  setUniformMatrix3(name: string, value: Float32Array | number[]) {
    let location = this._getUniformLocation(name)
    this.gl.uniformMatrix3fv(location, false, value)
  }

  setUniformMatrix4(name: string, value: Float32Array, transpose = false) {
    let location = this._getUniformLocation(name)
    this.gl.uniformMatrix4fv(location, transpose, value)
  }

  setUniformVector3(name: string, value: Float32Array | number[]) {
    let location = this._getUniformLocation(name)
    this.gl.uniform3fv(location, value)
  }

  use() {
    this.gl.useProgram(this.glProgram)
  }

  setupVertexAttributes() {
    let stride = 0
    for (let attr of this.attributes) {
      stride += attr.stride
    }
    let offset = 0
    for (let attr of this.attributes) {
      let location = this._attributeLocations[attr.name]
      this.gl.enableVertexAttribArray(location)
      this.gl.vertexAttribPointer(
        location, attr.size, this.gl.FLOAT, false, stride, offset)
      offset += attr.stride
    }
  }

  private _getUniformLocation(name: string) {
    if (!this._uniformLocations[name]) {
      let location = this.gl.getUniformLocation(this.glProgram, name)
      if (!location || location < 0) {
        throw new Sheep3DTypeError(`Uniform "${name}" does not exist in shader`)
      }
      this._uniformLocations[name] = location
    }
    return this._uniformLocations[name]
  }

  private _createShader(shaderType: number, source: string) {
    let shader = this.gl.createShader(shaderType)
    if (!shader) {
      throw new Sheep3DTypeError(`Failed to create shader (${this.gl.getError()})`)
    }

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Sheep3DTypeError(`Failed to compile shader (${this.gl.getShaderInfoLog(this.glProgram)})`)
    }
    return shader
  }
}