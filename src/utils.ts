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

export class Sheep3DTypeError extends TypeError {
  constructor(message: string) {
    super(`Sheep 3D: ${message}`)
  }
}

export class Pool<T> {
  private _items: T[] = []
  private _index = 0

  /**
   * Creates a new pool with the given number of items.
   */
  constructor(ctor: { new (): T }, n: number) {
    for (let i = 0; i < n; i++) {
      this._items.push(new ctor())
    }
  }

  /**
   * Returns the next item in the pool.
   */
  next() {
    this._index = this._index % this._items.length
    return this._items[this._index++]
  }
}