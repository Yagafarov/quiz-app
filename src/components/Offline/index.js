import React from 'react';
import { Container, Segment, Header, Icon } from 'semantic-ui-react';

const Offline = () => {
  window.addEventListener('online', () => window.location.reload());

  return (
    <Container>
      <Segment placeholder>
        <Header icon>
          <Icon name="unlink" />
          <h1>Offline</h1>
          <p>
            Internet aloqasi yo'q. Tarmoqqa ulanganingizdan keyin avtomatik ravishda qayta yuklanadi!{' '}
            <span role="img" aria-label="signal">
              📶
            </span>
          </p>
        </Header>
      </Segment>
    </Container>
  );
};

export default Offline;
