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
  updateState: (s: Partial<RenderState>) => void;
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
  private loader: STLLoader;
  private cameraFocusMesh: Mesh | undefined;

  static createInstance = (
    viewerElement: HTMLElement,
    stateManager: StateManager,
    settings: Settings
  ) => {
    RenderService.instance = new RenderService(
      viewerElement,
      stateManager,
      settings
    );

    return RenderService.instance;
  };

  static getInstance = () => RenderService.instance;

  private constructor(
    private _viewerElement: HTMLElement,
    private readonly stateManager: StateManager,
    private readonly settings: Settings
  ) {
    this.loader = new STLLoader();
    this.renderer = this.createRenderer();
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.viewerElement = _viewerElement;
    this.viewerElement.appendChild(this.renderer.domElement);

    this.renderObject(...this.createLights());
    this.controls = this.createControls();

    this.update();
  }

  get viewerElement() {
    if (!this._viewerElement) {
      throw new Error("Viewer element not found");
    }
    return this._viewerElement;
  }

  set viewerElement(element: HTMLElement) {
    this._viewerElement = element;
    this.updateCamera(element);
  }

  getCamera = () => this.camera;

  getFocusedMesh = () => this.cameraFocusMesh;

  private createRenderer = () => {
    const renderer = new WebGLRenderer({
      antialias: true,
    });
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    return renderer;
  };

  private createScene = () => {
    const scene = new Scene();
    scene.background = new Color(RenderService.colors.BACKGROUND);

    return scene;
  };

  private createCamera = () => {
    const { cameraPosition } = this.stateManager.getState();
    const camera = new PerspectiveCamera(75, undefined);

    camera.up = new Vector3(0, 0, 1);

    if (cameraPosition) {
      camera.position.x = cameraPosition.x;
      camera.position.y = cameraPosition.y;
      camera.position.z = cameraPosition.z;
    }

    return camera;
  };

  setCameraPosition = ({
    position = "isometric",
    mesh,
  }: {
    position?: "isometric" | "top" | "left" | "right" | "bottom";
    mesh?: Mesh | undefined;
  }) => {
    const { viewOffset } = this.settings.view;

    if (mesh) {
      this.cameraFocusMesh = mesh;
    } else {
      mesh = this.cameraFocusMesh;
    }

    if (!mesh) {
      throw new Error("No mesh to focus on");
    }

    const boundingBox = RenderService.getBoundingBoxForMesh(mesh);

    const cameraPosition = this.getCameraPosition(
      position,
      boundingBox,
      viewOffset
    );
    const maxDistance =
      Math.max(
        Math.abs(cameraPosition.x),
        Math.abs(cameraPosition.y),
        Math.abs(cameraPosition.z)
      ) * 2;

    this.camera.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );

    this.camera.near = 0.1;
    this.camera.far = maxDistance;

    // make sure we are looking at the mesh
    const meshCenter = boundingBox.getCenter(new Vector3(0, 0, 0));

    if (this.controls) {
      this.controls.target = meshCenter;
      this.controls.maxDistance = maxDistance;
      this.controls.update();
    }
    this.camera.lookAt(meshCenter);
  };

  private getCameraPosition = (
    position: "isometric" | "top" | "left" | "right" | "bottom",
    boundingBox: Box3,
    viewOffset: number
  ): Vector3 => {
    const dimensions = boundingBox.getSize(new Vector3(0, 0, 0));
    const { max } = boundingBox;
    const maxX = Math.max(Math.abs(dimensions.x), Math.abs(max.x));
    const maxY = Math.max(Math.abs(dimensions.y), Math.abs(max.y));
    const maxZ = Math.max(Math.abs(dimensions.z), Math.abs(max.z));

    const offsetMultiplier = 1.2;

    switch (position) {
      case "top":
        return new Vector3(
          0,
          -0.001,
          Math.max(maxX, maxY) * offsetMultiplier + viewOffset
        );
      case "left":
        return new Vector3(
          -(Math.max(maxY, maxZ) * offsetMultiplier + viewOffset),
          0,
          maxZ
        );

      case "right":
        return new Vector3(
          Math.max(maxY, maxZ) * offsetMultiplier + viewOffset,
          0,
          maxZ
        );

      case "bottom":
        return new Vector3(
          0,
          -0.001,
          -(Math.max(maxX, maxY) * offsetMultiplier + viewOffset)
        );

      case "isometric":
      default:
        return new Vector3(
          maxX * offsetMultiplier + viewOffset,
          maxY * offsetMultiplier + viewOffset,
          maxZ * offsetMultiplier + viewOffset
        );
    }
  };

  private createControls = () => {
    const controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    controls.panSpeed = 2;
    controls.rotateSpeed = 5;

    const meshCenter = new Vector3(0, 0, 0);

    this.camera.lookAt(meshCenter);
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

  private createGrid = (mesh: Mesh) => {
    const boundingBox = RenderService.getBoundingBoxForMesh(mesh);
    const GRID_CELL_SIZE = 5;
    const GRID_PADDING_FACTOR = 1.5;

    const maxDimension =
      Math.max(
        Math.abs(boundingBox.max.x),
        Math.abs(boundingBox.min.x),
        Math.abs(boundingBox.max.y),
        Math.abs(boundingBox.min.y)
      ) * 2;

    const size = Math.ceil(maxDimension * GRID_PADDING_FACTOR);
    const divisions = Math.ceil(size / GRID_CELL_SIZE);

    const color = !this.settings.grid.color
      ? RenderService.colors.GRID
      : this.settings.grid.color;
    const gridHelper = new GridHelper(size, divisions, color, color);
    this.renderObject(gridHelper.rotateX(degToRad(90)));

    return gridHelper;
  };

  createMesh = (
    dataItem: string,
    settings?: MeshMaterialSettings
  ): Promise<Mesh> => {
    return new Promise((resolve) => {
      const geometry = this.parseGeometry(dataItem);
      const material = RenderService.getMaterial(
        this.getMaterialSettings(settings)
      );

      // Center the geometry to origin (0,0,0) before creating the mesh
      geometry.center();

      const mesh = new Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      resolve(mesh);
    });
  };

  private parseGeometry = (dataItem: string) => {
    const geometry = this.loader.parse(
      ContentService.base64ToArrayBuffer(dataItem)
    );
    return geometry;
  };

  public getMaterialSettings = (
    config?: Partial<MeshMaterialSettings>
  ): MeshMaterialSettings => {
    return {
      ...this.settings.meshMaterial,
      ...config,
      config: {
        color: RenderService.colors.DEFAULT,
        ...this.settings.meshMaterial.config,
        ...config?.config,
      },
    } as MeshMaterialSettings;
  };

  public renderObject = (...objects: Object3D[]) => {
    this.scene.add(...objects);
  };

  static getBoundingBoxForMesh = (mesh: Mesh) => {
    const boundingBox = new Box3();
    boundingBox.setFromObject(mesh);
    return boundingBox;
  };

  static getBoundingBoxSize = (boundingBox: Box3) =>
    boundingBox.getSize(new Vector3(0, 0, 0));

  public createExtras = (mesh: Mesh) => {
    const boundingBox = RenderService.getBoundingBoxForMesh(mesh);

    if (this.settings.grid.enable) {
      this.createGrid(mesh);
    }

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

  private updateCamera = (viewerElement: HTMLElement) => {
    const { width, height } = viewerElement.getBoundingClientRect();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  onWindowResize = () => {
    this.updateCamera(this.viewerElement);
  };

  private update = () => {
    requestAnimationFrame(() => this.update());

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    this.stateManager.updateState({
      cameraPosition: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
    });
  };
}
