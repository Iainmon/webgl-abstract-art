
import Loop from './loop'
import hash from './hasher'

// window['Loop'] = Loop

function getShader(gl, id) {
    const shaderScript = document.getElementById(id)
    if (!shaderScript) {
        return null
    }

    var str = ''
    var k = shaderScript.firstChild
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent
        }
        k = k.nextSibling
    }

    var shader
    if (shaderScript.type == 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER)
    } else if (shaderScript.type == 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER)
    } else {
        return null
    }

    gl.shaderSource(shader, str)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader))
        return null
    }

    return shader
}

const shader = function (context, source, type) {
    const shader = context.createShader(type)
    context.shaderSource(shader, source)
    context.compileShader(shader)

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
        alert(context.getShaderInfoLog(shader))
        return null
    }

    return shader
}

import fragment_shader_source from './fragment-shader.glsl'
import vertex_shader_source from './vertex-shader.glsl'


const main = async () => {

    const canvas = document.getElementById('context-window')
    const context = canvas.getContext('webgl')

    context.viewportWidth = canvas.width
    context.viewportHeight = canvas.height

    // const fragmentShader = getShader(context, 'fragment-shader')
    // const vertexShader = getShader(context, 'vertex-shader')

    const fragmentShader = shader(context, fragment_shader_source, context.FRAGMENT_SHADER)
    const vertexShader = shader(context, vertex_shader_source, context.VERTEX_SHADER)

    if (!context) alert('GL is not supported.')

    const program = context.createProgram()
    context.attachShader(program, vertexShader)
    context.attachShader(program, fragmentShader)
    context.linkProgram(program)

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        alert('Could not initialise shaders.')
    }

    context.useProgram(program)

    program.positionLocation = context.getAttribLocation(program, 'Position')
    context.enableVertexAttribArray(program.positionLocation)

    program.u_PerspLocation = context.getUniformLocation(program, 'u_Persp')
    program.u_ModelViewLocation = context.getUniformLocation(program, 'u_ModelView')

    program.u_resolution = context.getUniformLocation(program, 'u_resolution')
    program.u_time = context.getUniformLocation(program, 'u_time')
    program.u_seed = context.getUniformLocation(program, 'u_seed')


    const updatedelay = 10
    const framerate = 1000 / updatedelay

    const starttime = new Date()
    let lastupdate = new Date()

    const vertices = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
    ]

    const triangleVertexPositionBuffer = context.createBuffer()
    context.bindBuffer(context.ARRAY_BUFFER, triangleVertexPositionBuffer)
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(vertices), context.STATIC_DRAW)
    // triangleVertexPositionBuffer.itemSize = 3
    // triangleVertexPositionBuffer.numItems = 3
    triangleVertexPositionBuffer.itemSize = 3
    triangleVertexPositionBuffer.numItems = 4

    context.clearColor(0.0, 0.0, 0.0, 1.0)
    context.enable(context.DEPTH_TEST)
    context.viewport(0, 0, context.viewportWidth, context.viewportHeight)


    const mvMatrix = mat4.create()
    const pMatrix = mat4.create()

    const perspective = 360 // 45 * Math.abs(Math.sin(programSeconds)) // 45
    mat4.perspective(perspective, context.viewportWidth / context.viewportHeight, 0.1, 100.0, pMatrix)

    mat4.identity(mvMatrix)
    //Move our triangle
    mat4.translate(mvMatrix, [0.0, 0.0, -4.0])

    //Pass triangle position to vertex shader
    context.bindBuffer(context.ARRAY_BUFFER, triangleVertexPositionBuffer)
    context.vertexAttribPointer(program.positionLocation, triangleVertexPositionBuffer.itemSize, context.FLOAT, false, 0, 0)

    //Pass model view projection matrix to vertex shader
    context.uniformMatrix4fv(program.u_PerspLocation, false, pMatrix)
    context.uniformMatrix4fv(program.u_ModelViewLocation, false, mvMatrix)

    let seed = [1., 1., 1., 1.]

    const onTextChange = e => {
        const text = input['value']
        const hashed = hash(text)
        console.log(text, hashed)
        seed = hashed
        if (seed.length < 4) seed = [1., 1., 1., 1.]
    }

    const input = document.getElementById('hash-seed')
    const button = document.getElementById('run-button')
    button.addEventListener('click', onTextChange)
    input.addEventListener('change', onTextChange)
    input.addEventListener('keyup', onTextChange)


    onTextChange() // debug

    

    const loop = new Loop()

    loop.loop( time => {

        const present = new Date()
        const programtime = present - time
        const programSeconds = programtime / 1000

        const deltatime = present - lastupdate
        // console.log('Deltatime', deltatime)

        // const vertices = [
        //     0.0, 1.0, 0.0,
        //     -1.0, -1.0, 0.0,
        //     1.0, -1.0, 0.0
        // ]

        context.uniform2fv(program.u_resolution, [context.viewportWidth, context.viewportHeight])
        context.uniform1f(program.u_time, programSeconds)

        context.uniform4fv(program.u_seed, seed)

        context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT)

        //Draw our lovely triangle
        context.drawArrays(context.TRIANGLE_FAN, 0, triangleVertexPositionBuffer.numItems)

        lastupdate = new Date()

    })

    loop.begin(framerate)

}


main()
