import React from 'react';
import { ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

class LanguageSelector extends React.Component {
  _onClickChangeLanguage = (eventKey) => {
    const { i18n } = this.props
    i18n.changeLanguage(eventKey)
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <ButtonToolbar>
          <DropdownButton
            drop={this.props.type}
            variant='secondary'
            title={t('language')}
            size='sm'
            onSelect={this._onClickChangeLanguage}>
            <Dropdown.Item eventKey="en">English</Dropdown.Item>
            <Dropdown.Item eventKey="es">Español</Dropdown.Item>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    )
  }
}

export default withTranslation()(LanguageSelector);




