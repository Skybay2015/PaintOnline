import Tool from './Tool';

export default class Line extends Tool {
   constructor(canvas, socket, id) {
      super(canvas, socket, id);
      this.listen();
   }

   listen() {
      this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
      this.canvas.onmousedown = this.mouseDownHandler.bind(this);
      this.canvas.onmouseup = this.mouseUpHandler.bind(this);
   }

   mouseDownHandler(e) {
      this.mouseDown = true;
      this.currentX = e.pageX - e.target.offsetLeft;
      this.currentY = e.pageY - e.target.offsetTop;
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentX, this.currentY);
      this.saved = this.canvas.toDataURL();
   }

   mouseUpHandler(e) {
      this.mouseDown = false;
      this.socket.send(
         JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
               type: 'line',
               currentX: this.currentX,
               currentY: this.currentY,
               x: this.x,
               y: this.y,
               color: this.ctx.fillStyle,
               lineWidth: this.ctx.lineWidth,
            },
         }),
      );
   }

   mouseMoveHandler(e) {
      if (this.mouseDown) {
         this.x = e.pageX - e.target.offsetLeft;
         this.y = e.pageY - e.target.offsetTop;
         this.draw(this.x, this.y);
      }
   }

   draw(x, y) {
      const img = new Image();
      img.src = this.saved;
      img.onload = () => {
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
         this.ctx.beginPath();
         this.ctx.moveTo(this.currentX, this.currentY);
         this.ctx.lineTo(x, y);
         this.ctx.stroke();
      };
   }

   static staticDraw(ctx, currentX, currentY, x, y, color, lineWidth) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(x, y);
      ctx.stroke();
   }
}
