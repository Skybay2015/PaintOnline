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

const Canvas = observer(() => {
   const { id } = useParams();
   const canvasRef = useRef();
   const usernameRef = useRef();

   const [modal, setModal] = useState(true);

   useEffect(() => {
      canvasState.setCanvas(canvasRef.current);
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
               case 'draw':
                  drawHandler(message);
                  break;
            }
         };
      }
   }, [canvasState.username]);

   const drawHandler = (msg) => {
      const figure = msg.figure;
      const ctx = canvasRef.current.getContext('2d');
      const mainColor = toolState.mainColor;
      switch (figure.type) {
         case 'brush':
            Brush.draw(ctx, figure.x, figure.y, figure.color);
            break;

         case 'rect':
            Rect.staticDraw(
               ctx,
               figure.x,
               figure.y,
               figure.width,
               figure.height,
               figure.color,
            );
            ctx.fillStyle = mainColor;
            break;

         case 'circle':
            Circle.staticDraw(
               ctx,
               figure.x,
               figure.y,
               figure.r,
               figure.width,
               figure.height,
               figure.color,
            );
            ctx.fillStyle = mainColor;
         case 'finish':
            ctx.beginPath();
            ctx.fillStyle = mainColor;
            ctx.strokeStyle = mainColor;
      }
   };

   const mouseDownHandler = () => {
      canvasState.pushToUndo(canvasRef.current.toDataURL());
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
            ref={canvasRef}
            width={900}
            height={500}
         />
      </div>
   );
});

export default Canvas;
