//% color="#02729c"
namespace shadowcasting {
    //% blockId=shadowcasting_setAnchor
    //% block="set shadowcasting anchor $sprite"
    //% sprite.shadow=variables_get
    //% sprite.defl=mySprite
    //% weight=100
    export function setAnchor(sprite: Sprite) {
        _state().setAnchor(sprite);
    }

    //% blockId=shadowcasting_setShadowColor
    //% block="set shadowcasting color $color"
    //% color.shadow=colorindexpicker
    //% weight=90
    export function setShadowColor(color: number) {
        _state().setColor(color);
    }

    //% blockId=shadowcasting_setShadowMode
    //% block="set shadowcasting mode $mode"
    //% weight=85
    export function setShadowMode(mode: ShadowCastingMode) {
        _state().mode = mode;
    }

    //% blockId=shadowcasting_setShadowImage
    //% block="set shadowcasting tile image $image"
    //% image.shadow=tileset_tile_picker
    //% weight=80
    export function setShadowImage(image: Image) {
        _state().setImage(image);
    }

    //% blockId=shadowcasting_setShadowEnabled
    //% block="set shadowcasting enabled $enabled"
    //% weight=70
    export function setShadowEnabled(enabled: boolean) {
        _state().setEnabled(enabled);
    }

    //% blockId=shadowcasting_setShadowZIndex
    //% block="set shadowcasting z index $index"
    //% index.defl=100
    //% weight=60
    export function setShadowZIndex(index: number) {
        _state().renderable.z = index;
    }
}