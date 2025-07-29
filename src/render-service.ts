import {
  WebGLRenderer,
  SRGBColorSpace,
  Scene,
  PerspectiveCamera,
  Vector3,
  Box3,
  GridHelper,
  AxesHelper,
  Box3Helper,
  HemisphereLight,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  Color,
  Mesh,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { WebviewApi } from "vscode-webview";
import {
  MeshMaterialSettings,
  MeshMaterialType,
  Settings,
} from "./types/settings";
import { ContentService } from "./content-service";

export interface RenderState {
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
}

export class RenderService {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: TrackballControls;
  private lights: HemisphereLight[];
  private meshes: Mesh[];

  constructor(
    private readonly viewerElement: HTMLElement,
    private readonly webviewApi: WebviewApi<RenderState>,
    private readonly data: string[],
    private readonly settings: Settings
  ) {
    this.renderer = this.createRenderer();
    this.viewerElement.appendChild(this.renderer.domElement);

    this.scene = this.createScene();
    this.camera = this.createCamera(
      this.getStateManager().getState().cameraPosition
    );
    this.lights = this.createLights();
    this.meshes = this.createMeshes();
    this.controls = this.createControls(
      this.renderer,
      this.camera,
      this.meshes[0]
    );

    if (!this.getStateManager().getState().cameraPosition) {
      this.setCameraPosition();
    }

    if (this.settings.grid.enable) {
      this.createGrid();
    }

    this.createExtras();

    this.update();
  }

  getCamera = () => this.camera;

  getRenderer = () => this.renderer;

  getScene = () => this.scene;

  getMeshes = () => this.meshes;

  getLights = () => this.lights;

  getControls = () => this.controls;

  getData = () => this.data;

  getSettings = () => this.settings;

  private createRenderer = () => {
    const { width, height } =
      this.viewerElement.getBoundingClientRect();
    const renderer = new WebGLRenderer({
      antialias: true,
    });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setSize(width, height);

    return renderer;
  };

  private createScene = () => {
    const scene = new Scene();
    scene.background = new Color(0xa9b5bf);

    return scene;
  };

  private createCamera = (
    cameraPosition: RenderState["cameraPosition"]
  ) => {
    const { width, height } =
      this.viewerElement.getBoundingClientRect();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);

    camera.up = new Vector3(0, 0, 1);

    if (cameraPosition) {
      camera.position.x = cameraPosition.x;
      camera.position.y = cameraPosition.y;
      camera.position.z = cameraPosition.z;
    }

    return camera;
  };

  setCameraPosition = (
    position:
      | "isometric"
      | "top"
      | "left"
      | "right"
      | "bottom" = "isometric"
  ) => {
    const { viewOffset } = this.settings.view;

    const boundingBox = this.getMeshBoundingBox(this.meshes[0]);
    const dimensions = boundingBox.getSize(new Vector3(0, 0, 0));

    this.controls.reset();

    switch (position) {
      case "top":
        // TODO: for some reason, 0 messes up the view, to investigate further
        this.camera.position.set(
          0,
          -0.001,
          boundingBox.max.z + viewOffset
        );
        break;
      case "left":
        this.camera.position.set(
          -(boundingBox.max.x + viewOffset),
          0,
          dimensions.z / 2
        );
        break;
      case "right":
        this.camera.position.set(
          boundingBox.max.x + viewOffset,
          0,
          dimensions.z / 2
        );
        break;
      case "bottom":
        // TODO: for some reason, 0 messes up the view, to investigate further
        this.camera.position.set(
          0,
          -0.001,
          -(boundingBox.max.z + viewOffset)
        );
        break;
      case "isometric":
      default: {
        // find the biggest dimension so we can offset it
        let dimension =
          dimensions.z > dimensions.x ? dimensions.z : dimensions.x;
        dimension = boundingBox.max.z;

        this.camera.position.set(
          dimension + viewOffset / 2,
          dimension + viewOffset / 2,
          dimension + viewOffset / 2
        );
        break;
      }
    }

    // make sure we are looking at the mesh
    const meshCenter = boundingBox.getCenter(new Vector3(0, 0, 0));
    this.camera.lookAt(meshCenter);
    this.controls.target = meshCenter;

    this.controls.update();
  };

  private createControls = (
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    mesh: Mesh
  ) => {
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.panSpeed = 2;
    controls.rotateSpeed = 5;

    const boundingBox = this.getMeshBoundingBox(mesh);

    const meshCenter = boundingBox.getCenter(new Vector3(0, 0, 0));
    camera.lookAt(meshCenter);
    controls.target = meshCenter;

    controls.update();

    return controls;
  };

  private createLights = () => {
    const lights = [new HemisphereLight(0xffffbb, 0xf0f0f0, 2.5)];
    for (let i = 0; i < lights.length; i += 1) {
      this.scene.add(lights[i]);
    }

    return lights;
  };

  private getMaterial = (materialConfig: MeshMaterialSettings) => {
    switch (materialConfig.type) {
      case MeshMaterialType.BASIC:
        return new MeshBasicMaterial(materialConfig.config);
      case MeshMaterialType.STANDARD:
        return new MeshStandardMaterial(materialConfig.config);
      case MeshMaterialType.NORMAL:
        return new MeshNormalMaterial(materialConfig.config);
      case MeshMaterialType.PHONG:
        return new MeshPhongMaterial(materialConfig.config);
      case MeshMaterialType.LAMBERT:
      default:
        return new MeshLambertMaterial(materialConfig.config);
    }
  };

  private createGrid = () => {
    const settings = this.getSettings();
    const boundingBox = this.getMeshBoundingBox(this.meshes[0]);
    const size =
      Math.ceil(
        Math.max(
          Math.abs(boundingBox.max.x),
          Math.abs(boundingBox.min.x),
          Math.abs(boundingBox.max.y),
          Math.abs(boundingBox.min.y)
        ) / 5
      ) * 10;

    const color = !settings.grid.color ? "#111" : settings.grid.color;
    const gridHelper = new GridHelper(size, size / 5, color, color);
    this.scene.add(gridHelper.rotateX(degToRad(90)));

    return gridHelper;
  };

  private getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  private createMeshes = () => {
    const loader = new STLLoader();
    const settings = this.getSettings();
    const data = this.getData();
    const geometries = data.map((d) =>
      loader.parse(ContentService.base64ToArrayBuffer(d))
    );

    const meshes = geometries.map((g) => {
      const material = this.getMaterial({
        ...settings.meshMaterial,
        config: {
          ...settings.meshMaterial.config,
          // @ts-expect-error color type mismatch
          color:
            geometries.length > 1 ? this.getRandomColor() : undefined,
          transparent: geometries.length > 1,
          opacity: geometries.length > 1 ? 0.5 : 1,
        },
      });
      return new Mesh(g, material);
    });
    meshes.forEach((m) => this.scene.add(m));

    return meshes;
  };

  getMeshBoundingBox = (mesh: Mesh) => {
    const boundingBox = new Box3();
    boundingBox.setFromObject(mesh);
    return boundingBox;
  };

  getBoundingBoxDimensions = (boundingBox: Box3) =>
    boundingBox.getSize(new Vector3(0, 0, 0));

  private createExtras = () => {
    const boundingBox = this.getMeshBoundingBox(this.meshes[0]);
    const settings = this.getSettings();

    if (settings.view.showAxes) {
      const size =
        Math.ceil(
          Math.max(
            Math.abs(boundingBox.max.x),
            Math.abs(boundingBox.min.x),
            Math.abs(boundingBox.max.y),
            Math.abs(boundingBox.min.y)
          ) / 5
        ) * 10;

      const axesHelper = new AxesHelper(size);
      this.scene.add(axesHelper);
    }

    if (settings.view.showBoundingBox) {
      const meshBoxHelper = new Box3Helper(boundingBox, 0xffff00);
      this.scene.add(meshBoxHelper);
    }
  };

  getStateManager = () => {
    return {
      getState: (): RenderState => {
        return this.webviewApi.getState() || {};
      },
      setState: (s: RenderState) => {
        this.webviewApi.setState(s);
      },
    };
  };

  onWindowResize = () => {
    const { width, height } =
      this.viewerElement.getBoundingClientRect();

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  update = () => {
    requestAnimationFrame(() => this.update());

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.getStateManager().setState({
      ...this.getStateManager().getState(),
      cameraPosition: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
    });
  };
}
