import React from 'react';
import ReactDOM from 'react-dom';
import i18n from './i18n';
import { I18nextProvider } from "react-i18next";
import LogInComponent from './components/session/login';

/** TEST DELETE */
import Menu from './components/menu';

class App extends React.Component {
  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <LogInComponent />
      </I18nextProvider>



      /** {TEST} DELETE  */
      /*
      <I18nextProvider i18n={i18n}>
        <Menu dataUser={{
          "id": "EDp9MDl3SveELBIeviYk4zXib0l1",
          "role": "customer"
        }} />
      </I18nextProvider>
      */
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
