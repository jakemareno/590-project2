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
let canvas_main = null;
let canvas_xz = null;
let canvas_yz = null;
let canvas_xy = null;

// WebGL Contexts
let gl_main = null;
let gl_xz = null;
let gl_yz = null;
let gl_xy = null;

let attr_vertex = null;
let vertex_data = [];

function createVertexData() {
// Sarah
}

function configure() {
// Ziqian 
}

function allocateMemory() {
    let contexts = [gl_main, gl_xy, gl_xz, gl_yz]

    for(let gl of contexts) {
        let buffer_id = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer_id);
        gl.vertexAttribPointer(attr_vertex, size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr_vertex);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertex_data), gl.STATIC_DRAW);
    }
}

function draw() {
    
}




// Run all functions

createVertexData();
configure();
allocateMemory();
setInterval(draw, 100);