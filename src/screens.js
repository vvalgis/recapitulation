import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatchAction, isScopesEqual } from 'main'
import { useRouter } from 'routes'
import { actions } from 'actions'
import { getFromCompartment } from 'reducers'
import { Screen, Scope, Icon, ActiveScope, ArchiveScope, Settings } from 'components'

const LoadingScreen = () => <Screen className="loading"><Icon name="loading" /></Screen>;

const InitScopeScreen = () => {
  useDispatchAction(actions.scope.getLast);
  return <LoadingScreen />
};

const Recapitulation = () => {
  useDispatchAction(actions.db.loadFile, { deps: [] });
  const { currentComponent: CurrentScreen } = useRouter();
  const db = useSelector(getFromCompartment('db'));
  return _.isEmpty(db) ? <LoadingScreen /> : <CurrentScreen />;
};

const ScopeScreen = () => {
  const scope = useSelector(getFromCompartment('currentScope'), isScopesEqual);
  const isActive = useSelector(getFromCompartment('isActiveScope'));
  if (_.isEmpty(scope)) {
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
      <Settings />
    </Screen>
  );
};

export {
  Recapitulation,
  ScopeScreen,
  SettingsScreen
}
