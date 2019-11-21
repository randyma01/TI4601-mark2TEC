import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nextProvider, withTranslation } from 'react-i18next';
import LanguageSelector from '../../translation/languageSelector';
import Menu from '../menu';
import Login from './login';

class Signup extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      birthDay: '',
      email: '',
      firstName: '',
      id: '',
      isCreateAccount: false,
      lastName: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      dataUser: [],
      userName: ''
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    //TODO
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _handleChangeBirthDay(event) {
    this.setState({ birthDay: event.target.value })
  }

  _handleChangeEmail(event) {
    this.setState({ email: event.target.value })
  }

  _handleChangeFirstName(event) {
    this.setState({ firstName: event.target.value })
  }

  _handleChangeId(event) {
    this.setState({ id: event.target.value })
  }

  _handleChangeLastName(event) {
    this.setState({ lastName: event.target.value })
  }

  _handleChangePassword(event) {
    this.setState({ password: event.target.value })
  }

  _handleChangePasswordConfirm(event) {
    this.setState({ passwordConfirm: event.target.value })
  }

  _handleChangePhone(event) {
    this.setState({ phone: event.target.value })
  }

  _handleChangeUserName(event) {
    this.setState({ userName: event.target.value })
  }

  _submitData = async () => {
    const { t } = this.props;
    if (this.state.firstName === '' || this.state.lastName === '') {
      window.confirm(t('signup.messages.errorName'))
    }
    else if (this.state.id === '' || this.state.userName === '') {
      window.confirm(t('signup.messages.errorUserName'))
    }
    else if (this.state.birthDay === '') {
      window.confirm(t('signup.messages.errorBirthday'))
    }
    else if (this.state.email === '') {
      window.confirm(t('signup.messages.errorEmail'))
    }
    else if (this.state.phone === '') {
      window.confirm(t('signup.messages.errorPhone'))
    }
    else if (this.state.password === '') {
      window.confirm(t('signup.messages.errorPassword'))
    }
    else if (this.state.password.length < 6) {
      window.confirm(t('signup.messages.errorPasswordLength'))
    }
    else if (this.state.password !== this.state.passwordConfirm) {
      window.confirm(t('signup.messages.errorPasswordConfirm'))
    }
    else {
      let data = {
        birthday: this.state.birthDay,
        email: this.state.email,
        identification: this.state.id,
        name: `${this.state.firstName}  ${this.state.lastName}`,
        password: this.state.password,
        phone: this.state.phone,
        username: this.state.userName
      }
      await fetch('http://localhost:8080/v1/customer/createProfile',
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.result === 'Error add user') {
            window.confirm(t('signup.messages.errorCreate'));
          } else {
            this.setState({
              isCreateAccount: true,
              dataUser: [{ 'id': responseJson.result }]
            })
            window.confirm(t('signup.messages.success'));
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    const { i18n } = this.props
    const { t } = this.props;
    if (this.state.isCreateAccount) {
      return (
        <I18nextProvider i18n={i18n}>
          <Menu dataUser={this.state.dataUser} />
        </I18nextProvider>
      );
    }
    if (this.state.isCancel) {
      return (
        <Login />
      );
    }
    else {
      return (
        <Container>
          <div style={{ margin: '2%' }}>
            <h1 align='center'> {t('signup.title')} </h1>
          </div>
          <Row className='justify-content-md-center'>
            <Col xs lg='2'></Col>
            <Col md='auto'>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId='formGridName'>
                    <Form.Label> {t('signup.label.firstName')} </Form.Label>
                    <Form.Control type='name' placeholder={t('signup.placeholders.firstName')} value={this.state.firstName} onChange={this._handleChangeFirstName.bind(this)} />
                  </Form.Group>

                  <Form.Group as={Col} controlId='formGridLastname'>
                    <Form.Label> {t('signup.label.lastName')} </Form.Label>
                    <Form.Control type='name' placeholder={t('signup.placeholders.lastName')} value={this.state.lastName} onChange={this._handleChangeLastName.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridId'>
                    <Form.Label> {t('signup.label.id')} </Form.Label>
                    <Form.Control type='number' placeholder={t('signup.placeholders.id')} value={this.state.id} onChange={this._handleChangeId.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridUsername'>
                    <Form.Label> {t('signup.label.username')} </Form.Label>
                    <Form.Control type='string' placeholder={t('signup.placeholders.userName')} value={this.state.userName} onChange={this._handleChangeUserName.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridEmail'>
                    <Form.Label> {t('signup.label.email')} </Form.Label>
                    <Form.Control type='email' placeholder={t('signup.placeholders.email')} value={this.state.email} onChange={this._handleChangeEmail.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridPassword'>
                    <Form.Label> {t('signup.label.password')} </Form.Label>
                    <Form.Control type='password' placeholder={t('signup.placeholders.password')} value={this.state.password} onChange={this._handleChangePassword.bind(this)} />
                  </Form.Group>

                  <Form.Group as={Col} controlId='formGridPasswordConfirm'>
                    <Form.Label> {t('signup.label.passwordConfirm')} </Form.Label>
                    <Form.Control type='password' placeholder={t('signup.placeholders.password')} value={this.state.passwordConfirm} onChange={this._handleChangePasswordConfirm.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridBirthDay'>
                    <Form.Label> {t('signup.label.birthday')} </Form.Label>
                    <Form.Control type="date" placeholder={t('signup.placeholders.birthday')} value={this.state.birthDay} onChange={this._handleChangeBirthDay.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridNumber'>
                    <Form.Label> {t('signup.label.phone')} </Form.Label>
                    <Form.Control type='number' placeholder={t('signup.placeholders.phone')} value={this.state.phone} onChange={this._handleChangePhone.bind(this)} />
                  </Form.Group>
                </Form.Row>

              </Form>
            </Col>
            <Col xs lg='2'></Col>
          </Row>

          <Row className='justify-content-md-center' style={{ margin: '3%' }}>
            <div>
              <Button
                variant='primary'
                type='submit'
                size='lg'
                onClick={this._submitData}
              >
                {t('signup.buttons.accept')}
              </Button>
            </div>

            <div>
              <Col md='auto'>
                <Button
                  variant='primary'
                  type='submit'
                  size='lg'
                  onClick={() => { this.setState({ isCancel: true }) }}
                >
                  {t('signup.buttons.cancel')}
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

export default withTranslation()(Signup);
