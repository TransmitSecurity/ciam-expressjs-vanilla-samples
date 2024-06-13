import express from 'express';

const router = express.Router();

/**
 * For more information see http://localhost:3000/guides/ido/overview/
 * **/

// GET login page
router.get('/', function (req, res) {
  res.redirect('menu.html');
});

router.get('/pages/sandbox', function (req, res) {
  res.redirect('sandbox.html');
});

export const indexRouter = router;