import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser'
import { uploadFile } from './controller/uploadExcel.js';
import multer from 'multer'

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(cors());
app.get('/', (req, res) => {
  res.render('index');
});
app.post('/upload', upload.single('formFile'), uploadFile);

app.listen(process.env.PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${process.env.PORT}`)
);