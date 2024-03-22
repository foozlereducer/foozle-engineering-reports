import express from 'express';
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.redirect('http://localhost:5173')
})


export {router as indexRouter};
