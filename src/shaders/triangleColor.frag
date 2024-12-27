#version 300 es

precision mediump float;

in vec2 vCoord;
out vec4 fragColor;

uniform float time;
uniform vec2 mousePosition;
uniform vec2 mouseVelocity;

float pi = 3.14159265359;

void main() {
    vec2 rMouse = mousePosition - vCoord;
    float rMouseAbs = length(rMouse);

    float q = 1.0;
    float epsilon0 = 1e1;
    float EAbs = q / (4.0 * pi * epsilon0 * rMouseAbs * rMouseAbs);

    float mu = 6e-1;
    vec3 mouseVel = vec3(mouseVelocity, 0.0);
    vec3 rMouse3 = vec3(rMouse, 0.0);
    vec3 B = cross(mouseVel, rMouse3) * q * mu / (4.0 * pi * rMouseAbs * rMouseAbs * rMouseAbs);

    fragColor = vec4(B.z, EAbs, -B.z, 1.0);
}
