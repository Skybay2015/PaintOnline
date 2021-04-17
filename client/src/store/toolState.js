import { makeAutoObservable } from 'mobx';

class ToolState {
   tool = null;
   mainColor = '#000';
   strokeColor = '#000';
   lineWidth = 1;
   constructor() {
      makeAutoObservable(this);
   }

   setTool(tool) {
      this.tool = tool;
   }
   setFillColor(color) {
      this.tool.fillColor = color;
      this.mainColor = color;
   }
   setStrokeColor(color) {
      this.tool.stokeColor = color;
      this.strokeColor = color;
   }
   setLineWidth(width) {
      this.tool.lineWidth = width;
      this.lineWidth = width;
   }
}

export default new ToolState();
