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

import { Mesh, ModelMesh, Model, MeshShader } from "./model"
import { Matrix4 } from "./math"
import { Transform } from "./transform";
import { Texture2D } from "./texture";

function request(url: string, callback: (scene: any) => void) {
  var request = new XMLHttpRequest()
  request.overrideMimeType("application/json")
  request.open("GET", url, true)
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      callback(JSON.parse(request.responseText))
    }
  }
  request.send()
}

function readTransformation(transformation: number[]) {
  let matrix = new Matrix4()
  for (var i = 0; i < 16; i++) {
    matrix[i] = transformation[i]
  }
  return Matrix4.transpose(matrix)
}

export interface AssimpMaterialConverter<T> {
  convert(material: any): T
}

export module Assimp {
  export function loadModel(gl: WebGLRenderingContext, url: string, shader: MeshShader<AssimpShaderMaterial>) {
    let model = new Model<AssimpShaderMaterial>()
    request(url, scene => {
      let reader = new AssimpReader<AssimpShaderMaterial>(gl, shader, scene)
      model.meshes.push(...reader.readNodeHierarchy(scene.rootNode,  
        new AssimpShaderMaterialConverter(gl), model.transform))
    })
    return model
  }
}

class AssimpReader<T> {
  constructor(readonly gl: WebGLRenderingContext, readonly shader: MeshShader<T>, readonly scene: any) { }

  readNodeHierarchy(node: any, materialConverter: AssimpMaterialConverter<T>, parentTransform: Transform) {
    let meshes: ModelMesh<T>[] = []

    let nodeTransformation =
      readTransformation(node.transformation)

    if (node.meshes) {
      for (var i = 0; i < node.meshes.length; i++) {
        let mesh = this.readMesh(
          this.scene.meshes[node.meshes[i]], materialConverter)
        for (let j = 0; j < 16; j++) {
          mesh.transform[j] = nodeTransformation[j]
        }
        mesh.transform.parent = parentTransform
        parentTransform = mesh.transform
        meshes.push(mesh)
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        let meshChildren = this.readNodeHierarchy(node.children[i], materialConverter, parentTransform)
        meshes.push(...meshChildren)
      }
    }
    return meshes
  }

  readMesh(data: any, materialConverter: AssimpMaterialConverter<T>) {
    let mesh = new Mesh()
    mesh.vertices = data.vertices
    mesh.textureCoords = data.textureCoords[0]
    mesh.normals = data.normals
    
    for (var i = 0; i < data.faces.length; i++) {
      mesh.faces.push(...data.faces[i])
    }
    let material =
      materialConverter.convert(this.scene.materials[data.materialIndex])
    return new ModelMesh<T>(this.gl, material, this.shader, mesh)
  }
}

export class AssimpShaderMaterialConverter implements AssimpMaterialConverter<AssimpShaderMaterial> {
  constructor(private gl: WebGLRenderingContext) { }

  convert(material: any): AssimpShaderMaterial {
    let shaderMaterial = new AssimpShaderMaterial()

    for (let prop of material.properties) {
      switch (prop.key) {
        case "$clr.diffuse": {
          shaderMaterial.diffuseColor = [
            prop.value[0], prop.value[1], prop.value[2]
          ]
          break
        }
        case "$tex.file": {
          shaderMaterial.diffuse = new Texture2D(this.gl, prop.value)
        }
      }
    }
    return shaderMaterial
  }
}

export class AssimpShaderMaterial {
  diffuse: Texture2D | null = null
  diffuseColor: number[] = [1, 1, 1]
}