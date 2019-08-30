const routes = [
  { path: '', component: ScopeScreen },
  { path: 'settings', component: SettingsScreen }
];

const Routing = React.createContext([{}, () => {}]);

const Router = ({ children }) => {
  const [ hash, setHash ] = useState(window.location.hash);
  const routeState = [
    hash,
    (newHash) => {
      window.location.hash = newHash;
      setHash(newHash);
    }
  ];
  return <Routing.Provider value={ routeState }>{ children }</Routing.Provider>
};

const useRouter = () => {
  const [ hash, setHash ] = React.useContext(Routing);
  const route = useMemo(() => routes.find(({ path }) => path === hash), [hash]);
  return {
    currentComponent: route.component,
    navigate: setHash
  };
};

const Link = ({ to, children }) => {
  const { navigate } = useRouter();
  return <a className="route-link" onClick={ () => navigate(to) }>{ children }</a>
};


