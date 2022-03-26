import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser'
import router from './routes/index.js';

const app = express();
app.use(express.static('./public'));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// set the view engine to ejs
// app.set('views', './views');
// app.set('view engine', 'ejs');
app.use(cors());
app.use('/api', router);

app.listen(process.env.PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${process.env.PORT}`)
);