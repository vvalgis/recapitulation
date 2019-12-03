import React from 'react'
import { Link } from 'routes'
import { Button, Icon } from 'elements'

const BackButton = () => {
  return (
    <Link to="">
      <Button name="back" title="Back">
        <Icon name="left" />
      </Button>
    </Link>
  );
};

export default BackButton
