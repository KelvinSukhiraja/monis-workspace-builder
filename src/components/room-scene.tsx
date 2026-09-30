"use client";

import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Configuration, selectedProducts, type Category } from "@/lib/catalog";
import { ProductArt } from "./product-art";

type Vec3 = [number, number, number];
type RoomProps = {
  config: Configuration;
  zoom: number;
  resetView: number;
  onSelectCategory: (category: Category) => void;
};

function Box({
  position = [0, 0, 0],
  size,
  color,
  radius = 0.015,
  rotation = [0, 0, 0],
}: {
  position?: Vec3;
  size: Vec3;
  color: string;
  radius?: number;
  rotation?: Vec3;
}) {
  return (
    <RoundedBox
      position={position}
      args={size}
      radius={radius}
      smoothness={2}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.78} />
    </RoundedBox>
  );
}
function Cylinder({
  position,
  radius,
  height,
  color,
  rotation = [0, 0, 0],
}: {
  position: Vec3;
  radius: number;
  height: number;
  color: string;
  rotation?: Vec3;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 20]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
function Rod({
  start,
  end,
  radius = 0.025,
  color,
}: {
  start: Vec3;
  end: Vec3;
  radius?: number;
  color: string;
}) {
  const a = new THREE.Vector3(...start),
    b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  return (
    <mesh
      position={a.add(b).multiplyScalar(0.5)}
      quaternion={quaternion}
      castShadow
    >
      <cylinderGeometry args={[radius, radius, direction.length(), 10]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
function Arrive({
  children,
  reducedMotion,
}: {
  children: ReactNode;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const progress = useRef(reducedMotion ? 1 : 0);
  useEffect(() => {
    if (reducedMotion) progress.current = 1;
    invalidate();
  }, [reducedMotion, invalidate]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    progress.current = Math.min(1, progress.current + dt * 2.7);
    const t = 1 - Math.pow(1 - progress.current, 3);
    ref.current.scale.setScalar(0.85 + 0.15 * t);
    ref.current.position.y = (1 - t) * 0.3;
    if (progress.current < 1) invalidate();
  });
  return <group ref={ref}>{children}</group>;
}

function Desk({ walnut }: { walnut: boolean }) {
  const wood = walnut ? "#745039" : "#c89f6b";
  const legs = walnut ? "#5e4434" : "#deddd0";
  const width = walnut ? 2.7 : 2.45;
  return (
    <group position={[0, 0, -0.5]}>
      <Box
        position={[0, 1.4, 0]}
        size={[width, 0.095, 1.12]}
        color={wood}
        radius={0.035}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          position={[0, 1.449, -0.46 + i * 0.18]}
          size={[width - 0.08, 0.001, 0.003]}
          color={walnut ? "#654630" : "#b98f5e"}
          radius={0}
        />
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (width / 2 - 0.22), 0, 0]}>
          <Box
            position={[0, 0.71, 0]}
            size={[0.105, 1.31, 0.11]}
            color={legs}
          />
          {!walnut && (
            <Box position={[0, 0.55, 0]} size={[0.13, 1, 0.135]} color={legs} />
          )}
          <Box
            position={[0, 0.09, 0]}
            size={[0.14, 0.09, 0.9]}
            color={legs}
            radius={0.035}
          />
        </group>
      ))}
      <Box
        position={[0, 1.2, 0.02]}
        size={[width - 0.4, 0.08, 0.06]}
        color={legs}
      />
      {!walnut && (
        <Box
          position={[0.8, 1.33, 0.48]}
          size={[0.2, 0.045, 0.075]}
          color="#333931"
        />
      )}
    </group>
  );
}

