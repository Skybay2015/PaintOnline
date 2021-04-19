import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import '../../styles/canvas.sass';
import canvasState from '../../store/canvasState';
import toolState from '../../store/toolState';
import Brush from '../../tools/Brush';
import Modal from '../Modal';
import { useParams } from 'react-router-dom';
import appState from '../../store/appState';
import Rect from '../../tools/Rect';
import Circle from '../../tools/Circle';
import Line from '../../tools/Line';
import axios from 'axios';
import Eraser from '../../tools/Eraser';

const Canvas = observer(() => {
   const { id } = useParams();
   const canvasRef = useRef();
   const usernameRef = useRef();

   const [modal, setModal] = useState(true);

   useEffect(() => {
      canvasState.setCanvas(canvasRef.current);
      const ctx = canvasRef.current.getContext('2d');
      axios.get(`http://localhost:5000/image?id=${id}`).then((respose) => {
         const img = new Image();
         img.src = respose.data;
         img.onload = () => {
            ctx.clearRect(
               0,
               0,
               canvasRef.current.width,
               canvasRef.current.height,
            );
            ctx.drawImage(
               img,
               0,
               0,
               canvasRef.current.width,
               canvasRef.current.height,
            );
         };
      });
   }, []);

   useEffect(() => {
      if (canvasState.username) {
         const socket = new WebSocket(`ws://localhost:5000/`);
         appState.setSocket(socket);
         appState.setSessionId(id);
         toolState.setTool(new Brush(canvasRef.current, socket, id));
         socket.onopen = () => {
            socket.send(
               JSON.stringify({
                  id,
                  username: canvasState.username,
                  method: 'connection',
               }),
            );
         };
         socket.onmessage = (event) => {
            let message = JSON.parse(event.data);
            switch (message.method) {
               case 'connection':
                  console.log(`user ${message.username}`);
                  break;
               case 'picture':
                  pictureHandler(message);
                  break;
               case 'draw':
                  drawHandler(message);
                  break;
               default:
                  return;
            }
         };
      }
   }, [canvasState.username]);

   const returnMainSettings = (mainColor, strokeColor, lineWidth) => {
      toolState.setFillColor(mainColor);
      toolState.setStrokeColor(strokeColor);
      toolState.setLineWidth(lineWidth);
   };

   const pictureHandler = (msg) => {
      const {
         data: { url: dataUrl },
      } = msg;
      const ctx = canvasRef.current.getContext('2d');

      let img = new Image();
      img.src = dataUrl;
      img.onload = () => {
         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
         ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
         );
      };
   };

   const drawHandler = (msg) => {
      const figure = msg.figure;
      const ctx = canvasRef.current.getContext('2d');
      const mainColor = toolState.mainColor;
      const strokeColor = toolState.strokeColor;
      const lineWidth = toolState.lineWidth;

      switch (figure.type) {
         case 'brush':
            Brush.draw(ctx, figure.x, figure.y, figure.color, figure.lineWidth);
            break;

         case 'rect':
            Rect.staticDraw(
               ctx,
               figure.x,
               figure.y,
               figure.width,
               figure.height,
               figure.color,
               figure.strokeColor,
               figure.lineWidth,
            );
            returnMainSettings(mainColor, strokeColor, lineWidth);
            ctx.beginPath();

            break;

         case 'circle':
            Circle.staticDraw(
               ctx,
               figure.x,
               figure.y,
               figure.r,
               figure.color,
               figure.strokeColor,
               figure.lineWidth,
            );
            returnMainSettings(mainColor, strokeColor, lineWidth);
            ctx.beginPath();
            break;
         case 'eraser':
            Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
            break;
         case 'line':
            Line.staticDraw(
               ctx,
               figure.currentX,
               figure.currentY,
               figure.x,
               figure.y,
               figure.color,
               figure.lineWidth,
            );
            returnMainSettings(mainColor, strokeColor, lineWidth);
            ctx.beginPath();
            break;
         case 'finish':
            ctx.beginPath();
            returnMainSettings(mainColor, strokeColor, lineWidth);
            break;
         default:
            return;
      }
   };

   const mouseDownHandler = () => {
      canvasState.pushToUndo(canvasRef.current.toDataURL());
   };

   const mouseUpHandler = () => {
      axios.post(`http://localhost:5000/image?id=${id}`, {
         img: canvasRef.current.toDataURL(),
      });
   };

   const connectionHandler = () => {
      canvasState.setUsername(usernameRef.current.value);
      setModal(false);
   };

   return (
      <div className='canvas'>
         <Modal
            connectionHandler={connectionHandler}
            modal={modal}
            usernameRef={usernameRef}
         />
         <canvas
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            ref={canvasRef}
            width={900}
            height={500}
         />
      </div>
   );
});

export default Canvas;
