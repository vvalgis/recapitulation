import React from 'react'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useDispatchAction, isScopesEqual } from 'main'
import { useRouter } from 'routes'
import { actions } from 'actions'
import { getFromCompartment } from 'reducers'
import { Screen, Scope, Icon, ActiveScope, ArchiveScope, Settings } from 'components'
import { list as getSettingsList, isAppInitialized } from 'config'

const LoadingScreen = () => <Screen className="loading"><Icon name="loading" /></Screen>;

const InitScopeScreen = () => {
  useDispatchAction(actions.scope.getLast);
  return <LoadingScreen />
};

const InitDbScreen = () => {
  useDispatchAction(actions.db.loadFile, { deps: [] });
  return <LoadingScreen />
}

const Recapitulation = () => {
  const noDB = isEmpty(useSelector(getFromCompartment('db')))
  const { currentComponent } = useRouter();
  const CurrentScreen = isAppInitialized() ? currentComponent : SettingsScreen

  return isAppInitialized() && noDB ? <InitDbScreen /> : <CurrentScreen />;
};

const ScopeScreen = () => {
  const scope = useSelector(getFromCompartment('currentScope'), isScopesEqual);
  const isActive = useSelector(getFromCompartment('isActiveScope'));
  if (isEmpty(scope)) {
    return <InitScopeScreen />
  } else {
    const ScopeComponent = isActive ? ActiveScope : ArchiveScope;
    const scopeClassName = isActive ? 'active' : 'archive';
    return <Screen className={ `scope ${ scopeClassName }` }><Scope { ...{ scope, ScopeComponent } } /></Screen>
  }
};

const SettingsScreen = () => {
  return (
    <Screen className="settings">
      <Settings settings={ getSettingsList() } initialized={ isAppInitialized() } />
    </Screen>
  );
};

export {
  Recapitulation,
  ScopeScreen,
  SettingsScreen
}
