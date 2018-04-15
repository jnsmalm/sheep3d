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

import { Transform } from "./transform";
import { Pool } from "./utils";
import { Angle, Vector3, Matrix4 } from "./math";

let vector = new Pool(Vector3, 10)
let matrix = new Pool(Matrix4, 10)

export class Camera {
  transform = new Transform()

  /**
   * Creates a new camera.
   */
  constructor(public aspectRatio: number, public near = 0.1, public far = 1000, public fieldOfView = 45, public orthographic = false, public orthographicSize = 5) { }

  /**
   * Creates a new camera.
   */
  static createDefault(view: HTMLCanvasElement, orthographic = false) {
    let camera = new Camera(
      view.width / view.height, 0.1, 1000, 45, orthographic)
    camera.transform.position.z = 5
    camera.transform.rotation.rotateY(180)
    return camera
  }

  getProjectionViewWorld(world: Matrix4, out = new Matrix4()) {
    let projectionView = Matrix4.multiply(
      this.getProjection(matrix.next()), this.getView(matrix.next()), matrix.next())
    return Matrix4.multiply(projectionView, world, out)
  }

  /**
   * Returns the projection matrix.
   */
  getProjection(out = new Matrix4()) {
    return Matrix4.perspective(
      Angle.deg2rad * this.fieldOfView, this.aspectRatio, this.near, this.far, out)
  }

  /**
   * Returns the view matrix.
   */
  getView(out = new Matrix4()) {
    let world = this.transform.getWorldMatrix(matrix.next())
    let position = this.transform.getWorldPosition(vector.next()) 
    let center = Vector3.add(
      position, Matrix4.forward(world, vector.next()), vector.next())
    return Matrix4.lookAt(
      position, center, Matrix4.up(world, vector.next()), out)
  }
}