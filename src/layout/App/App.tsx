import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';

import { Main } from '../Main';

export class App extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Main />
          </Col>
        </Row>
      </Container>
    );
  }
}
