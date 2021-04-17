import React from 'react';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import '../../styles/toolbar.sass';
import Brush from '../../tools/Brush';
import Circle from '../../tools/Circle';
import Rect from '../../tools/Rect';
import Line from '../../tools/Line';
import Eraser from '../../tools/Eraser';
import { observer } from 'mobx-react-lite';
import appState from '../../store/appState';
const ToolBar = observer(() => {
   const changeColor = (e) => {
      toolState.setFillColor(e.target.value);
      toolState.setStrokeColor(e.target.value);
   };

   return (
      <div className='toolbar'>
         <button
            className='toolbar__btn brush'
            onClick={() =>
               toolState.setTool(
                  new Brush(
                     canvasState.canvas,
                     appState.socket,
                     appState.sessionId,
                  ),
               )
            }
         />
         <button
            className='toolbar__btn rect'
            onClick={() =>
               toolState.setTool(
                  new Rect(
                     canvasState.canvas,
                     appState.socket,
                     appState.sessionId,
                  ),
               )
            }
         />
         <button
            className='toolbar__btn circle'
            onClick={() =>
               toolState.setTool(
                  new Circle(
                     canvasState.canvas,
                     appState.socket,
                     appState.sessionId,
                  ),
               )
            }
         />
         <button
            className='toolbar__btn eraser'
            onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}
         />
         <button
            className='toolbar__btn line'
            onClick={() =>
               toolState.setTool(
                  new Line(
                     canvasState.canvas,
                     appState.socket,
                     appState.sessionId,
                  ),
               )
            }
         />
         <input onChange={changeColor} type='color' />
         <button
            className='toolbar__btn undo'
            onClick={() =>
               canvasState.undo(appState.socket, appState.sessionId)
            }
         />
         <button
            className='toolbar__btn redo'
            onClick={() =>
               canvasState.redo(appState.socket, appState.sessionId)
            }
         />
         <button className='toolbar__btn save' />
      </div>
   );
});

export default ToolBar;
