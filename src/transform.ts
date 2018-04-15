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

import { Vector3, Quaternion, Matrix4 } from "./math"

export class Transform extends Matrix4 {
  parent: Transform | null = null

  private _position = new Vector3()
  private _scale = new Vector3(1, 1, 1)
  private _rotation = Quaternion.identity()

  get position() {
    return this._position
  }

  set position(value: Vector3) {
    value.copy(this._position)
  }

  get scale() {
    return this._scale
  }

  set scale(value: Vector3) {
    value.copy(this._scale)
  }

  get rotation() {
    return this._rotation
  }

  set rotation(value: Quaternion) {
    value.copy(this._rotation)
  }

  /** 
   * Returns the position in world-space.
   */
  getWorldPosition(out = new Vector3()): Vector3 {
    if (this.parent) {
      let parent = this.parent.getWorldPosition(out)
      return Vector3.add(parent, this._position, out)
    }
    return this._position.copy(out)
  }

  /**
   * Returns the world matrix.
   */
  getWorldMatrix(out = new Matrix4()): Matrix4 {
    let local = Matrix4.fromRotationTranslationScale(
      this._rotation, this._position, this._scale, out)
    local = Matrix4.multiply(this, local)
    if (!this.parent) {
      return local
    }
    let parent = this.parent.getWorldMatrix(out)
    return Matrix4.multiply(parent, local, out)
  }
}