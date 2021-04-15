import { makeAutoObservable } from 'mobx';

class App {
   sessionId = null;
   socket = null;
   constructor() {
      makeAutoObservable(this);
   }

   setSessionId(id) {
      this.sessionId = id;
   }

   setSocket(socket) {
      this.socket = socket;
   }
}

export default new App();
