import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalWindow = ({ modal, usernameRef, connectionHandler }) => {
   return (
      <>
         <Modal show={modal}>
            <Modal.Header>
               <Modal.Title>Enter your name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <input ref={usernameRef} type='text' />
            </Modal.Body>
            <Modal.Footer>
               <Button variant='secondary' onClick={connectionHandler}>
                  Enter
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default ModalWindow;
