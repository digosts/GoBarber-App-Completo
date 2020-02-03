import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.user_id, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    res.status(200).json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Campos inválidos!' });
    }

    const { provider_id, date } = req.body;

    /** Checar se é um provider válido */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Você não tem permissão de acesso!',
      });
    }

    const hourStart = startOfHour(parseISO(date));

    /** Verifica se data é menor que atual */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        erro: 'Data não permitida!',
      });
    }

    /** Verifica se existe agendamento ativo na mesma hora */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({
        erro: 'Já existe um agendamento marcado nesse horário!',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date: hourStart,
    });

    return res.status(200).json(appointment);
  }
}

export default new AppointmentController();
