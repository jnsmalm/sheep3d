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

import { Shader } from "./shader"
import { Sheep3DTypeError } from "./utils";

/**
 * Vertex Specification is the process of setting up the necessary objects
 * for rendering with a particular shader program, as well as the process of
 * using those objects to render.
 */
export class VertexSpecification {
  readonly glElementBuffer: WebGLBuffer
  readonly glVertexBuffer: WebGLBuffer

  /**
   * Creates a new vertex specification.
   * @param gl The WebGL rendering context to use.
   */
  constructor(readonly gl: WebGLRenderingContext) {
    let vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
      throw new Sheep3DTypeError(`Failed to create vertex buffer (${gl.getError()}).`)
    }
    this.glVertexBuffer = vertexBuffer

    let elementBuffer = gl.createBuffer()
    if (!elementBuffer) {
      throw new Sheep3DTypeError(`Failed to create element buffer (${gl.getError()}).`)
    }
    this.glElementBuffer = elementBuffer 
  }

  /**
   * Draws triangles with the vertices that has been set.
   * @param shader The shader to use when drawing.
   * @param count The number of triangles to draw.
   * @param offset The offset vertex to start at.
   */
  drawTriangles(shader: Shader, count: number, offset = 0) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glVertexBuffer)

    shader.use()
    shader.setupVertexAttributes()

    this.gl.drawArrays(this.gl.TRIANGLES, offset, count * 3)
  }

  /**
   * Draws indexed triangles with the vertices/indices that has been set.
   * @param shader The shader to use when drawing.
   * @param count The number of triangles to draw.
   * @param offset The offset vertex to start at.
   */
  drawIndexedTriangles(shader: Shader, count: number, offset = 0) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glVertexBuffer)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer)

    shader.use()
    shader.setupVertexAttributes()

    this.gl.drawElements(
      this.gl.TRIANGLES, count * 3, this.gl.UNSIGNED_SHORT, offset)
  }

  /** Sets the vertices to draw. */
  setVertexData(vertices: Float32Array) {
    let buffer = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glVertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
  }

  /** Sets the indices to draw. */
  setIndexData(indices: Uint16Array) {
    let buffer = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.glElementBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer)
  }
}