import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useDispatchAction, formatScopeDate, DataSchema } from 'main'
import { useRouter, Link } from 'routes'
import { actions } from 'actions'
import { getFromCompartment } from 'reducers'

const Screen = ({ className, children }) => {
  return <section className={ `screen ${className}` }>{ children }</section>;
};

const Icon = ({ name, alt = '' }) => {
  return <i className={ `icon icon-${name}` } alt={ alt }></i>
};

const Button = ({ name, onClick: onClickHandler, title = '', children }) => {
  return <button title={ title } className={ `button button-${name}` } onClick={ onClickHandler }>{ children }</button>
};

const SyncButton = () => {
  const dispatch = useDispatch();
  const db = useSelector(getFromCompartment('db'));
  const submitDbSync = () => {
    dispatch(actions.db.syncFile(db));
  };
  return <Button name="sync" title="Sync with the cloud" onClick={ submitDbSync }><Icon name="sync" /></Button>
};

const SettingsButton = () => {
  return (
    <Link to="settings">
      <Button name="sprocket" title="Settings">
        <Icon name="sprocket" />
      </Button>
    </Link>
  );
};

const BackButton = () => {
  return (
    <Link to="">
      <Button name="back" title="Back">
        <Icon name="left" />
      </Button>
    </Link>
  );
};

const RecapitulateButton = () => {
  const dispatch = useDispatch();
  const submitRecapitulation = () => {
    dispatch(actions.scope.recapitulate());
  };
  return (
    <Button name="recap" title="Recapitulate" onClick={ submitRecapitulation }><Icon name="recap" /></Button>
  );
};

const ScopeNavigateButton = ({ scope, direction }) => {
  const dispatch = useDispatch();
  const nextScope = useSelector(getFromCompartment(`${direction}Scope`), [scope]);
  const buttonName = direction === 'backward' ? 'left' : 'right';

  const switchScope = () => {
    dispatch(actions.scope.switchTo(nextScope));
  };
  return _.isEmpty(nextScope) ? '' : <Button name={ buttonName } onClick={ switchScope }><Icon name={ buttonName } /></Button>;
};

const EditButton = ({ handleClick }) => {
  return (
    <Button name="edit" onClick={ handleClick }><Icon name="edit" /></Button>
  );
};

const ChangeStatusButton = ({task, name, newStatus}) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(actions.task.changeStatus(task, newStatus));
  };
  return (
    <Button name={ name } onClick={ handleClick }><Icon name={ name } /></Button>
  );
};

const Task = ({ task, statusNames }) => {
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const submitNewNote = (note) => {
    setEditing(false);
    dispatch(actions.task.updateNote({ task, note }));
  };

  const buttons = useMemo(() => ({
    done: { button: ChangeStatusButton, name: 'Done', newStatus: 'done' },
    remove: { button: ChangeStatusButton, name: 'Remove', newStatus: 'removed' },
    restore: { button: ChangeStatusButton, name: 'Restore', newStatus: 'active' },
    edit: { button: EditButton, handleClick: () => setEditing(editing ? false : true) }
  }), [editing]);
  const statuses = useMemo(() => [
    { leftAside: [buttons.done], rightAside: [buttons.edit, buttons.remove] },
    { leftAside: [buttons.restore], rightAside: [] },
    { leftAside: [], rightAside: [] },
    { leftAside: [buttons.restore], rightAside: [] }
  ], []);
  const taskStatus = statuses[task.status];
  const showButtons = (buttons) => buttons.map(({ button: Abutton, ...args }, key) => <Abutton { ...{ key, task, ...args } } />);

  const renderTask = () => {
    return (
      <li>
        <span className="left-buttons">{ showButtons(taskStatus.leftAside) }</span>
        <span className={ `task ${ statusNames[task.status] }` }>{ task.note }</span>
        <span className="right-buttons">{ showButtons(taskStatus.rightAside) }</span>
      </li>
    );
  };

  const renderForm = () => {
    return <li><TaskForm { ...{ task, onSubmit: submitNewNote } } /></li>
  };

  return editing ? renderForm() : renderTask();
};

