import { Review } from './reviews.model';
import * as restify from 'restify';
import { ModelRouter } from '../../common/model-router';

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review);
  }

  findById = (
    req: restify.Request,
    resp: restify.Response,
    next: restify.Next
  ) => {
    this.model
      .findById(req.params.id)
      .populate('user', 'name')
      .populate('restaurant')
      .then(this.render(resp, next))
      .catch(next);
  };

  applyRoutes(application: restify.Server) {
    application.get('/reviews', this.findAll);
    application.get('/reviews/:id', [this.validateId, this.findById]);
    application.post('/reviews', this.save);
  }
}
export const reviewsRouter = new ReviewsRouter();
