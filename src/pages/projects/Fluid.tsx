import { useEffect, useRef } from 'react';

export default function WebGLDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    const result = init(gl, canvas);
    const textures= textureInit(gl);
    if (!result) throw new Error("No result!");
    if (!textures) return;

    const { programs, uniforms, vao } = result;

    const startTime = performance.now();

    function render() {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      //runAdvection(gl, programs.advectionProgram, uniforms.standardUniforms, uniforms.advectionUniforms, textures, vao);
      gl.useProgram(programs.program);
      gl.uniform1f(uniforms.standardUniforms.u_deltaTime, elapsedTime);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        style={{ border: '1px solid red' }}
      />
    </div>
  );
}


function runAdvection(gl: WebGL2RenderingContext, 
    advectionProgram : WebGLProgram, 
    standardUniforms: {
    u_time: WebGLUniformLocation;
    u_resolution: number[];
    u_deltaTime: WebGLUniformLocation;
    }, 
    advectionUniforms: {
    u_resolution: WebGLUniformLocation;
    u_time: WebGLUniformLocation;
    u_deltaTime: WebGLUniformLocation;
    V_read: WebGLUniformLocation;
    }, 
    textures: {
    width: number;
    height: number;
    velTextures: {
      read: WebGLTexture;
      write: WebGLTexture;
    };
    velFramebuffers: {
      read: WebGLFramebuffer;
      write: WebGLFramebuffer;
    };
    pressureTextures: any;
    pressureFramebuffers: any;
    swapVel: () => void;
    swapPressure: () => void;
  }, 
  vao: WebGLVertexArrayObject, ){

    gl.useProgram(advectionProgram);

    gl.bindFramebuffer(gl.FRAMEBUFFER, textures.velFramebuffers.write);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.velTextures.read);


    //draw
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0 , 3);


    textures.swapVel();

}

// === WebGL Utilities ===
function createFramebuffer(gl: WebGL2RenderingContext, texture: WebGLTexture) {
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Unbind
  return fb;
}

function createVelocityTexture(gl: WebGL2RenderingContext, width: number, height: number) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA32F, // WebGL2 internal format
    width,
    height,
    0,
    gl.RGBA,
    gl.FLOAT,
    null
  );

  return tex;
}

function createPressureTexture(gl: WebGL2RenderingContext, width: number, height: number) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA32F, // WebGL2 internal format
    width,
    height,
    0,
    gl.RGBA,
    gl.FLOAT,
    null
  );

  return tex;
}

function createProgram(gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram{

  const compileShader = (type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error('Unable to create shader.');
      return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertShader = compileShader(gl.VERTEX_SHADER, vertexSrc);
  const fragShader = compileShader(gl.FRAGMENT_SHADER, fragmentSrc);

  const program = gl.createProgram()!;
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('Program failed to link: ' + gl.getProgramInfoLog(program));
  }

  return program;
}

function textureInit(gl: WebGL2RenderingContext) {
  const width = 128;
  const height = 128;

  const velocityTexA = createVelocityTexture(gl, width, height);
  const velocityTexB = createVelocityTexture(gl, width, height);

  const velocityFBA = createFramebuffer(gl, velocityTexA);
  const velocityFBB = createFramebuffer(gl, velocityTexB);

  const pressureTexA = createPressureTexture(gl, width, height);
  const pressureTexB = createPressureTexture(gl, width, height);

  const pressureFBA = createFramebuffer(gl, pressureTexA);
  const pressureFBB = createFramebuffer(gl, pressureTexB);

  return {
    width,
    height,
    velTextures: {
      read: velocityTexA,
      write: velocityTexB,
    },
    velFramebuffers: {
      read: velocityFBA,
      write: velocityFBB,
    },
    pressureTextures: {
      read: pressureTexA,
      write: pressureTexB,
    },
    pressureFramebuffers: {
      read: pressureFBA,
      write: pressureFBB,
    },
    swapVel() {
      [this.velTextures.read, this.velTextures.write] = [this.velTextures.write, this.velTextures.read];
      [this.velFramebuffers.read, this.velFramebuffers.write] = [this.velFramebuffers.write, this.velFramebuffers.read];
    },
    swapPressure(){
      [this.pressureTextures.read, this.pressureTextures.write] = [this.pressureTextures.write, this.pressureTextures.read];
      [this.pressureFramebuffers.read, this.pressureFramebuffers.write] = [this.pressureFramebuffers.write, this.pressureFramebuffers.read];
    }
  };
}
function advectionInit(gl: WebGL2RenderingContext, advectionProgram : WebGLProgram, ){
  const u_resolution = gl.getUniformLocation(advectionProgram, 'u_resolution');
  const u_time = gl.getUniformLocation(advectionProgram, 'u_time');
  const u_deltaTime = gl.getUniformLocation(advectionProgram, 'u_deltaTime');
  const V_read = gl.getUniformLocation(advectionProgram, 'V_read');
  return {u_resolution, u_time, u_deltaTime, V_read};
}
function init(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement) {
  const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
  }`;

  const sharedFunctionallity = `
    // shared.glsl
    vec2 screenToGrid(vec2 fragCoord, vec2 resolution, vec2 gridSize) {
        return floor(fragCoord / (resolution / gridSize));
    }
`;

  const fragmentShaderSource =`#version 300 es
    precision highp float;
    out vec4 outColor;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_deltaTime;
    ${sharedFunctionallity}
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      uv = 2.0 * (uv - 0.5);
      vec3 color = vec3(uv, 0.0);
      outColor = vec4(color, 1.0);
  }`;

  const advectionShaderSource = `#version 300 es
    precision highp float;
    out vec4 outColor;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D V_read;
    ${sharedFunctionallity}
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      uv = 2.0 * (uv - 0.5);
      vec3 color = vec3(uv, 0.0);
      outColor = vec4(color, 1.0);
  }`;

  

  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  const advectionProgram = createProgram(gl, vertexShaderSource, advectionShaderSource);
 
  if (!program) throw new Error("Program failed to link");

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }
 const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.useProgram(program);

  // === Set up buffer ===
  const vertices = new Float32Array([
    -1, -1,
    3, -1,
    -1, 3,
  ]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionAttrib = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionAttrib);
  gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

  //gl.bindVertexArray(null);
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // === Set up uniforms ===
  const u_resolution = gl.getUniformLocation(program, 'u_resolution');
  const u_time = gl.getUniformLocation(program, 'u_time');
  const u_deltaTime = gl.getUniformLocation(program, 'u_deltaTime');

  const u_velocity = gl.getUniformLocation(advectionProgram, 'u_velocity')

  gl.uniform2f(u_resolution, canvas.width, canvas.height);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  const standardUniforms = {
  u_time,
  u_resolution: [canvas.width, canvas.height],
  u_deltaTime,
  };
  const advectionUniforms = advectionInit(gl, advectionProgram);

  
  return { programs:{program, advectionProgram}, uniforms : {standardUniforms, advectionUniforms }, vao };
}
