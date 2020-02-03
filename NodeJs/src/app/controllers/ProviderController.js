import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ],
    });

    return res.status(200).json({
      providers,
    });
  }

  async listAppointments(req, res) {
    const checkUserProvider = await User.findOne({
      wehre: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({
        error: 'Você não tem permissão de acesso!',
      });
    }

    const parseDate = parseISO(req.body.date);

    const appoiments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.betwwn]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });

    return res.status(200).json(appoiments);
  }
}

export default new ProviderController();
