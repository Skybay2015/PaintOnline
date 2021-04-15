import { makeAutoObservable } from 'mobx';

class ToolState {
   tool = null;
   mainColor = '#000';
   constructor() {
      makeAutoObservable(this);
   }

   setColor(color) {
      this.mainColor = color;
   }

   setTool(tool) {
      this.tool = tool;
   }
   setFillColor(color) {
      this.tool.fillColor = color;
   }
   setStrokeColor(color) {
      this.tool.stokeColor = color;
   }
   setLineWidth(width) {
      this.tool.lineWidth = width;
   }
}

export default new ToolState();
