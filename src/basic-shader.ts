import { Shader, ShaderAttribute } from "./shader"
import { MeshShader, MeshShaderInput } from "./model"
import { AssimpShaderMaterial } from "./assimp"
import { Matrix3, Matrix4 } from "./math";
import { Camera } from "./camera";
import { Transform } from "./transform";

const vs = `
  precision mediump float;

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 textureCoords;

  varying vec3 vNormal;
  varying vec2 vTextureCoords;

  uniform mat4 projectionViewModel;
  uniform mat3 transposedInversedModel;

  void main(void) {
    gl_Position = projectionViewModel * vec4(position,1.0);
    vTextureCoords = textureCoords;
    vNormal = transposedInversedModel * normal;
  }`

const fs = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec2 vTextureCoords;

  uniform sampler2D sampler;

  void main(void) {
    // calc the dot product and clamp
    // 0 -> 1 rather than -1 -> 1
    vec3 light = vec3(1,0.1,1);
      
    // ensure it's normalized
    light = normalize(light);
  
    // calculate the dot product of
    // the light to the vertex normal
    float dProd = max(0.0, dot(vNormal, light));

    vec4 c = texture2D(sampler, vec2(vTextureCoords.x, 1.0 - vTextureCoords.y));
  
    // feed into our frag colour
    gl_FragColor = vec4(dProd * c.r, dProd * c.g, dProd * c.b, 1.0);
  }`;

export class BasicShader extends Shader implements MeshShader<AssimpShaderMaterial> {
  constructor(gl: WebGLRenderingContext, readonly camera: Camera) {
    super(gl, vs, fs, [
      ShaderAttribute.vec3("position"),
      ShaderAttribute.vec3("normal"),
      ShaderAttribute.vec2("textureCoords")
    ])
  }

  get input() {
    return [
      MeshShaderInput.Position,
      MeshShaderInput.Normal,
      MeshShaderInput.TextureCoordinate
    ]
  }

  setup(material: AssimpShaderMaterial, transform: Transform) {
    this.setUniformMatrix4("projectionViewModel", 
      this.camera.getProjectionViewWorld(transform.getWorldMatrix()))

    let inversedModel = Matrix4.invert(transform.getWorldMatrix())
    let transposedInversedModel = Matrix4.transpose(inversedModel)
    
    this.setUniformMatrix3("transposedInversedModel", 
      Matrix3.fromMatrix4(transposedInversedModel))

    if (material.diffuse) {
      material.diffuse.use()
    }
  }
}