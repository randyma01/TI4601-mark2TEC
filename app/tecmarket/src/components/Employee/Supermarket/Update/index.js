import React from 'react';
import { Card, Button, Col, Container, Form, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import PhoneIcon from '@material-ui/icons/Phone';
import Refresh from '@material-ui/icons/Refresh';
import StarIcon from '@material-ui/icons/Star';
import TodayIcon from '@material-ui/icons/Today';

class Supermarket extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      listSupermarkets: [],
      address: '',
      description: '',
      latitude: '',
      longitude: '',
      name: '',
      phone: '',
      photo: '',
      rating: '',
      schedule: '',
      id: '',
      showEditSuper: false,
      urlWebsite: ''
    };
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

  _handleChangeAddress(event) {
    this.setState({ address: event.target.value })
  }

  _handleChangeDescription(event) {
    this.setState({ description: event.target.value })
  }

  _handleChangeLatitude(event) {
    this.setState({ latitude: event.target.value })
  }

  _handleChangeLongitude(event) {
    this.setState({ longitude: event.target.value })
  }

  _handleChangeName(event) {
    this.setState({ name: event.target.value })
  }

  _handleChangePhone(event) {
    this.setState({ phone: event.target.value })
  }

  _handleChangePhoto(event) {
    this.setState({ photo: event.target.value })
  }

  _handleChangeRating(event) {
    this.setState({ rating: event.target.value })
  }

  _handleChangeSchedule(event) {
    this.setState({ schedule: event.target.value })
  }

  _handleChangeWebSite(event) {
    this.setState({ urlWebsite: event.target.value })
  }

  _onClickEditSupermarket(supermarket) {
    const { t } = this.props;
    const verify = window.confirm(t('supermarket.messages.confirmUpdate'))
    if (verify) {
      this.setState({
        address: supermarket.address,
        description: supermarket.description,
        latitude: supermarket.latitude,
        longitude: supermarket.longitude,
        name: supermarket.name,
        phone: supermarket.phone,
        photo: supermarket.photo,
        rating: supermarket.rating,
        schedule: supermarket.schedule,
        urlWebsite: supermarket.website,
        id: supermarket.id,
        showEditSuper: !this.state.showEditSuper
      });
    }
  }

  _onClickRefreshSupermarkets = async () => {
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

  _submitData = async () => {
    const { t } = this.props;
    let data = {
      address: this.state.address,
      description: this.state.description,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      name: this.state.name,
      phone: this.state.phone,
      photo: this.state.photo,
      rating: this.state.rating,
      schedule: this.state.schedule,
      urlWebsite: this.state.urlWebsite,
      id: this.state.id
    }
    await fetch('http://localhost:8080/v1/employee/editSupermarket',
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.result === 'update') {
          window.confirm(t('supermarket.messages.successUpdate'))
          this.setState({
            showEditSuper: !this.state.showEditSuper,
            address: '',
            description: '',
            latitude: '',
            longitude: '',
            name: '',
            phone: '',
            photo: '',
            rating: '',
            schedule: '',
            urlWebsite: ''
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  };


  _onShowModal() {
    const { t } = this.props;
    return (
      <Modal
        show={this.state.showEditSuper}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {t('supermarket.labels.update')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId='formGridLat'>
                <Form.Label>{t('supermarket.data.latitude')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.latitude')} value={this.state.latitude} onChange={this._handleChangeLatitude.bind(this)} />
              </Form.Group>

              <Form.Group as={Col} controlId='formGridLng'>
                <Form.Label>{t('supermarket.data.longitude')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.longitude')} value={this.state.longitude} onChange={this._handleChangeLongitude.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridAddress'>
                <Form.Label>{t('supermarket.data.address')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.address')} value={this.state.address} onChange={this._handleChangeAddress.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridName'>
                <Form.Label>{t('supermarket.data.name')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.name')} value={this.state.name} onChange={this._handleChangeName.bind(this)} />
              </Form.Group>
              <Form.Group as={Col} controlId='formGridDescript'>
                <Form.Label>{t('supermarket.data.description')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.description')} value={this.state.description} onChange={this._handleChangeDescription.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPhone'>
                <Form.Label>{t('supermarket.data.phone')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.phone')} value={this.state.phone} onChange={this._handleChangePhone.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridRating'>
                <Form.Label>{t('supermarket.data.rating')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.rating')} value={this.state.rating} onChange={this._handleChangeRating.bind(this)} />
              </Form.Group>

              <Form.Group as={Col} controlId='formGridWebsite'>
                <Form.Label>{t('supermarket.data.website')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.website')} value={this.state.urlWebsite} onChange={this._handleChangeWebSite.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridSchedule'>
                <Form.Label>{t('supermarket.data.schedule')}</Form.Label>
                <Form.Control type="string" placeholder={t('supermarket.data.schedule')} value={this.state.schedule} onChange={this._handleChangeSchedule.bind(this)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId='formGridPhoto'>
                <Form.Label>{t('supermarket.data.photo')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.data.photo')} value={this.state.photo} onChange={this._handleChangePhoto.bind(this)} />
                <div style={{ textAlign: 'center' }}>
                  <img style={{ margin: '2%' }} src={this.state.photo} height='25%' width='25%' alt="supermarket"></img>
                </div>
              </Form.Group>
            </Form.Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            this.setState({
              showEditSuper: !this.state.showEditSuper,
              address: '',
              description: '',
              latitude: '',
              longitude: '',
              name: '',
              phone: '',
              photo: '',
              rating: '',
              schedule: '',
              urlWebsite: ''
            })
          }}>
            {t('supermarket.buttons.cancelAddSupermarket')}
          </Button>
          <Button variant="primary" onClick={this._submitData}>
            {t('supermarket.buttons.addSupermarket')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }



  render() {
    const { t } = this.props;
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'> {t('supermarket.labels.update')} </h3>
        </div>
        <div style={{ margin: '5%' }}>
          <IconButton aria-label="refresh" onClick={this._onClickRefreshSupermarkets}>
            <Refresh />
          </IconButton>
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
                      </footer>
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
                  <div className='row row-fluid'>
                    <div className='col'>
                      <small className="text-muted col-3">
                        <StarIcon fontSize='small' />{item.rating}  <div></div>
                        <LanguageIcon fontSize='small' /> <a href={item.website}>{item.website}</a> <div></div>
                        <PhoneIcon fontSize='small' />{item.phone}
                      </small>
                    </div>
                    <div className='col'>
                      <IconButton aria-label="edit" style={{ color: '#32a863' }} onClick={this._onClickEditSupermarket.bind(this, item)}>
                        <EditIcon />
                      </IconButton>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
          <div>
            {this._onShowModal()}
          </div>
        </div>
      </Container>
    );
  }
}


export default withTranslation()(Supermarket);
