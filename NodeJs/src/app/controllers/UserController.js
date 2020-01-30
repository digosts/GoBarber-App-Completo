import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExsist = await User.findOne({ where: { email: req.body.email } });

    if (userExsist) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    return res.status(400).json({ error: 'Sem token!' });
  }
}

export default new UserController();
