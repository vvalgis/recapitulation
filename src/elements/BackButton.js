import React from 'react'
import { Switch, Button, Icon } from 'elements'

const BackButton = () => {
  return (
    <Switch to="">
      <Button name="back" title="Back">
        <Icon name="left" />
      </Button>
    </Switch>
  );
};

export default BackButton
