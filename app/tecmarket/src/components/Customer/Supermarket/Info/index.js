import React from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@material-ui/core/IconButton';
import LanguageIcon from '@material-ui/icons/Language';
import PhoneIcon from '@material-ui/icons/Phone';
import StarIcon from '@material-ui/icons/Star';
import TodayIcon from '@material-ui/icons/Today';

class InfoSupermarket extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      listSupermarkets: [],
      listNearbyPlaces: [],
      listUserNearbyPlaces: [],
      selectSupermarket: '',
      radius: '',
      type: [],
      dataUser: props.dataUser,
      isResultSuccess: false
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

  _handleChangeRadius(event) {
    this.setState({
      radius: event.target.value
    })
  }

  _handleChangeSelectType = (event) => {
    this.setState({
      type: event.value
    })
  }

  _handleChangeSelectSupermarket(event) {
    this.setState({
      selectSupermarket: event.target.value
    })
  }

  _onClickAddPlace = async (place) => {
    let data = {
      origins: this.state.selectSupermarket,
      destinations: place.place_id
    }
    let distance = await fetch('http://localhost:8080/v1/distancePlaceSupermarket',
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          return responseJson.result;
        }
      })
      .catch(error => {
        console.error(error);
      });
    place["distance"] = distance
    console.log(place)
    this.setState({
      listUserNearbyPlaces: [...this.state.listUserNearbyPlaces, place]
    })
  }

  _onClickSearchNearbyPlaces = async () => {
    const { t } = this.props;
    this.setState({
      isResultSuccess: false
    })
    if (this.state.selectSupermarket === '') {
      window.confirm(t('supermarket.info.messages.errorEmptySuper'))
    }
    else if (this.state.radius === '') {
      window.confirm(t('supermarket.info.messages.errorEmptyRadius'))
    } else {
      let result = await this._onClickSearchNearbyPlacesDetailPhotos();
      this.setState({
        listNearbyPlaces: result,
        isResultSuccess: true
      })
      if (result.length !== 0) {

      }
    }
  }

  _onClickSearchNearbyPlacesDetailPhotos = async () => {
    let data = {
      location: this.state.selectSupermarket,
      type: this.state.type,
      radius: this.state.radius
    }
    let nearbyPlaces = await fetch('http://localhost:8080/v1/findNearPlaces',
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          return responseJson;
        }
      })
      .catch(error => {
        console.error(error);
      });

    // /** GET Detail for Place * \\\
    let detailPlace = []
    nearbyPlaces.forEach(async (element) => {
      detailPlace.push(await this._getDetailsPlace(element.place_id))
    })
    return detailPlace;
  }

  /** GET detail for place nearby */
  _getDetailsPlace = async (place) => {
    let placeDetail = await fetch(`http://localhost:8080/v1/detailPlace/${place}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          return responseJson
        }
      })
    placeDetail["place_id"] = place;
    Object.keys(placeDetail).includes("photos") ? placeDetail["photo"] = await this._getPhotoPlace(placeDetail.photos[0].photo_reference) : placeDetail["photo"] = ''
    return placeDetail;
  }

  /** GET photo url for place */
  _getPhotoPlace = async (place) => {
    return await fetch(`http://localhost:8080/v1/detailPlacePhoto/${place}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '') {
          return responseJson.url
        }
      })
  }

  render() {
    const { t } = this.props;
    const optionsType = [
      { value: 'restaurant', label: t('supermarket.info.types.restaurant') },
      { value: 'movie_theater', label: t('supermarket.info.types.movie_theater') },
      { value: 'doctor', label: t('supermarket.info.types.doctor') },
      { value: 'museum', label: t('supermarket.info.types.museum') },
      { value: 'bar', label: t('supermarket.info.types.bar') }
    ];
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h6 align='center'>{t('supermarket.info.labels.Title')}</h6>
        </div>
        <div>
          <Form>
            <Form.Row style={{ marginTop: '2%' }}>
              <Form.Group as={Row} controlId="ControlSelectSuper">
                <Form.Label>{t('supermarket.info.labels.supermarket')}</Form.Label>
                <Form.Control as="select" defaultValue={'DEFAULT'} onChange={this._handleChangeSelectSupermarket.bind(this)}>
                  <option value={'DEFAULT'} disabled hidden>{t('supermarket.info.labels.selectSupermarket')}</option>
                  {this.state.listSupermarkets.map((item, index) => (
                    <option value={`${item.latitude},${item.longitude}`} key={index}>({item.name}) -  {item.address}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row style={{ marginTop: '2%' }}>

              <Form.Group as={Col} controlId="ControlRadius">
                <Form.Label>{t('supermarket.info.labels.type')}</Form.Label>
                <Select
                  placeholder={t('supermarket.info.labels.selectType')}
                  onChange={this._handleChangeSelectType}
                  options={optionsType}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </Form.Group>

              <Form.Group as={Col} controlId="ControlRadius">
                <Form.Label>{t('supermarket.info.labels.radius')}</Form.Label>
                <Form.Control type='string' placeholder={t('supermarket.info.labels.radius')} onChange={this._handleChangeRadius.bind(this)} />
              </Form.Group>

              <Button className='sm-col-3' style={{ margin: '3%' }}
                variant="info" onClick={this._onClickSearchNearbyPlaces}>
                {t('supermarket.info.buttons.search')}
              </Button>
            </Form.Row>
          </Form>
        </div>


        {this.state.isResultSuccess ?
          <div className="card-columns">
            {this.state.listNearbyPlaces.map((item, index) => (
              <Card style={{ width: '18rem' }} key={index}>
                <Card.Img variant="top" src={item.photo} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    <div>
                      <footer className="blockquote-footer" id="address">
                        <strong>{t('supermarket.data.address')}:</strong>
                        {item.adr_address}
                        <p style={{ fontSize: '125%' }}>  | {item.geometry.location.lat} , {item.geometry.location.lng} </p>
                      </footer>
                    </div>
                    <div>
                      <footer className="blockquote-footer" id="description">
                        <strong>{t('supermarket.data.description')}:</strong>
                        <p style={{ fontSize: '125%' }}> {item.vicinity} </p>
                      </footer>
                    </div>
                  </Card.Text>
                  <Card.Text>
                    <footer className="blockquote-footer">
                      <strong>{t('supermarket.data.schedule')}:</strong> <cite title={Object.keys(item).includes("opening_hours") ? item.opening_hours.weekday_text : ''}> <TodayIcon fontSize='large' /> </cite>
                    </footer>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className='row row-fluid'>
                    <div className='col'>
                      <small className="text-muted col-3">
                        <StarIcon fontSize='small' />{item.rating}  <div></div>
                        <LanguageIcon fontSize='small' /> <a href={item.website}>{item.website}</a> <div></div>
                        <PhoneIcon fontSize='small' />{item.international_phone_number}
                      </small>
                    </div>
                  </div>
                  <div className='row justify-content-center' style={{ margin: '2%' }}>
                    <Button variant="success" onClick={this._onClickAddPlace.bind(this, item)} >{t('supermarket.info.buttons.add')}</Button>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div> : null
        }
        <div>
          <Table responsive striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>{t('supermarket.info.labels.place')}</th>
                <th>{t('supermarket.info.labels.distance')}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listUserNearbyPlaces.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.distance}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}


export default withTranslation()(InfoSupermarket);
