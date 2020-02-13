export function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
}

export function clampInArray(array, index) {
    return clamp(index, 0, array.length - 1);
}

export function snap(val, cellSize) {
    return (Math.round(val / cellSize) * cellSize) | 0;
}

export function snapPoint(point, cellSize) {
    point.x = (Math.round(point.x / cellSize) * cellSize) | 0;
    point.y = (Math.round(point.y / cellSize) * cellSize) | 0;
}
