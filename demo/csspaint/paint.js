registerPaint('myPaintImage', class {
    //
    static get inputProperties() { return ['--user-name', '--user-code','display']; }
    //
    static get contextOptions() {
        return { alpha: true };
    }
    //
    paint(ctx, size, props) {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, 100, 20);
    }
});