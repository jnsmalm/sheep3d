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

import { vec3, mat3, mat4, quat } from "gl-matrix"

export namespace Angle {
  /**
   * Degrees-to-radians conversion constant.
   */
  export const deg2rad = (Math.PI * 2) / 360
  /**
   * Radians-to-degrees conversion constant.
   */
  export const rad2deg = 360 / (Math.PI * 2)
}

export type Vector3Like = Float32Array | Array<number>

export class Vector2 extends Float32Array {
  constructor(x = 0, y = 0) {
    super([x, y])
  }

  get x() {
    return this[0]
  }

  set x(x: number) {
    this[0] = x
  }

  get y() {
    return this[1]
  }

  set y(y: number) {
    this[1] = y
  }
}

export class Vector3 extends Float32Array {
  private typeVec3 = 0

  constructor(x = 0, y = 0, z = 0) {
    super([x, y, z])
  }

  get x() {
    return this[0]
  }

  set x(x: number) {
    this[0] = x
  }

  get y() {
    return this[1]
  }

  set y(y: number) {
    this[1] = y
  }

  get z() {
    return this[2]
  }

  set z(z: number) {
    this[2] = z
  }

  /**
   * Adds two vectors.
   */
  static add(a: Vector3, b: Vector3, out = new Vector3()) {
    return <Vector3>vec3.add(out, a, b)
  }

  /**
   * Copies the vector.
   */
  copy(out = new Vector3()) {
    return <Vector3>vec3.copy(out, this)
  }
}

export class Matrix3 extends Float32Array {
  constructor() {
    super(9)
  }

  static fromMatrix4(value: Matrix4, out = new Matrix3()) {
    return <Matrix3>mat3.fromMat4(out, value)
  }
} 

export class Matrix4 extends Float32Array {
  constructor() {
    super(16)
    Matrix4.identity(this)
  }

  static identity(out = new Matrix4()) {
    return <Matrix4>mat4.identity(out)
  }

  static lookAt(eye: Vector3, center: Vector3, up: Vector3, out = new Matrix4()) {
    return <Matrix4>mat4.lookAt(out, eye, center, up)
  }

  static perspective(fovy: number, aspect: number, near: number, far: number, out = new Matrix4()) {
    return <Matrix4>mat4.perspective(out, fovy, aspect, near, far)
  }

  static multiply(a: Matrix4, b: Matrix4, out = new Matrix4()) {
    return <Matrix4>mat4.multiply(out, a, b)
  }

  static fromRotationTranslationScale(rotation: Quaternion, position: Vector3, scale: Vector3, out = new Matrix4()) {
    return <Matrix4>mat4.fromRotationTranslationScale(out, rotation, position, scale)
  }

  static forward(matrix: Matrix4, out = new Vector3()) {
    return <Vector3>vec3.set(out, matrix[8], matrix[9], matrix[10])
  }

  static up(matrix: Matrix4, out = new Vector3()) {
    return <Vector3>vec3.set(out, matrix[4], matrix[5], matrix[6])
  }

  static right(matrix: Matrix4, out = new Vector3()) {
    return <Vector3>vec3.set(out, matrix[0], matrix[1], matrix[2])
  }

  static invert(value: Matrix4, out = new Matrix4()) {
    return <Matrix4>mat4.invert(out, value)
  }

  static transpose(value: Matrix4, out = new Matrix4()) {
    return <Matrix4>mat4.transpose(out, value)
  }


  
} 

export class Quaternion extends Float32Array {
  constructor() {
    super(4)
  }

  static identity(out = new Quaternion()) {
    return <Quaternion>quat.identity(out)
  }

  rotateX(degrees: number) {
    quat.rotateX(this, this, degrees * Angle.deg2rad)
  }

  rotateY(degrees: number) {
    quat.rotateY(this, this, degrees * Angle.deg2rad)
  }

  rotateZ(degrees: number) {
    quat.rotateZ(this, this, degrees * Angle.deg2rad)
  }

  copy(out = new Quaternion()) {
    quat.copy(out, this)
  }
} 