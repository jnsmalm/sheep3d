# Sheep 3D

JavaScript library for drawing and animating 3D models.

## Getting started

```
var app = new SHEEP3D.Application()
document.body.appendChild(app.view)

var camera = SHEEP3D.Camera.createDefault(app.view)
camera.transform.position.z = 75

var model = SHEEP3D.Assimp.loadModel(app.gl, "assets/ship.fbx.json",
  shader = new SHEEP3D.BasicShader(app.gl, camera))

app.draw = () => {
  model.draw()
}

app.update = () => {
  model.transform.rotation.rotateY(0.5)
}
```

## Development

```
npm run dev
```

## Build

```
npm run build
```