const ArchivedTask = ({ task, statusNames }) => {
  return (
    <li>
      <span className="left-buttons"></span>
      <span className={ `task ${ statusNames[task.status] }` }>{ task.note }</span>
      <span className="right-buttons"></span>
    </li>
  );
};

const Tasks = ({ tasks, isArchivedScope = false }) => {
  const statusNames = DataSchema.Task.enums.statuses;
  const ATask = isArchivedScope ? ArchivedTask : Task;
  return (
    <article>
      <ul className="tasks">
        { tasks.map((task) => <ATask { ...{ task, statusNames, key: task.uuid } } />) }
      </ul>
    </article>
  );
};

const TaskForm = ({ task = { note: '' }, onSubmit }) => {
  const [note, setNote] = useState(task.note);
  const noteHandler = (event) => {
    setNote(event.target.value)
  };
  const handleEnter = ({ key }) => {
    if (key === 'Enter') {
      handleSubmit();
    };
  };
  const handleSubmit = (event) => {
    setNote('');
    onSubmit(note);
  };
  return (
    <React.Fragment>
      <input value={ note } onChange={ noteHandler } onKeyDown={ handleEnter } />
      <Button name="add" onClick={ handleSubmit }><Icon name="add" /></Button>
    </React.Fragment>
  );
};

const NewTaskForm = ({ scope, onSubmit }) => {
  const dispatch = useDispatch();
  const [onEdit, setOnEdit] = useState(false);
  const showForm = (event) => setOnEdit(true);
  const submitNewTask = (note) => {
    setOnEdit(false);
    dispatch(actions.task.addToScope({ scope, note }));
  };
  return onEdit ? <TaskForm onSubmit={ submitNewTask } /> : <Button name="add" title="Add Task" onClick={ showForm }><Icon name="add" /></Button>;
};

const ScopeTitle = ({ scope, isActive = false }) => {
  const formattedDate = useMemo(() => formatScopeDate(scope.created_at), [scope.created_at]);

  return (
    <header>
      <ScopeNavigateButton scope={ scope } direction="backward" />
      <h1>{ formattedDate }</h1>
      <ScopeNavigateButton scope={ scope } direction="forward" />
      { isActive ? <RecapitulateButton /> : '' }
    </header>
  );
};

const ActiveScope = ({ scope, tasks }) => {
  return (
    <React.Fragment>
      <nav>
        <SyncButton />
        <SettingsButton />
      </nav>
      <ScopeTitle scope={ scope } isActive />
      <Tasks tasks={ tasks } />
      <footer><NewTaskForm scope={ scope } /></footer>
    </React.Fragment>
  );
};

const ArchiveScope = ({ scope, tasks }) => {
  return (
    <React.Fragment>
      <nav><SettingsButton /></nav>
      <ScopeTitle scope={ scope } />
      <Tasks tasks={ tasks } isArchivedScope />
      <footer></footer>
    </React.Fragment>
  );
};

const Scope = ({ scope, ScopeComponent }) => {
  useDispatchAction(actions.task.getByScope, { args: [scope], deps: [scope] });
  const tasks = useSelector(getFromCompartment('currentTasks'));
  return <ScopeComponent { ...{ scope, tasks } } />;
};

const Settings = () => {
  return (
    <React.Fragment>
      <nav>
        <BackButton />
      </nav>
    </React.Fragment>
  );
}

export {
  Screen,
  Icon,
  Button,
  SyncButton,
  SettingsButton,
  BackButton,
  RecapitulateButton,
  ScopeNavigateButton,
  EditButton,
  ChangeStatusButton,
  Task,
  ArchivedTask,
  Tasks,
  TaskForm,
  NewTaskForm,
  ScopeTitle,
  ActiveScope,
  ArchiveScope,
  Scope,
  Settings
}
