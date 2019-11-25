import React from 'react';
import { Button, Card, Col, Container, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

/*Tabs*/
import ReadOrder from './Read';
import UpdateOrder from './Update';

class Order extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
  }


  render() {
    const { i18n } = this.props
    const { t } = this.props;
    return (
      <Container>
        <Tabs defaultActiveKey="read" id="uncontrolled-tab-example">
          <Tab eventKey="read" title={t('order.labels.viewAllOrder')} >
            <I18nextProvider i18n={i18n}>
              <ReadOrder />
            </I18nextProvider>
          </Tab>
          <Tab eventKey="delete" title={t('order.labels.update')} >
            <I18nextProvider i18n={i18n}>
              <UpdateOrder />
            </I18nextProvider>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default withTranslation()(Order)
