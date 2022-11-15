import React from 'react'

import './style.css'

import List from './list'

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      search: false,
    }
  }

  handleClickMenu = () => {
    this.setState({ open: !this.state.open, search: false })
  }

  handleClickSearch = () => {
    if (this.state.open) return

    this.setState({ search: !this.state.search })
  }

  handleListItemClick = () => {
    this.setState({ search: false })
  }

  renderTitle = () => {
    const content = store.redux.state('app.settings.project_name')

    return (
      <div title={content} style={{
        width: 250,
        height: 40,
        lineHeight: '40px',
        fontWeight: 'bold',
        fontSize: 28,
        textTransform: 'uppercase',
        position: 'relative',
        left: -10,
        letterSpacing: '5px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {content}
      </div>
    )
  }

  renderUserButton = () => {
    const user = store.redux.state('app.user.attributes') || {};
    const content = `${(user.name || '').slice(0, 1)}${(user.surname || '').slice(0, 1)}`

    const style = {
      fontSize: 18,
      margin: '0 0 30px',
      padding: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
    }

    const trigger = (
      <Components.Button primary style={style}>
        {content}
      </Components.Button>
    );

    return (
      <Components.Dropdown icon={null} pointing="left" style={style} trigger={trigger}>
        <Components.Dropdown.Menu>
          <Components.Dropdown.Item onClick={p.actions.logout}>Logout</Components.Dropdown.Item>
        </Components.Dropdown.Menu>
      </Components.Dropdown>
    )
  }

  renderSystemButton = () => {
    const trigger = (
      <Components.Icon
        link
        name="cog"
        style={{ fontSize: '20px', margin: '0' }}
      />
    );

    return (
      <Components.Dropdown icon={null} pointing="left" trigger={trigger}>
        <Components.Dropdown.Menu>
          <Components.Dropdown.Item onClick={p.actions.systemInfo}>System Info</Components.Dropdown.Item>
        </Components.Dropdown.Menu>
      </Components.Dropdown>
    )
  }

  render() {
    const classNames = ['sidebar']
    if (this.state.open) classNames.push('open')
    if (this.state.search) classNames.push('search')
    const className = classNames.join(' ')

    return (
      <div className={className}>
        <div className="section-left">
          <div className="section-left-top">
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40 }}>
                <img style={{ width: '100%', height: '100%', padding: 2 }} src="data:image/png;base64,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" alt="" />
              </div>
              {
                !this.state.open && (
                  <Components.Button onClick={this.handleClickMenu} icon primary style={{ width: 40, height: 40, fontSize: '16px', padding: 10, margin: 0, position: 'absolute', left: 45, top: 0 }}>
                    <Components.Icon name="bars" />
                  </Components.Button>
                )
              }
            </div>
            <Components.Button onClick={this.handleClickSearch} icon style={{ width: 40, height: 40, fontSize: '16px', padding: 10, margin: 0 }}>
              <Components.Icon name="search" />
            </Components.Button>
          </div>
          <div className="section-left-bottom">
            {this.renderUserButton()}
            {/* <Components.Icon
              link
              name="bell outline"
              style={{ fontSize: '20px', margin: '0 0 30px' }}
            /> */}
            {this.renderSystemButton()}
          </div>
        </div>
        <div className="section-right">
          <div className="section-right-top">
            <div style={{ position: 'relative', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              {this.renderTitle()}
              {
                this.state.open && (
                  <Components.Icon
                    link
                    onClick={this.handleClickMenu}
                    style={{ width: 40, height: 40, fontSize: '16px', padding: 10, margin: 0 }} name="bars"
                  />
                )
              }
            </div>
          </div>
          <List
            open={this.state.open}
          />
        </div>
        <div className="list-wrapper">
          <List
            open={this.state.search}
            onItemClick={this.handleListItemClick}
          />
        </div>
      </div>
    )
  }
}