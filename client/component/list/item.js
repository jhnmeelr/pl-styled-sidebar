import React from 'react';

export default class SidebarListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active: false, favoriteIconHovered: false };
  }

  handleToggleFavorite = () => {
    this.props.toggleFavorite(this.props.item.id);
  }

  handleToggleCollapse = () => {
    const { item, toggleCollapse } = this.props;

    if (!this.state.favoriteIconHovered) toggleCollapse(item.id);
  }

  handleFavoriteIconEnter = () => this.setState({ favoriteIconHovered: true })
  handleFavoriteIconLeave = () => this.setState({ favoriteIconHovered: false })

  renderFavoriteIcon = () => {
    const { favorited } = this.props;
    const { active, favoriteIconHovered } = this.state;

    if (!active && !favorited) return null;

    const title = favorited
      ? i18n.t('unstar_this_module', { defaultValue: 'Unstar this module' })
      : i18n.t('star_this_module', { defaultValue: 'Star this module' });

    const name = favorited || favoriteIconHovered ? 'star' : 'star outline';
    const style = { position: 'absolute', top: 0, right: -25, marginLeft: 6, cursor: 'pointer' };

    return (
      <Components.Icon
        title={title}
        name={name}
        style={style}
        className={`favorite-icon favorite`}
        onClick={this.handleToggleFavorite}
        onMouseEnter={this.handleFavoriteIconEnter}
        onMouseLeave={this.handleFavoriteIconLeave}
      />
    );
  }

  renderHeader = () => {
    const { item, collapsed } = this.props;

    return (
      <Components.Menu.Header>
        <span className="content" style={{ cursor: 'pointer' }} onClick={this.handleToggleCollapse}>
          <Components.Icon
            name={`chevron ${collapsed ? 'down' : 'up'}`}
            style={{ position: 'absolute', right: 10, cursor: 'pointer' }}
          />
          {item.plural || item.name}
        </span>
        {this.renderFavoriteIcon()}
      </Components.Menu.Header>
    );
  }

  renderMenu = () => {
    const { item, onItemClick } = this.props;

    return (
      <Components.Menu.Menu>
        {item.views.map((view) => {
          return (
            <Components.Menu.Item
              key={view.id}
              as={ReactRouter.Link}
              to={`/${item.alias}/view/${view.type}/${view.alias}#${Helpers.makeUniqueID()}`}
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={onItemClick}
            >
              <Components.Icon
                name="hashtag"
                style={{ position: 'absolute', left: 15 }}
              />
              {view.name}
            </Components.Menu.Item>
          )
        })}
      </Components.Menu.Menu>
    );
  }

  render() {
    const { collapsed } = this.props;

    return (
      <Components.Menu.Item>
        {this.renderHeader()}
        {!collapsed && this.renderMenu()}
      </Components.Menu.Item>
    );
  }
}
