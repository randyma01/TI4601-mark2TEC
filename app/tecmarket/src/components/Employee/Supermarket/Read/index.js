import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      listSupermarkets: []
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

  render() {
    const { t } = this.props;
    return (
      <Container>
        <div style={{ margin: '2%' }}>
          <h3 align='center'> {t('supermarket.labels.read')} </h3>
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
                  <small className="text-muted col-3">
                    <StarIcon fontSize='small' />{item.rating}  <div></div>
                    <LanguageIcon fontSize='small' /> <a href={item.website}>{item.website}</a> <div></div>
                    <PhoneIcon fontSize='small' />{item.phone}
                  </small>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }
}


export default withTranslation()(Supermarket);
