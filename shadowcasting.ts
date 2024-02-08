namespace shadowcasting {
    export enum ShadowCastingMode {
        //$ block="fill with dither"
        Dither,
        //% block="fill with color"
        Fill,
        //% block="fill with image"
        Image,
    }

    class ShadowCastingState {
        anchor: Sprite;
        color: number;
        shadowImage: Image;

        renderable: scene.Renderable;
        enabled: boolean;
        mode: ShadowCastingMode;

        constructor() {
            this.color = 15
            this.mode = ShadowCastingMode.Dither;
            this.renderable = scene.createRenderable(100, () => {
                if (!this.enabled || !game.currentScene().tileMap || !this.anchor) return
                drawShadows(this.anchor.tilemapLocation(), game.currentScene().tileMap.data)
            })
        }

        setColor(color: number) {
            this.color = color;
            this.shadowImage = undefined;
        }

        setImage(image: Image) {
            this.shadowImage = image;
        }

        setAnchor(anchor: Sprite) {
            this.anchor = anchor;
            this.setEnabled(true);
        }

        setEnabled(enabled: boolean) {
            this.enabled = enabled;
        }
    }

    function _stateFactory() {
        return new ShadowCastingState();
    }

    export function _state() {
        return __util.getState(_stateFactory)
    }

    enum Cardinal {
        North = 0,
        East = 1,
        South = 2,
        West = 3
    }

    export class Bitmask {
        protected mask: Buffer;

        constructor(public width: number, public height: number) {
            this.mask = control.createBuffer(Math.ceil(width * height / 8));
        }

        set(col: number, row: number) {
            if (col < 0 || col >= this.width || row < 0 || row >= this.height) return;
            const cellIndex = col + this.width * row;
            const index = cellIndex >> 3;
            const offset = cellIndex & 7;
            this.mask[index] |= (1 << offset);
        }

        get(col: number, row: number) {
            const cellIndex = col + this.width * row;
            const index = cellIndex >> 3;
            const offset = cellIndex & 7;
            return (this.mask[index] >> offset) & 1;
        }
    }

    class Point {
        constructor(public x: number, public y: number) { }
    }

    class Quadrant {
        public ox: number;
        public oy: number;

        minX: number;
        minY: number;
        maxX: number;
        maxY: number;

        constructor(public cardinal: Cardinal, origin: Point) {
            this.ox = origin.x;
            this.oy = origin.y;
        }

        transform(tile: Point) {
            if (this.cardinal === Cardinal.North) {
                return new Point(this.ox + tile.x, this.oy - tile.y);
            }
            else if (this.cardinal === Cardinal.South) {
                return new Point(this.ox + tile.x, this.oy + tile.y);
            }
            else if (this.cardinal === Cardinal.East) {
                return new Point(this.ox + tile.y, this.oy + tile.x);
            }
            else {
                return new Point(this.ox - tile.y, this.oy + tile.x);
            }
        }

        isOutOfBounds(rowDepth: number) {
            if (this.cardinal === Cardinal.North) {
                return this.oy - rowDepth < this.minY;
            }
            else if (this.cardinal === Cardinal.South) {
                return this.oy + rowDepth > this.maxY;
            }
            else if (this.cardinal === Cardinal.West) {
                return this.ox - rowDepth < this.minX;
            }
            else {
                return this.ox + rowDepth > this.maxX;
            }
        }
    }

    class Row {
        index = 0;
        minColumn: number;
        maxColumn: number;
        constructor(public depth: number, public startSlope: number, public endSlope: number) {
            this.minColumn = roundTiesUp(this.depth * this.startSlope);
            this.maxColumn = roundTiesDown(this.depth * this.endSlope);
        }

        nextTile() {
            if (this.minColumn + this.index > this.maxColumn) return undefined;
            return new Point(this.minColumn + (this.index++), this.depth);
        }

        nextRow() {
            return new Row(this.depth + 1, this.startSlope, this.endSlope);
        }
    }

    function slope(rowDepth: number, column: number) {
        return (2 * column - 1) / (2 * rowDepth)
    }

    function isSymmetric(row: Row, column: number) {
        return column >= row.depth * row.startSlope && column <= row.depth * row.endSlope
    }

    function roundTiesUp(n: number) {
        return Math.floor(n + 0.5);
    }

    function roundTiesDown(n: number) {
        return Math.ceil(n - 0.5);
    }

    function isWall(location: Point, tilemap: tiles.TileMapData, quadrant: Quadrant) {
        if (!location) return false;

        const rotated = quadrant.transform(location);
        if (tilemap.isOutsideMap(rotated.x, rotated.y)) return true;

        return tilemap.isWall(rotated.x, rotated.y);
    }

    function isFloor(location: Point, tilemap: tiles.TileMapData, quadrant: Quadrant) {
        if (!location) return false;

        const rotated = quadrant.transform(location);
        if (tilemap.isOutsideMap(rotated.x, rotated.y)) return false;
        return !tilemap.isWall(rotated.x, rotated.y);
    }

    function reveal(location: Point, mask: Bitmask, quadrant: Quadrant) {
        const rotated = quadrant.transform(location);
        mask.set(rotated.x, rotated.y);
    }

    function scan(quadrant: Quadrant, row: Row, tilemap: tiles.TileMapData, mask: Bitmask) {
        const rows = [row];

        while (rows.length) {
            const currentRow = rows.pop();
            let prevTile: Point;
            let tile: Point;

            if (quadrant.isOutOfBounds(currentRow.depth)) continue;

            while (tile = currentRow.nextTile()) {
                if (isWall(tile, tilemap, quadrant) || isSymmetric(currentRow, tile.x)) {
                    reveal(tile, mask, quadrant);
                }
                if (isWall(prevTile, tilemap, quadrant) && isFloor(tile, tilemap, quadrant)) {
                    currentRow.startSlope = slope(currentRow.depth, tile.x);
                }
                if (isFloor(prevTile, tilemap, quadrant) && isWall(tile, tilemap, quadrant)) {
                    const nextRow = currentRow.nextRow();
                    nextRow.endSlope = slope(nextRow.depth, tile.x);
                    rows.push(nextRow);
                }
                prevTile = tile;
            }

            if (isFloor(prevTile, tilemap, quadrant)) {
                rows.push(currentRow.nextRow());
            }
        }
    }

    /**
     * Based off of https://www.albertford.com/shadowcasting/
     */
    export function drawShadows(origin: tiles.Location, tilemap: tiles.TileMapData) {
        const mask = new Bitmask(tilemap.width, tilemap.height);

        mask.set(origin.col, origin.row);

        const camera = game.currentScene().camera;

        const offsetMask = (0x1 << tilemap.scale) - 1;
        const offsetX = camera.drawOffsetX & offsetMask;
        const offsetY = camera.drawOffsetY & offsetMask;

        const x0 = Math.max(0, camera.drawOffsetX >> tilemap.scale);
        const xn = Math.min(tilemap.width, ((camera.drawOffsetX + screen.width) >> tilemap.scale) + 1);
        const y0 = Math.max(0, camera.drawOffsetY >> tilemap.scale);
        const yn = Math.min(tilemap.height, ((camera.drawOffsetY + screen.height) >> tilemap.scale) + 1);

        for (let i = 0; i < 4; i++) {
            const quadrant = new Quadrant(i, new Point(origin.col, origin.row));
            quadrant.minX = x0;
            quadrant.maxX = xn;
            quadrant.minY = y0;
            quadrant.maxY = yn;

            const firstRow = new Row(1, -1, 1);
            scan(quadrant, firstRow, tilemap, mask);
        }

        const state = _state();

        const shadowImage = state.shadowImage;
        const color = state.color;

        if (shadowImage && state.mode === ShadowCastingMode.Image) {
            for (let x = x0; x <= xn; ++x) {
                for (let y = y0; y <= yn; ++y) {
                    if (!mask.get(x, y)) {
                        screen.drawTransparentImage(
                            shadowImage,
                            ((x - x0) << tilemap.scale) - offsetX,
                            ((y - y0) << tilemap.scale) - offsetY
                        )
                    }
                }
            }
        }
        else if (color) {
            if (state.mode === ShadowCastingMode.Dither) {
                // Track shadow level in an image
                let ditherField = image.create(xn - x0 + 1, yn - y0 + 1);
                for (let x = x0; x <= xn; ++x) {
                    for (let y = y0; y <= yn; ++y) {
                        if (tilemap.isWall(x, y)) {
                            // Walls are set to 15 so that they can't cast light
                            ditherField.setPixel(x - x0, y - y0, 15);
                        }
                        else if (mask.get(x, y)) {
                            ditherField.setPixel(x - x0, y - y0, 1);
                        }
                    }
                }

                // Spread light to adjacent tiles
                for (let i = 1; i < 14; i++) {
                    let didChange = false;
                    for (let x = 0; x <= ditherField.width; ++x) {
                        for (let y = 0; y <= ditherField.height; ++y) {
                            if (ditherField.getPixel(x, y) === i) {
                                if (ditherField.getPixel(x - 1, y) === 0) {
                                    ditherField.setPixel(x - 1, y, i + 1)
                                    didChange = true;
                                }
                                if (ditherField.getPixel(x + 1, y) === 0) {
                                    ditherField.setPixel(x + 1, y, i + 1)
                                    didChange = true;
                                }
                                if (ditherField.getPixel(x, y - 1) === 0) {
                                    ditherField.setPixel(x, y - 1, i + 1)
                                    didChange = true;
                                }
                                if (ditherField.getPixel(x, y + 1) === 0) {
                                    ditherField.setPixel(x, y + 1, i + 1)
                                    didChange = true;
                                }
                            }
                        }
                    }
                    if (!didChange) break;
                }

                ditherField.replace(0, 15)

                // Fix the walls
                for (let x = x0; x <= xn; ++x) {
                    for (let y = y0; y <= yn; ++y) {
                        if (tilemap.isWall(x, y) && !mask.get(x, y)) {
                            const xx = x - x0;
                            const yy = y - y0;

                            let minNeighbor = 15;
                            if (xx > 0) minNeighbor = Math.min(minNeighbor, ditherField.getPixel(xx - 1, yy))
                            if (xx < ditherField.width - 1) minNeighbor = Math.min(minNeighbor, ditherField.getPixel(xx + 1, yy))
                            if (yy > 0) minNeighbor = Math.min(minNeighbor, ditherField.getPixel(xx, yy - 1))
                            if (yy < ditherField.height - 1) minNeighbor = Math.min(minNeighbor, ditherField.getPixel(xx, yy + 1))
                            ditherField.setPixel(x - x0, y - y0, minNeighbor + 2);
                        }
                    }
                }

                for (let x = x0; x <= xn; ++x) {
                    for (let y = y0; y <= yn; ++y) {
                        if (!mask.get(x, y)) {
                            const depth = ditherField.getPixel(x - x0, y - y0);
                            ditherRect(
                                ((x - x0) << tilemap.scale) - offsetX,
                                ((y - y0) << tilemap.scale) - offsetY,
                                1 << tilemap.scale,
                                1 << tilemap.scale,
                                (depth * 2.5) | 0,
                                color
                            )
                        }
                    }
                }
            }
            else {
                for (let x = x0; x <= xn; ++x) {
                    for (let y = y0; y <= yn; ++y) {
                        if (!mask.get(x, y)) {
                            screen.fillRect(
                                ((x - x0) << tilemap.scale) - offsetX,
                                ((y - y0) << tilemap.scale) - offsetY,
                                1 << tilemap.scale,
                                1 << tilemap.scale,
                                color
                            )
                        }
                    }
                }
            }
        }
    }
}