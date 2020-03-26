registerPaint('myPaintImage', class {
  //
  static get contextOptions() {
    return { alpha: true };
  }
  //
  paint(ctx) {
    ctx.fillStyle = '#ddd';
    for (let i = 0; i < 100; ++i) {
      ctx.fillRect(10 + i * 20, 10 + i * 20, 20, 20);
      ctx.fillRect(50 + i * 20, 10 + i * 20, 20, 20);
      ctx.fillRect(90 + i * 20, 10 + i * 20, 20, 20);
    }
  }
});