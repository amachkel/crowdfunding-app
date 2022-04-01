const router = require('express').Router();
const { Project, User } = require('../models');

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
router.get('/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id);
    res.status(200).json(projectData);
    if (!projectData) {
      res.status(404).json({ message: 'No project with this id!' });
      return;
    }
    // const project = projectData.get({ plain: true });
    // res.render('project', project);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;