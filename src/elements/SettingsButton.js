import React from 'react'
import { Switch, Button, Icon } from 'elements'

const SettingsButton = () => {
  return (
    <Switch to="settings">
      <Button name="sprocket" title="Settings">
        <Icon name="sprocket" />
      </Button>
    </Switch>
  )
}

export default SettingsButton
