const router = require('express').Router();
const { Project, User } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth');

// GET all projects for homepage
router.get('/', async (req, res) => {
  try {
    //   const projectData = await Project.findAll();
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });
    const projects = projectData.map((project) => project.get({ plain: true }));
    res.render('homepage', {
      projects,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// route to get project by ID
router.get('/projects/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id);
    const projects = projectData.get({ plain: true });
    res.render('project', {
      projects,
      loggedIn: req.session.loggedIn,
    });
    if (!projectData) {
      res.status(404).json({ message: 'No project with this id!' });
      return;
    }
  } catch (err) {
    console.log('error');
    // res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  // list of projects from user
  //and username from session
  // find projects for user
  // user.findByPk(user.id)
  // SQL: SELECT `id`, `name`, `description`, `date_created`, `needed_funding`, `user_id` FROM `project` AS `project` WHERE `project`.`id` = 'profile';
  // should be WHERE `project`.`user_id` = `profile`?
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });
    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
  res.render('profile');
});

module.exports = router;
