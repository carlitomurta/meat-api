import { usersRouter } from './controllers/users/users.router';
import { Server } from './server/server';

const server = new Server();
server.bootstrap([usersRouter]).then(
  serv => {
    console.log(`Server is listening on ${serv.application.address().port}`);
  },
  error => {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1);
  }
);
