#version 300 es

precision mediump float;

in vec2 aVertexPosition;
in vec2 aCoord;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

out vec2 vCoord;
out vec2 vTextureCoord;

void main() {
    vCoord = aCoord;
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
}