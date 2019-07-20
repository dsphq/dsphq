import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AccountPage from './account/AccountPage';
import PrivacyPolicyPage from './disclosures/PrivacyPolicyPage';
import TermsOfUsePage from './disclosures/TermsOfUsePage';
import DspListPage from './dsp/DspListPage';
import HomePage from './home/HomePage';
import PackageDetailsPage from './packages/PackageDetailsPage';
import PackagePage from './packages/PackagePage';
import SettingsPage from './settings/SettingsPage';
import PropTypes from 'prop-types';

function Routes({ onThemeToggle }) {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/packages/:provider/:service/:packageId" component={PackageDetailsPage} />
      <Route path="/packages" component={PackagePage} />
      <Route path="/providers" component={DspListPage} />
      <Route path="/accounts/:name" component={AccountPage} />
      <Route path="/terms" component={TermsOfUsePage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/settings" render={() => <SettingsPage onThemeToggle={onThemeToggle} />} />
    </Switch>
  );
};

Routes.propTypes = {
  onThemeToggle: PropTypes.func.isRequired
};

export default Routes;
