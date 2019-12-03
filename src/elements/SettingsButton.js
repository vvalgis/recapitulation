import React from 'react'
import { Link } from 'routes'
import { Button, Icon } from 'elements'

const SettingsButton = () => {
  return (
    <Link to="settings">
      <Button name="sprocket" title="Settings">
        <Icon name="sprocket" />
      </Button>
    </Link>
  )
}

export default SettingsButton
