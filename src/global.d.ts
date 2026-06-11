import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    // Intentional declaration merging: registers react-three-fiber's
    // scene-graph tags (<mesh>, <ambientLight>, ...) as valid JSX elements.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}
