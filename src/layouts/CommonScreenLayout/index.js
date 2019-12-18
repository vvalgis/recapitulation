import css from './style.sss'
import React from 'react'
import ScreenTitle from './ScreenTitle'
import { SyncButton, SettingsButton, BackButton } from 'elements'

const navButtons = {
  sync: SyncButton,
  settings: SettingsButton,
  back: BackButton
}

const renderButton = (AButton, idx) => <AButton key={ idx } />

const renderButtons = (buttonNames) => buttonNames.map((name, idx) => renderButton(navButtons[name], idx))

const CommonScreenLayout = ({ screenTitle, leftNav, rightNav, children }) => {
  return (
    <section className={ css.screen }>
      <nav>
        { renderButtons(leftNav) }
        { renderButtons(rightNav) }
      </nav>
      <ScreenTitle>{ screenTitle }</ScreenTitle>
      { children }
    </section>
  )
}

export default CommonScreenLayout

