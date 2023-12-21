import express from 'express';

const router = express.Router();

/**
 * For more information see http://localhost:3000/guides/ido/overview/
 * **/

// GET application menu page
router.get('/', function (req, res) {
  res.redirect('menu.html');
});

// GET sandbox app page
router.get('/sandbox', function (req, res) {
  res.redirect('/pages/sandbox.html');
});

// GET sso demo starting app page
router.get('/sso', (req, res) => {
  res.redirect(`/air/`);
});

export const indexRouter = router;
