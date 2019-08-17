import { Router } from './router';
import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<D>) {
    super();
  }

  validateId = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Documento nao encontrado'));
    } else {
      next();
    }
  };

  findAll = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .find()
      .then(this.renderAll(resp, next))
      .catch(next);
  };

  findById = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .findById(req.params.id)
      .then(this.render(resp, next))
      .catch(next);
  };

  save = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    const document = new this.model(req.body);

    document
      .save()
      .then(this.render(resp, next))
      .catch(next);
  };

  replace = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    const options = { runValidators: true, override: true };
    this.model
      .update({ _id: req.params.id }, req.body, options)
      .exec()
      .then(result => {
        if (result.n) {
          return this.model.findById(req.params.id);
        } else {
          throw new NotFoundError('Documento nao encontrado');
        }
      })
      .then(this.render(resp, next))
      .catch(next);
  };

  update = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    const options = { runValidators: true, new: true };
    this.model
      .findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(resp, next))
      .catch(next);
  };

  delete = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .remove({ _id: req.params.id })
      .exec()
      .then(cmd => {
        if (cmd.n) {
          resp.send(204);
        } else {
          throw new NotFoundError('Documento nao encontrado');
        }
        return next();
      })
      .catch(next);
  };
}
