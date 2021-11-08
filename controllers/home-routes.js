// contain all of the user-facing routes, such as the homepage and login page.
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
// second arg is an object, which includes all of the data you want to pass to your template
router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        const posts = dbPostData.map(post => post.get({ plain: true }));

        res.render('homepage', { posts });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  // redirects to homepage after loggin in 
  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });

module.exports = router;
