namespace shadowcasting {
    let ditherFrames: Image[];
    let currentColor: number;

    function init(color: number) {
        if (!ditherFrames || currentColor !== color) {
            ditherFrames = [img`
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f . f f f f f f f . f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f f f f f f f f f f f
    f f f f f f . f f f f f f f . f
    f f f f f f f f f f f f f f f f
                `, img`
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f . f f f f f f f . f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f . f f f f f f f . f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f . f f f f f f f . f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f . f f f f f f f . f
                f f f f f f f f f f f f f f f f
                `, img`
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                `, img`
                . f f f . f f f . f f f . f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                . f f f . f f f . f f f . f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                . f f f . f f f . f f f . f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                . f f f . f f f . f f f . f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                `, img`
                . f f f . f . f . f f f . f . f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                . f . f . f f f . f . f . f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                . f f f . f . f . f f f . f . f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                . f . f . f f f . f . f . f f f
                f f f f f f f f f f f f f f f f
                f f . f f f . f f f . f f f . f
                f f f f f f f f f f f f f f f f
                `, img`
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                `, img`
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f f f f f f f f f f f f f f
                `, img`
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                . f . f . f . f . f . f . f . f
                f . f f f . f f f . f f f . f f
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                `, img`
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f f f . f f f . f f f . f f f .
                `, img`
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                . f . f . f . f . f . f . f . f
                f . f . f . f . f . f . f . f .
                `]

            const numFrames = ditherFrames.length;
            for (let i = 0; i < numFrames; i++) {
                const frame = ditherFrames[numFrames - 1 - i].clone();
                frame.replace(0, 1);
                frame.replace(15, 0);
                frame.replace(1, 15)
                ditherFrames.push(frame)
            }

            for (const frame of ditherFrames) {
                frame.replace(15, color);
            }
        }
    }

    export function ditherRect(x: number, y: number, width: number, height: number, depth: number, color: number) {
        init(color);
        const frame = ditherFrames[ditherFrames.length - 1 - depth];

        if (!frame) {
            screen.fillRect(x, y, width, height, color);
        }
        else {
            screen.blit(
                x, y, width, height, frame, 0, 0, width, height, true, false
            )
        }
    }
}