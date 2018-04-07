import * as React from 'react';
import $ from 'jquery';
import { Container, Row, Col } from 'reactstrap';

import { Vector, PointCloud } from '../../components/PointCloud';

export class Main extends React.Component<any, any> {

  constructor(props: any) {
    super(props)
    this.getVectors = this.getVectors.bind(this);
    this.state = {
      points: []
    }
    this.getVectors()
  }

  getVectors() {
    $.ajax({
      url: 'http://localhost:8080/2d',
      type: "GET",
      dataType: 'json',
      contentType: 'application/json',
      success: (data) => {
        console.log(data);
        this.setState({ points: data })
      },
      error: function (jqXHR, status, err) {
        console.log("ajax error getting data.");
      }
    });
  }

  render() {
    console.log("rendering " + this.state.points.length + " points.")
    return (

      <Container >
        <Row>
          <Col xs="12">
            <div id="point-cloud-container" style={{ 'backgroundColor': 'yellow' }}>
              <PointCloud points={this.state.points} />
            </div>
          </Col>
        </Row>
      </Container>

    );
  }
}

//