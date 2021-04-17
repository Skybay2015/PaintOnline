import { makeAutoObservable } from 'mobx';

class CanvasState {
   canvas = null;
   undoList = [];
   redoList = [];
   username = '';
   constructor() {
      makeAutoObservable(this);
   }

   setUsername(username) {
      this.username = username;
   }

   setCanvas(canvas) {
      this.canvas = canvas;
   }

   pushToUndo(data) {
      this.undoList.push(data);
   }

   pushToRedo(data) {
      this.redoList.push(data);
   }

   undo(socket, sessionId) {
      let ctx = this.canvas.getContext('2d');
      if (this.undoList.length > 0) {
         let dataUrl = this.undoList.pop();
         this.redoList.push(this.canvas.toDataURL());

         socket.send(
            JSON.stringify({
               method: 'picture',
               id: sessionId,
               data: {
                  url: dataUrl,
               },
            }),
         );
      } else {
         ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
   }

   redo(socket, sessionId) {
      if (this.redoList.length > 0) {
         let dataUrl = this.redoList.pop();
         this.undoList.push(this.canvas.toDataURL());
         socket.send(
            JSON.stringify({
               method: 'picture',
               id: sessionId,
               data: {
                  url: dataUrl,
               },
            }),
         );
      }
   }
}

export default new CanvasState();
