import React from 'react';
import { Link } from 'react-router-dom';
import Notifications from '../Notifications';

import { Container, Content, Profile } from './styles';
import logo from '../../assets/logo-purple.svg';

export default function Header() {
  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="logotipo" />
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>Rodrigo Santos</strong>
              <Link to="/profile">Meu perfil</Link>
            </div>
            <img
              src=" https://api.adorable.io/avatars/102/abott@adorable.png"
              alt="logo perfil"
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
