import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import configs from './configs';

// init the express app
const app = express();
// create a limiter middleware
const limiter = rateLimit(configs.express.requestLimit);

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

//  apply to all requests
app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

export default app;
