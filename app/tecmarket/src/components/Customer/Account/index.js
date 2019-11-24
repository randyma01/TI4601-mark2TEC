import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from '../../session/login';

class Account extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      birthDay: '',
      email: '',
      name: '',
      id: '',
      isCreateAccount: false,
      phone: '',
      dataUser: props.dataUser,
      userName: ''
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await fetch(`http://localhost:8080/v1/customer/myProfile/${this.state.dataUser.id}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson !== '' && this._isMounted) {
          this.setState({
            birthDay: responseJson.birthday,
            email: responseJson.email,
            id: responseJson.identification,
            name: responseJson.name,
            phone: responseJson.phone,
            userName: responseJson.username
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

  _handleChangeEmail(event) {
    this.setState({ email: event.target.value })
  }

  _handleChangeName(event) {
    this.setState({ name: event.target.value })
  }

  _handleChangePhone(event) {
    this.setState({ phone: event.target.value })
  }

  _handleChangeUserName(event) {
    this.setState({ userName: event.target.value })
  }

  _onDeleteAccount = async () => {
    const { t } = this.props;
    let verify = window.confirm(t('signup.messages.confirmDeleteProfile'))
    if (verify) {
      await fetch(`http://localhost:8080/v1/customer/deleteProfile/${this.state.dataUser.id}`,
        {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.result === 'deleted') {
            this.setState({ isDelete: true })
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  _submitData = async () => {
    const { t } = this.props;
    if (this.state.name === '') {
      window.confirm(t('signup.messages.errorName'))
    }
    else if (this.state.userName === '') {
      window.confirm(t('signup.messages.errorUserName'))
    }
    else if (this.state.email === '') {
      window.confirm(t('signup.messages.errorEmail'))
    }
    else if (this.state.phone === '') {
      window.confirm(t('signup.messages.errorPhone'))
    }
    else {
      let data = {
        id: this.state.dataUser.id,
        birthday: this.state.birthDay,
        email: this.state.email,
        identification: this.state.id,
        name: this.state.name,
        password: this.state.password,
        phone: this.state.phone,
        username: this.state.userName
      }
      await fetch('http://localhost:8080/v1/customer/editProfile',
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
            window.confirm(t('signup.messages.editProfileSuccess'))
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    const { t } = this.props;
    if (this.state.isDelete) {
      return (
        <Login />
      );
    } else {
      return (
        <Container>
          <div style={{ margin: '2%' }}>
            <h5 align='center'> {t('menu.labels.customer.account')} </h5>
          </div>
          <Row className='justify-content-md-center'>
            <Col xs lg='2'></Col>
            <Col md='auto'>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId='formGridName'>
                    <Form.Label> {t('signup.placeholders.firstName')} </Form.Label>
                    <Form.Control type='name' placeholder={t('signup.placeholders.firstName')} value={this.state.name} onChange={this._handleChangeName.bind(this)} />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId='formGridId'>
                    <Form.Label> {t('signup.label.id')} </Form.Label>
                    <Form.Control type='number' value={this.state.id} disabled />
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
                  <Form.Group as={Col} controlId='formGridBirthDay'>
                    <Form.Label> {t('signup.label.birthday')} </Form.Label>
                    <Form.Control type="date" value={this.state.birthDay} disabled />
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
                  variant='danger'
                  type='submit'
                  size='lg'
                  onClick={this._onDeleteAccount}
                >
                  {t('signup.buttons.delete')}
                </Button>
              </Col>
            </div>
          </Row>
        </Container>
      );
    }
  }
}

export default withTranslation()(Account);