function Chair({ studio }: { studio: boolean }) {
  const body = studio ? "#c7b9a3" : "#3d423b";
  const base = studio ? "#8a887d" : "#393d37";
  return (
    <group position={[0.1, 0, 0.65]} rotation={[0, -0.13, 0]}>
      <Cylinder
        position={[0, 0.35, 0]}
        height={0.45}
        radius={0.045}
        color="#a6a79d"
      />
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.sin(angle) * 0.4,
          z = Math.cos(angle) * 0.4;
        return (
          <group key={i}>
            <Rod
              start={[0, 0.18, 0]}
              end={[x, 0.09, z]}
              color={base}
              radius={0.03}
            />
            <Cylinder
              position={[x, 0.065, z]}
              radius={0.06}
              height={0.07}
              color="#33362f"
              rotation={[Math.PI / 2, 0, angle]}
            />
          </group>
        );
      })}
      <Box
        position={[0, 0.63, 0]}
        size={[0.68, 0.14, 0.62]}
        color={body}
        radius={0.065}
      />
      <Box
        position={[0, 1.01, 0.29]}
        size={[0.64, 0.73, studio ? 0.16 : 0.07]}
        color={body}
        radius={studio ? 0.075 : 0.03}
        rotation={[-0.1, 0, 0]}
      />
      {!studio && (
        <>
          {Array.from({ length: 15 }, (_, i) => (
            <Box
              key={i}
              position={[0, 0.72 + i * 0.037, 0.342 + i * 0.0037]}
              size={[0.55, 0.009, 0.012]}
              color="#6e7465"
              radius={0.003}
            />
          ))}
          <Box
            position={[0, 1.46, 0.32]}
            size={[0.37, 0.16, 0.1]}
            color={body}
            radius={0.045}
          />
          <Box
            position={[0, 0.85, 0.38]}
            size={[0.38, 0.12, 0.065]}
            color="#2e332c"
          />
        </>
      )}
      {[-1, 1].map((side) => (
        <group key={side}>
          <Box
            position={[side * 0.38, 0.8, 0.04]}
            size={[0.04, 0.34, 0.04]}
            color={base}
          />
          <Box
            position={[side * 0.38, 0.97, 0]}
            size={[0.095, 0.05, 0.38]}
            color={body}
            radius={0.02}
          />
        </group>
      ))}
    </group>
  );
}

