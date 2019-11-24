import React from 'react';
import { Container, Tab, Tabs, Card } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import LanguageIcon from '@material-ui/icons/Language';
import PhoneIcon from '@material-ui/icons/Phone';
import StarIcon from '@material-ui/icons/Star';
import TodayIcon from '@material-ui/icons/Today';

/*Tabs*/
import Info from './Info';

class Supermarket extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      state: '',
      dataUser: props.dataUser,
      listSupermarkets: []
    }
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch('http://localhost:8080/v1/employee/findAllSupermarkets',
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            listSupermarkets: responseJson
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { i18n } = this.props
    const { t } = this.props;
    return (
      <Container>
        <Tabs style={{ margin: '2%' }} defaultActiveKey="supermarket" id="tabs-customer-supermaket">
          <Tab eventKey="supermarket" title={t('supermarket.labels.read')}>
            <div className="card-columns">
              {this.state.listSupermarkets.map((item, index) => (
                <Card style={{ width: '18rem' }} key={index}>
                  <Card.Img variant="top" src={item.photo} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>
                      <div>
                        <footer className="blockquote-footer" id="address">
                          <strong>{t('supermarket.data.address')}:</strong>
                          <p style={{ fontSize: '125%' }}> {item.address} | {item.latitude} , {item.longitude} </p>
                        </footer>s
                      </div>
                      <div>
                        <footer className="blockquote-footer" id="description">
                          <strong>{t('supermarket.data.description')}:</strong>
                          <p style={{ fontSize: '125%' }}> {item.description} </p>
                        </footer>
                      </div>
                    </Card.Text>
                    <Card.Text>
                      <footer className="blockquote-footer">
                        <strong>{t('supermarket.data.schedule')}:</strong> <cite title={item.schedule}> <TodayIcon fontSize='large' /> </cite>
                      </footer>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted col-3">
                      <StarIcon fontSize='small' />{item.rating}  <div></div>
                      <LanguageIcon fontSize='small' /> <a href={item.website}>{item.website}</a> <div></div>
                      <PhoneIcon fontSize='small' />{item.phone}
                    </small>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab eventKey="sitesNear" title={t('supermarket.labels.tabSitesNear')} >
            <I18nextProvider i18n={i18n}>
              <Info dataUser={this.state.dataUser} />
            </I18nextProvider>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}


export default withTranslation()(Supermarket);
