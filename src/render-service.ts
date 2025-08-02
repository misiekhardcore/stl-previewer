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
  DirectionalLight,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  Color,
  Mesh,
  Object3D,
  PCFSoftShadowMap,
} from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { degToRad } from "three/src/math/MathUtils.js";
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

export interface StateManager {
  getState: () => RenderState;
  setState: (s: RenderState) => void;
}

export class RenderService {
  private static instance: RenderService;

  static colors = {
    BACKGROUND: 0xa9b5bf,
    SKY: 0xa9b5bf,
    DEFAULT: 0x999999,
    GRID: 0x111111,
    LIGHT: 0xffffff,
  };

  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: TrackballControls;
  private meshes = new Map<string, Mesh>();
  private loader: STLLoader;

  constructor(
    private readonly viewerElement: HTMLElement,
    private readonly stateManager: StateManager,
    private readonly data: string[],
    private readonly settings: Settings
  ) {
    this.loader = new STLLoader();
    this.renderer = this.createRenderer();
    this.viewerElement.appendChild(this.renderer.domElement);

    this.scene = this.createScene();
    this.camera = this.createCamera(
      this.stateManager.getState().cameraPosition
    );
    this.createLights();
    this.createMeshes();
    this.controls = this.createControls(
      this.renderer,
      this.camera,
      this.getFirstMesh()
    );

    if (!this.stateManager.getState().cameraPosition) {
      this.setCameraPosition({});
    }

    if (this.settings.grid.enable) {
      this.createGrid();
    }

    this.createExtras();

    this.update();
  }

  getCamera = () => this.camera;

  hasMesh = (id: string) => this.meshes.has(id);

  getMesh = (id: string) => {
    const key = ContentService.stringToKey(id);
    return this.meshes.get(key) ?? null;
  };

  getFirstMesh = () =>
    this.meshes.get(ContentService.stringToKey(this.data[0]))!;

  private createRenderer = () => {
    const { width, height } =
      this.viewerElement.getBoundingClientRect();
    const renderer = new WebGLRenderer({
      antialias: true,
    });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    return renderer;
  };

  private createScene = () => {
    const scene = new Scene();
    scene.background = new Color(RenderService.colors.BACKGROUND);

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
    {
      position = "isometric",
      mesh,
    }: {
      position?: "isometric" | "top" | "left" | "right" | "bottom";
      mesh?: Mesh;
    } = {
      position: "isometric",
    }
  ) => {
    const { viewOffset } = this.settings.view;

    const boundingBox = RenderService.getBoundingBoxForMesh(
      mesh || this.getFirstMesh()
    );
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

    const boundingBox = RenderService.getBoundingBoxForMesh(mesh);

    const meshCenter = boundingBox.getCenter(new Vector3(0, 0, 0));
    camera.lookAt(meshCenter);
    controls.target = meshCenter;

    controls.update();

    return controls;
  };

  private createLights = () => {
    const hemisphereLight = new HemisphereLight(
      RenderService.colors.SKY,
      RenderService.colors.BACKGROUND,
      0.6
    );
    const directionalLight = new DirectionalLight(
      RenderService.colors.LIGHT,
      1
    );
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;

    const lights = [hemisphereLight, directionalLight];

    for (let i = 0; i < lights.length; i += 1) {
      this.scene.add(lights[i]);
    }

    return lights;
  };

  public static getMaterial = (
    materialConfig: MeshMaterialSettings
  ) => {
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
    const boundingBox = RenderService.getBoundingBoxForMesh(
      this.getFirstMesh()
    );
    const size =
      Math.ceil(
        Math.max(
          Math.abs(boundingBox.max.x),
          Math.abs(boundingBox.min.x),
          Math.abs(boundingBox.max.y),
          Math.abs(boundingBox.min.y)
        ) / 5
      ) * 10;

    const color = !this.settings.grid.color
      ? RenderService.colors.GRID
      : this.settings.grid.color;
    const gridHelper = new GridHelper(size, size / 5, color, color);
    this.renderObject(gridHelper.rotateX(degToRad(90)));

    return gridHelper;
  };

  private getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  private createMeshes = () => {
    this.data.forEach((dataItem) => {
      const geometry = this.loader.parse(
        ContentService.base64ToArrayBuffer(dataItem)
      );

      // Center the geometry to origin (0,0,0) before creating the mesh
      geometry.center();

      const material = RenderService.getMaterial(
        this.getMaterialConfig()
      );
      const mesh = new Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.meshes.set(ContentService.stringToKey(dataItem), mesh);
    });
  };

  private getMaterialConfig = (): MeshMaterialSettings => {
    const dataCount = this.data.length;

    return {
      ...this.settings.meshMaterial,
      config: {
        ...this.settings.meshMaterial.config,
        // @ts-expect-error color type mismatch
        color:
          dataCount > 1
            ? this.getRandomColor()
            : RenderService.colors.DEFAULT,
        transparent: dataCount > 1,
        opacity: dataCount > 1 ? 0.5 : 1,
      },
    };
  };

  renderObject = (...objects: Object3D[]) => {
    this.scene.add(...objects);
  };

  static getBoundingBoxForMesh = (mesh: Mesh) => {
    const boundingBox = new Box3();
    boundingBox.setFromObject(mesh);
    return boundingBox;
  };

  static getBoundingBoxSize = (boundingBox: Box3) =>
    boundingBox.getSize(new Vector3(0, 0, 0));

  private createExtras = () => {
    const boundingBox = RenderService.getBoundingBoxForMesh(
      this.getFirstMesh()
    );

    if (this.settings.view.showAxes) {
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
      this.renderObject(axesHelper);
    }

    if (this.settings.view.showBoundingBox) {
      const meshBoxHelper = new Box3Helper(boundingBox, 0xffff00);
      this.renderObject(meshBoxHelper);
    }
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

    this.stateManager.setState({
      ...this.stateManager.getState(),
      cameraPosition: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
    });
  };

  static createInstance = (
    viewerElement: HTMLElement,
    stateManager: StateManager,
    data: string[],
    settings: Settings
  ) => {
    RenderService.instance = new RenderService(
      viewerElement,
      stateManager,
      data,
      settings
    );

    return RenderService.instance;
  };

  static getInstance = () => RenderService.instance;
}
