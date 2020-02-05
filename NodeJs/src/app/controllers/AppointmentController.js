import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import User from '../models/User';
import File from '../models/File';
import Mail from '../../lib/mail';

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

    /** Checar se o provedor não é o mesmo usuário */
    if (req.body.user_id === provider_id) {
      return res.status(401).json({
        error: 'O usuário nõ pode ser igual ao provedor!',
      });
    }

    /** Checar se é um provider válido */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Você não tem permissão de acesso!',
      });
    }

    /** Verifica se data é menor que atual */
    const hourStart = startOfHour(parseISO(date));

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

    /** Notificar agendamento */
    const user = await User.findByPk(req.user_id);
    const formatDate = format(hourStart, "'dia' dd 'de' 'MMMM', às 'H:mm'h", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formatDate}`,
      user: provider_id,
    });

    return res.status(200).json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.user_id) {
      return res.status(401).json({
        error: 'Você não tem permissão de acesso!',
      });
    }

    const dateLimite = subHours(appointment.date, 2);

    if (isBefore(dateLimite, new Date())) {
      return res.status(401).json({
        error: 'Horário limite de cancelamento é de 2hrs!',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.Save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'Você tem um novo agendamento',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' 'MMMM', às 'H:mm'h", {
          locale: pt,
        }),
      },
    });

    return res.status(200).json(appointment);
  }
}

export default new AppointmentController();
