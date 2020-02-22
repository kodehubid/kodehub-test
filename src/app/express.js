import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 450 // limit each IP to 450 requests per windowMs (30 request / minute)
});

// init the express app
const app = express();

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

//  apply to all requests
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

export default app;
