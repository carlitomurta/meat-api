import { mergePatchBodyParser } from './merge-patch.parser';
import { enviroment } from './../common/enviroment';
import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { Router } from '../common/router';

export class Server {
  application: restify.Server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
  });

  initializeDb(): Promise<any> {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(enviroment.db.url, {
      useNewUrlParser: true
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);

        routers.forEach(route => {
          route.applyRoutes(this.application);
        });

        this.application.listen(enviroment.server.port, () => {
          resolve(this.application);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }
}
