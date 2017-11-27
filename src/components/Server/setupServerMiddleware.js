import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorhandler from 'errorhandler';
import methodOverride from 'method-override';
import morgan from 'morgan';

export default function setupServerMiddleware (server) {
  // https://expressjs.com/en/resources/middleware/method-override.html
  server.use(methodOverride('X-HTTP-Method-Override'));

  if (process.env.NODE_ENV === 'development') server.use(errorhandler());

  // https://expressjs.com/en/resources/middleware/body-parser.html
  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  server.use(bodyParser.json());


  //https://expressjs.com/en/resources/middleware/cookie-parser.html
  server.use(cookieParser());

  // https://expressjs.com/en/resources/middleware/morgan.html
  // TODO: complete this setup
  server.use(morgan('combined'));
}