function Monitor({
  position = [0, 0, 0],
  studio = false,
  small = false,
}: {
  position?: Vec3;
  studio?: boolean;
  small?: boolean;
}) {
  return (
    <group position={position} scale={small ? 0.77 : 1}>
      <Box
        position={[0, 0.025, 0]}
        size={[0.43, 0.035, 0.25]}
        color={studio ? "#c6c9c1" : "#484d43"}
      />
      <Box
        position={[0, 0.25, -0.05]}
        size={[0.07, 0.42, 0.05]}
        color={studio ? "#b9bfb5" : "#454a40"}
      />
      <Box
        position={[0, 0.55, -0.05]}
        size={[1.09, 0.64, 0.055]}
        color={studio ? "#b9bfb5" : "#30362d"}
        radius={0.02}
      />
      <mesh position={[0, 0.56, -0.018]}>
        <planeGeometry args={[1.025, 0.566]} />
        <meshStandardMaterial
          color={studio ? "#b6bba7" : "#8d9f86"}
          roughness={0.6}
          emissive="#738568"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[0, 0.46, -0.015]}>
        <planeGeometry args={[1.025, 0.32]} />
        <meshStandardMaterial color="#71826c" roughness={1} />
      </mesh>
      <mesh position={[-0.16, 0.53, -0.012]} rotation={[0, 0, 0.2]}>
        <circleGeometry args={[0.24, 3]} />
        <meshStandardMaterial color="#697963" />
      </mesh>
      <mesh position={[0.23, 0.42, -0.011]} rotation={[0, 0, -0.15]}>
        <circleGeometry args={[0.26, 3]} />
        <meshStandardMaterial color="#53674f" />
      </mesh>
    </group>
  );
}
function Plant({
  position = [-1.8, 0, -0.8],
  small = false,
}: {
  position?: Vec3;
  small?: boolean;
}) {
  return (
    <group position={position} scale={small ? 0.46 : 1}>
      <mesh position={[0, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.23, 0.17, 0.42, 32]} />
        <meshStandardMaterial color="#c4b393" roughness={1} />
      </mesh>
      <Cylinder
        position={[0, 0.421, 0]}
        radius={0.21}
        height={0.012}
        color="#5c5037"
      />
      {Array.from({ length: 9 }, (_, i) => {
        const a = i * 2.4;
        const h = 0.7 + (i % 4) * 0.19;
        const x = Math.sin(a) * 0.29,
          z = Math.cos(a) * 0.29;
        return (
          <group key={i}>
            <Rod
              start={[0, 0.4, 0]}
              end={[x, h, z]}
              radius={0.012}
              color="#596345"
            />
            <mesh
              position={[x * 1.25, h + 0.1, z * 1.25]}
              rotation={[Math.cos(a) * 0.6, a, Math.sin(a) * 0.65]}
              scale={[0.12, 0.29, 0.025]}
              castShadow
            >
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial
                color={i % 2 ? "#617448" : "#405d3a"}
                roughness={0.85}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
function Lamp() {
  return (
    <group position={[0.94, 1.455, -0.82]}>
      <Cylinder
        position={[0, 0.025, 0]}
        radius={0.13}
        height={0.035}
        color="#586148"
      />
      <Rod
        start={[0, 0.04, 0]}
        end={[0, 0.43, 0]}
        radius={0.015}
        color="#586148"
      />
      <Rod
        start={[0, 0.43, 0]}
        end={[-0.1, 0.53, 0]}
        radius={0.015}
        color="#586148"
      />
      <mesh position={[-0.1, 0.51, 0]} castShadow>
        <sphereGeometry args={[0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#566044" />
      </mesh>
      <mesh position={[-0.1, 0.51, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 24]} />
        <meshStandardMaterial
          color="#ffdf9b"
          emissive="#ffd17c"
          emissiveIntensity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight
        position={[-0.1, 0.48, 0]}
        intensity={0.3}
        color="#ffd193"
        distance={1.5}
      />
    </group>
  );
}

function Architecture() {
  return (
    <group>
      <Box
        position={[0, -0.13, 0]}
        size={[4.7, 0.25, 3.9]}
        color="#ddd0b8"
        radius={0.025}
      />
      <Box
        position={[-2.29, 1.35, -0.06]}
        size={[0.12, 2.7, 3.78]}
        color="#e5dccb"
      />
      <Box
        position={[-0.7, 1.35, -1.89]}
        size={[3.15, 2.7, 0.12]}
        color="#e9e0cf"
      />
      <Box
        position={[2.04, 1.35, -1.89]}
        size={[0.49, 2.7, 0.12]}
        color="#e9e0cf"
      />
      <Box
        position={[1.34, 0.37, -1.89]}
        size={[0.95, 0.74, 0.12]}
        color="#e9e0cf"
      />
      <Box
        position={[1.34, 2.54, -1.89]}
        size={[0.95, 0.32, 0.12]}
        color="#e9e0cf"
      />
      <Box
        position={[1.34, 0.76, -1.85]}
        size={[1.09, 0.06, 0.23]}
        color="#c5aa82"
      />
      {[-1.17, 0, 1.17].map((x) => (
        <Box
          key={x}
          position={[x, 0.001, 0]}
          size={[0.007, 0.002, 3.88]}
          color="#c9bda7"
          radius={0}
        />
      ))}
      {[-0.97, 0, 0.97].map((z) => (
        <Box
          key={z}
          position={[0, 0.001, z]}
          size={[4.68, 0.002, 0.007]}
          color="#c9bda7"
          radius={0}
        />
      ))}
      <group position={[-1.27, 1.67, -1.8]}>
        <Box size={[0.64, 0.85, 0.045]} color="#a58660" />
        <Box
          position={[0, 0, 0.026]}
          size={[0.57, 0.78, 0.012]}
          color="#f0e7d5"
        />
        <Box
          position={[0, -0.035, 0.035]}
          size={[0.37, 0.47, 0.008]}
          color="#c3a783"
        />
        <Box
          position={[-0.055, -0.13, 0.041]}
          size={[0.22, 0.27, 0.005]}
          color="#a78b68"
        />
      </group>
    </group>
  );
}

function Scene({ config, zoom, resetView, onSelectCategory }: RoomProps) {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [zoom, camera]);
  useEffect(() => {
    camera.position.set(6, 4.4, 7);
    controls.current?.target.set(0, 1, 0);
    controls.current?.update();
  }, [resetView, camera]);
  return (
    <>
      <color attach="background" args={["#f3f0e8"]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#fffbeb", "#c3baaa", 1.2]} />
      <directionalLight
        position={[2.8, 7, 3]}
        intensity={2.4}
        color="#fff0d2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-normalBias={0.035}
      />
      <Architecture />
      {config.rug && (
        <Arrive key={config.rug} reducedMotion={reducedMotion}>
          <group>
            <Box
              position={[0.12, 0.018, 0.47]}
              size={[2.65, 0.028, 2.15]}
              color="#b79d76"
              radius={0.025}
            />
            {Array.from({ length: 38 }, (_, i) => (
              <Box
                key={i}
                position={[-1.16 + i * 0.069, 0.034, 0.47]}
                size={[0.017, 0.004, 2.09]}
                color={i % 2 ? "#cbb28b" : "#c0a57c"}
                radius={0}
              />
            ))}
          </group>
        </Arrive>
      )}
      {selectedProducts(config)
        .filter((p) => p.slot !== "rug")
        .map((p) => (
          <Arrive key={p.id} reducedMotion={reducedMotion}>
            <group
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(p.category);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                gl.domElement.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                gl.domElement.style.cursor = "grab";
              }}
            >
              {p.slot === "desk" && <Desk walnut={p.id === "desk-walnut"} />}
              {p.slot === "chair" && <Chair studio={p.id === "chair-studio"} />}
              {p.slot === "plant" && <Plant />}
              <group position={[0, config.desk ? 0 : -1.445, 0]}>
                {p.slot === "monitor" &&
                  (p.id === "monitor-dual" ? (
                    <>
                      <Monitor position={[-0.48, 1.46, -0.7]} small />
                      <Monitor position={[0.48, 1.46, -0.7]} small />
                    </>
                  ) : (
                    <Monitor
                      position={[0, 1.46, -0.7]}
                      studio={p.id === "monitor-studio"}
                    />
                  ))}
                {p.slot === "stand" && (
                  <group position={[-0.83, 1.46, -0.6]} rotation={[0, 0.2, 0]}>
                    <Box
                      position={[0, 0.015, 0]}
                      size={[0.36, 0.025, 0.28]}
                      color="#aeb2a9"
                    />
                    <Box
                      position={[0, 0.14, -0.06]}
                      size={[0.06, 0.26, 0.04]}
                      color="#b9bdb4"
                      rotation={[-0.35, 0, 0]}
                    />
                    <Box
                      position={[0, 0.26, 0]}
                      size={[0.43, 0.025, 0.32]}
                      color="#b9bdb4"
                      rotation={[0.14, 0, 0]}
                    />
                  </group>
                )}
                {p.slot === "keyboard" && (
                  <group position={[-0.03, 1.47, -0.1]}>
                    <Box size={[0.6, 0.035, 0.22]} color="#41473e" />
                    {Array.from({ length: 36 }, (_, i) => (
                      <Box
                        key={i}
                        position={[
                          -0.255 + (i % 12) * 0.046,
                          0.023,
                          -0.07 + Math.floor(i / 12) * 0.06,
                        ]}
                        size={[0.034, 0.012, 0.04]}
                        color="#697060"
                        radius={0.003}
                      />
                    ))}
                  </group>
                )}
                {p.slot === "mouse" && (
                  <mesh
                    position={[0.49, 1.49, -0.08]}
                    scale={[0.07, 0.035, 0.1]}
                    castShadow
                  >
                    <sphereGeometry args={[1, 20, 16]} />
                    <meshStandardMaterial color="#454b40" />
                  </mesh>
                )}
                {p.slot === "lamp" && <Lamp />}
                {p.slot === "power" && (
                  <group position={[0.71, 1.48, -0.99]}>
                    <Box size={[0.37, 0.045, 0.09]} color="#e0ddcf" />
                    {[-0.1, 0, 0.1].map((x) => (
                      <Cylinder
                        key={x}
                        position={[x, 0.026, 0]}
                        radius={0.028}
                        height={0.005}
                        color="#9d9f94"
                      />
                    ))}
                  </group>
                )}
              </group>
            </group>
          </Arrive>
        ))}
      <ContactShadows
        position={[0, -0.265, 0]}
        opacity={0.32}
        scale={12}
        blur={2.6}
        far={5}
        resolution={512}
        color="#7c6b4c"
        frames={1}
      />
      <OrbitControls
        ref={controls}
        target={[0, 1, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.35}
        minAzimuthAngle={-0.1}
        maxAzimuthAngle={Math.PI / 2.1}
        enableDamping={!reducedMotion}
        dampingFactor={0.08}
      />
    </>
  );
}

function Fallback({ config }: { config: Configuration }) {
  return (
    <div className="scene-fallback">
      <p>Your setup, at a glance</p>
      <div>
        {selectedProducts(config).map((p) => (
          <figure key={p.id}>
            <ProductArt product={p} />
            <figcaption>{p.name}</figcaption>
          </figure>
        ))}
      </div>
      <small>
        3D isn’t available in this browser. You can still build and review your
        setup.
      </small>
    </div>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function RoomScene(props: RoomProps) {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      setSupported(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
  }, []);
  if (supported === null)
    return (
      <div className="scene-loading">
        <span />
        Opening your room…
      </div>
    );
  if (!supported) return <Fallback config={props.config} />;
  return (
    <SceneBoundary fallback={<Fallback config={props.config} />}>
      <Canvas
        shadows
        orthographic
        frameloop="demand"
        camera={{ position: [6, 4.4, 7], zoom: 90, near: 0.1, far: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        aria-label="Interactive 3D workspace preview. Drag to rotate. Select furniture using the catalog alongside."
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
