import * as React from 'react';
import $ from 'jquery';
import { Container, Row, Col } from 'reactstrap';

import { GeometryManager, PointCloud } from '../../components/PointCloud';

export class Main extends React.Component<any, any> {
  render() {
    return (
      <Container >
        <Row>
          <Col>
            <PointCloud geometryManager={GeometryManager} />
          </Col>
        </Row>
      </Container>
    );
  }
}
