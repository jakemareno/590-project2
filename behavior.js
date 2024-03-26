//import { Vpl } from './data.js';
//import { Vpp } from './data.js';
//import { Fpl } from './data.js';
//import { Fpp } from './data.js';
console.clear();

// ----------------------------------------------
// Axis data (do not modify)
// ----------------------------------------------

let A = [
    [0.0, 0.0, 0.0],
    [1.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 1.0]
];

let plane_vert = Vpl;
let prop_vert = Vpp;
let plane_face = Fpl;
let prop_face = Fpp;

// ----------------------------------------------
// end axis data
// ----------------------------------------------

// ----------------------------------------------
// Simuation control (do not modify)
// ----------------------------------------------

let xang = 0;
let yang = 0;
let zang = 0;
let rot = 0;
let axisRotation = null;
let rot_inc = 10;

function startRotation(rotationFunc) {
    if (axisRotation !== null) clearInterval(axisRotation);
    axisRotation = setInterval(rotationFunc, 100);
}

function stopRotation() {
    clearInterval(axisRotation);
    axisRotation = null;
}

document.addEventListener('mouseup', stopRotation);

document.addEventListener('mousedown', function (event) {
    switch ( event.target.id ) {
        case "pitch-up":
            startRotation(() => { xang = ( xang + rot_inc ) % 360; });
            break;
        case "pitch-down":
            startRotation(() => { xang = ( xang - rot_inc ) % 360; });
            break;
        case "roll-left":
            startRotation(() => { zang = ( zang + rot_inc ) % 360; });
            break;
        case "roll-right":
            startRotation(() => { zang = ( zang - rot_inc ) % 360; });
            break;
        case "yaw-left":
            startRotation(() => { yang = ( yang + rot_inc ) % 360; });
            break;
        case "yaw-right":
            startRotation(() => { yang = ( yang - rot_inc ) % 360; });
            break;
        case "reset":
            xang = yang = zang = 0; 
            break;
        default:
            stopRotation();
    }
});

// ----------------------------------------------
// End simuation control
// ----------------------------------------------

// Canvases
let canvases = [];

// WebGL Contexts
let contexts = [];

// Programs
let programs = [];

let attr_vertex = null;
let vertex_data = [];
let size = 3;
let axis_index = 0;
let prop_offset = -0.375;

// Arrays of uniform locations
let attr_vertices = [];
let props = [];
let colors = [];
let z_translations = [];

function createVertexData() {
    
    let row = 0;

    // add plane vertices + faces to vertex.data
    for ( let i=0; i<Fpl.length; i++ ) {
        vertex_data[row++] = Vpl[ Fpl[i][0] ];
        vertex_data[row++] = Vpl[ Fpl[i][1] ];
        vertex_data[row++] = Vpl[ Fpl[i][2] ];
    }

    // add propeller vertices + faces to vertex.data
    for ( let i=0; i<Fpp.length; i++ ) {
        vertex_data[row++] = Vpp[ Fpp[i][0] ];
        vertex_data[row++] = Vpp[ Fpp[i][1] ];
        vertex_data[row++] = Vpp[ Fpp[i][2] ];
    }

    // create axes
    axis_index = vertex_data.length;
    
    for ( let i=0; i<A.length; i++ ) {
         vertex_data[row++] = A[i];
    }

}

function configure() {
    canvases.push(document.getElementById("xyz"));
    canvases.push(document.getElementById("xz"));
    canvases.push(document.getElementById("yz"));
    canvases.push(document.getElementById("xy"));

    for(let canvas of canvases) {
        let gl = canvas.getContext("webgl");
        contexts.push(gl);

        let program = initShaders(gl, "vertex-shader", "fragment-shader");
        programs.push(program);

        gl.useProgram(program);
        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.enable( gl.DEPTH_TEST );

        attr_vertices.push(gl.getAttribLocation( program, "vertex" ));
        props.push(gl.getUniformLocation( program, "props" ));
        colors.push(gl.getUniformLocation( program, "color" ));
        z_translations.push(gl.getUniformLocation(program, "z_translation"));
    }

    /* gl_main = canvas_main.getContext("webgl");
    gl_xz = canvas_xz.getContext("webgl");
    gl_yz = canvas_yz.getContext("webgl");
    gl_xy = canvas_xy.getContext("webgl");
    contexts = [gl_main, gl_xz, gl_yz, gl_xy];

    let program_main = initShaders(gl_main, "vertex-shader", "fragment-shader");
    let program_xz = initShaders(gl_xz, "vertex-shader", "fragment-shader");
    let program_yz = initShaders(gl_yz, "vertex-shader", "fragment-shader");
    let program_xy = initShaders(gl_xy, "vertex-shader", "fragment-shader");
    programs = [program_main, program_xz, program_yz, program_xy];

    gl_main.useProgram(program_main);
    gl_xz.useProgram(program_xz);
    gl_yz.useProgram(program_yz);
    gl_xy.useProgram(program_xy);

    gl_main.viewport( 0, 0, canvas_main.width, canvas_main.height );
    gl_main.enable( gl_main.DEPTH_TEST );

    for(let i = 0; i < 4; i++) {
        let gl = contexts[i];
        let program = programs[i];

        attr_vertices.push(gl.getAttribLocation( program, "vertex" ));
        props.push(gl.getUniformLocation( program, "props" ));
        colors.push(gl.getUniformLocation( program, "color" ));
        z_translations.push(gl.getUniformLocation(program, "z_translation"));
    } */

    /*
    attr_vertex = gl_main.getAttribLocation( program_main, "vertex" );
    uniform_props = gl_main.getUniformLocation( program_main, "props" );
    uniform_color = gl_main.getUniformLocation( program_main, "color" );
    uniform_z_translation = gl_main.getUniformLocation(program_main, "z_translation");
    */
}

function allocateMemory() {
    for(let i = 0; i < 4; i++) {
        let gl = contexts[i];
        let attr_vertex = attr_vertices[i];
        let buffer_id = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
        gl.vertexAttribPointer(attr_vertex, size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr_vertex);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertex_data), gl.STATIC_DRAW);
    }
}

function draw() {
    for(let i = 0; i < 4; i++) {
        let gl = contexts[i];
        let uniform_props = props[i];
        let uniform_color = colors[i];
        let uniform_z_translation = z_translations[i];

        gl.uniform4f(uniform_props,
                    xang * Math.PI/180,
                    yang * Math.PI/180,
                    zang * Math.PI/180,
                    1.75);

        gl.uniform4f( uniform_color, 0.60, 0.60, 0.60, 1.0 );
        for( let j = 0; j < Fpl.length*3; j += 3 ) {
            gl.drawArrays(gl.LINE_STRIP, j, size);
        }

        gl.uniform1f( uniform_z_translation, prop_offset);
        for( let j = Fpl.length*3; j < axis_index; j += 3 ) {
            gl.drawArrays(gl.LINE_STRIP, j, size);
        }
        gl.uniform1f( uniform_z_translation, 0);

        gl.uniform4f( uniform_color, 0.81, 0.81, 0.81, 1.0 ); 
        gl.drawArrays(gl.TRIANGLES, 0, Fpl.length*3);

        gl.uniform1f( uniform_z_translation, prop_offset);
        gl.drawArrays(gl.TRIANGLES, Fpl.length*3+1, Fpp.length);
        gl.uniform1f( uniform_z_translation, 0);
    }

    rot = (rot + rot_inc) % 360;
}




// Run all functions

createVertexData();
configure();
allocateMemory();
setInterval(draw, 100);