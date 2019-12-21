import css from './style.sss'
import React from 'react'
import { isEmpty } from 'lodash'
import ScreenTitle from './ScreenTitle'
import { SyncButton, SettingsButton, BackButton } from 'elements'

const navButtons = {
  sync: SyncButton,
  settings: SettingsButton,
  back: BackButton
}

const renderButton = (AButton, idx) => <AButton key={ idx } />

const renderButtons = (buttonNames) => buttonNames.map((name, idx) => renderButton(navButtons[name], idx))

const renderTitle = (screenTitle) => isEmpty(screenTitle) ? null : <ScreenTitle>{ screenTitle }</ScreenTitle>

const CommonScreenLayout = ({ screenTitle, leftNav, rightNav, children }) => {
  return (
    <section className={ css.screen }>
      <nav>
        <span>{ renderButtons(leftNav) }</span>
        <span>{ renderButtons(rightNav) }</span>
      </nav>
      { renderTitle(screenTitle) }
      { children }
    </section>
  )
}

export default CommonScreenLayout

