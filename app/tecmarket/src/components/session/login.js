import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { I18nextProvider, withTranslation } from 'react-i18next';
import LanguageSelector from '../../translation/languageSelector';
import Logo from '../../images/logo_tecmarket.jpg';
import Menu from '../menu';
import SignUp from './signup';


class LogIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isUser: false,
      isCreateAccount: false,
      email: '',
      password: '',
      dataUser: [],
      messageError: ''
    };

  }

  _handleChangeEmail = event => {
    this.setState({
      email: event.target.value
    });
  };

  _handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  };

  _onSignUpPressed = () => {
    this.setState({ isCreateAccount: true })
  };

  _submitData = async () => {
    const { t } = this.props;
    if (this.state.password === '' || this.state.email === '') {
      this.setState({
        messageError: t('login.messages.errorEmpty')
      })
    }
    else if (await this._verifyData()) {
      this.setState({
        isUser: true,
        messageError: ''
      });
    }
    else {
      this.setState({
        messageError: t('login.messages.errorCredential')
      })
    }
  };

  _verifyData = async () => {
    let data = {
      email: this.state.email,
      password: this.state.password
    }
    return await fetch('http://localhost:8080/v1/users/login',
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(responseJson => {
        if (JSON.stringify(responseJson) !== '{}') {
          this.setState({
            messageError: '',
            dataUser: responseJson
          })
          return true;
        } else {
          return false;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { i18n } = this.props
    const { t } = this.props;
    if (this.state.isUser) {
      return (
        <I18nextProvider i18n={i18n}>
          <Menu dataUser={this.state.dataUser} />
        </I18nextProvider>
      );
    }
    else if (this.state.isCreateAccount) {
      return (
        <I18nextProvider i18n={i18n}>
          <SignUp />
        </I18nextProvider>
      )
    }
    else {
      return (
        <Container>
          <div style={{ textAlign: 'center' }}>
            <img style={{ margin: '2%' }} src={Logo} height='30%' width='25%' alt="logo.png"></img>
          </div>
          <Row className='justify-content-md-center' style={{ marginTop: '3%' }}>
            <Col md='auto'>
              <Form>
                <Form.Group controlId='formBasicUser' style={{ marginTop: '3%' }}>
                  <Form.Label>{t('login.label.email')}</Form.Label>
                  <Form.Control
                    type='string'
                    placeholder={t('login.placeholders.email')}
                    onChange={this._handleChangeEmail}
                    value={this.state.email}
                  />
                </Form.Group>
                <Form.Group controlId='formBasicPassword' style={{ marginTop: '3%' }}>
                  <Form.Label>{t('login.label.password')}</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder={t('login.placeholders.password')}
                    onChange={this._handleChangePassword}
                    value={this.state.password}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row className='justify-content-md-center' style={{ margin: '2%' }}>
            <div>
              <p style={{ color: 'red' }}>{this.state.messageError}</p>
            </div>
          </Row>
          <Row className='justify-content-md-center' style={{ marginTop: '3%' }}>
            <div >
              <Button
                variant='primary'
                size='lg'
                type='submit'
                onClick={this._submitData}
              >
                {t('login.buttons.login')}
              </Button>
            </div>

            <div>
              <Col md='auto'>
                <Button
                  variant='primary'
                  size='lg'
                  onClick={this._onSignUpPressed}
                >
                  {t('login.buttons.signup')}
                </Button>
              </Col>
            </div>
          </Row>
          <I18nextProvider i18n={i18n}>
            <LanguageSelector type={"down"} />
          </I18nextProvider>
        </Container>
      );
    }
  }
}
export default withTranslation()(LogIn);
