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
import { VertexSpecification } from "./vertexspec"
import { Transform } from "./transform"
import { Matrix4 } from "./math";

/**
 * Represents a shader used when drawing a mesh.
 */
export interface MeshShader<T> extends Shader {
  input: MeshShaderInput[]
  setup(material: T, transform: Transform): void
}

export enum MeshShaderInput {
  Position,
  Normal,
  TextureCoordinate
}

export class Mesh {
  vertices: number[] = []
  textureCoords: number[] = []
  faces: number[] = []
  normals: number[] = []

  setupVertexSpecification<T>(vertexSpec: VertexSpecification, shader: MeshShader<T>) {
    vertexSpec.setIndexData(new Uint16Array(this.faces))

    let vertexLength = 0
    for (let input of shader.input) {
      switch (input) {
        case MeshShaderInput.TextureCoordinate:
          vertexLength += 2
          break
        case MeshShaderInput.Position:
        case MeshShaderInput.Normal: {
          vertexLength += 3
          break
        }
      }
    }

    let vertexData = new Float32Array(this.vertices.length * vertexLength)
    let vertexOffset = 0

    for (let input of shader.input) {
      switch (input) {
        case MeshShaderInput.Position: {
          let index = vertexOffset
          for (let i = 0; i < this.vertices.length; i++) {
            if (i > 0 && i % 3 === 0) {
              index += vertexLength - 3
            }
            vertexData[index++] = this.vertices[i]
          }
          vertexOffset += 3
          break
        }
        case MeshShaderInput.Normal: {
          let index = vertexOffset
          for (let i = 0; i < this.normals.length; i++) {
            if (i > 0 && i % 3 === 0) {
              index += vertexLength - 3
            }
            vertexData[index++] = this.normals[i]
          }
          vertexOffset += 3
          break
        }
        case MeshShaderInput.TextureCoordinate: {
          let index = vertexOffset
          for (let i = 0; i < this.textureCoords.length; i++) {
            if (i > 0 && i % 2 === 0) {
              index += vertexLength - 2
            }
            vertexData[index++] = this.textureCoords[i]
          }
          vertexOffset += 2
          break
        }
      }
    }

    vertexSpec.setVertexData(new Float32Array(vertexData))
  }
}

export class ModelMesh<T> {
  private _vertexSpec = new VertexSpecification(this.gl)

  transform = new Transform()

  constructor(readonly gl: WebGLRenderingContext, readonly material: T, readonly shader: MeshShader<T>, readonly mesh: Mesh) {
    mesh.setupVertexSpecification(this._vertexSpec, shader)
  }

  draw() {
    this.shader.use()
    this.shader.setup(this.material, this.transform)
    this._vertexSpec.drawIndexedTriangles(
      this.shader, this.mesh.faces.length / 3)
  }
}

export class Model<T> {
  transform = new Transform()

  constructor(public meshes: ModelMesh<T>[] = []) { }

  draw() {
    for (let mesh of this.meshes) {
      mesh.draw()
    }
  }
}