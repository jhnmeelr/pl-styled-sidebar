import React from 'react';

import './style.css'

import Item from './item';

export default class SidebarList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchTerm: '',
      items: this.getVisibleItems(),
      collapsedItems: [],
      favoriteItems: [],
      showFavorites: false,
      showCore: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        searchTerm: '',
        items: this.getVisibleItems(),
        collapsedItems: [],
        favoriteItems: [],
        showFavorites: false,
        showCore: false,
      })
    }
  }

  filterMatchedItems = (term, items) => {
    return term === '' ? items : lodash.filter(items, ({ name, plural }) => {
      return lodash.some(lodash.compact([name, plural]), (t) => t.match(new RegExp(term, 'gi')));
    });
  }

  getVisibleItems = (term = '') => {
    const models = store.redux.state('metadata.app.model')
    const views = store.redux.state('metadata.app.view')

    const user = store.redux.state('app.user');
    const sandbox = new Sandbox({ user });

    const modelsToShow = lodash.filter(models, model => sandbox.executeScript(model.visibility_rule, { modelId: model.id }, `model/${model.id}/visibility_rule`));
    const modelsMap = lodash.keyBy(modelsToShow, 'id');
    const viewsToShow = lodash.filter(views, view => !!modelsMap[view.model])
    const viewsGroupedByModel = lodash.groupBy(viewsToShow, 'model');
    const visibleViews = this.filterMatchedItems(term, viewsToShow);
    const visibleModels = lodash.unionBy(
      lodash.uniqBy(lodash.compact(visibleViews.map(({ model }) => modelsMap[model])), 'id'),
      this.filterMatchedItems(term, modelsToShow),
      'id',
    );

    const itemsToShow = [];

    visibleModels.forEach((model) => {
      const modelViews = lodash.map(viewsGroupedByModel[model.id] || [], (v) => ({ ...v, order: v.order || 0 }));
      const modelViewsOrdered = lodash.orderBy(modelViews, ['order', 'name'], ['desc', 'asc']);
      if (modelViews.length) itemsToShow.push({ ...model, views: modelViewsOrdered });
    });

    return lodash.orderBy(lodash.map(itemsToShow, (m) => ({ ...m, order: m.order || 0 })), ['order'], ['desc']);
  }

  getMatchedItems = (items, id) =>
    lodash.includes(items, id) ? lodash.without([...items], id) : lodash.uniq([...items].concat(id));

  handleToggleFavorite = (id) => {
    const { favoriteItems, updateSidebar } = this.props;
    updateSidebar({ favoriteItems: this.getMatchedItems(favoriteItems, id) });
  }

  handleToggleCollapse = (id) => {
    const { collapsedItems, updateSidebar } = this.props;
    updateSidebar({ collapsedItems: this.getMatchedItems(collapsedItems, id) });
  }

  handleUpdate = (settings) => {
    this.setState({ ...this.state, ...settings });
  }

  handleToggleCollapseAllItems = () => {
    this.setState({ collapsedItems: this.state.collapsedItems.length === this.state.items.length ? [] : lodash.map(this.state.items, 'id') });
  }

  handleToggleShowFavorites = () => {
    this.setState({ showFavorites: !this.state.showFavorites })
  }

  handleToggleShowCore = () => {
    this.setState({ showCore: !this.state.showCore })
  }

  renderControlPanel() {
    const { items = [], collapsedItems = [], showFavorites, showCore } = this.state;
    const collapseAll = collapsedItems.length === items.length;

    const collapseAllIcon = collapseAll ? 'chevron down' : 'chevron up';
    const showFavoritesIcon = showFavorites ? 'bookmark' : 'bookmark outline';
    const showCoreIcon = 'cogs';

    const collapseAllClassName = collapseAll ? ' active' : ''
    const showFavoritesClassName = showFavorites ? ' active' : ''
    const showCoreClassName = showCore ? ' active' : ''

    const collapseAllText = collapseAll
      ? i18n.t('expand_all', { defaultValue: 'Expand all' })
      : i18n.t('collapse_all', { defaultValue: 'Collapse all' });

    const showFavoritesText = showFavorites
      ? i18n.t('show_all', { defaultValue: 'Show all' })
      : i18n.t('show_favorites_only', { defaultValue: 'Show favorites only' });

    const showCoreText = showCore
      ? i18n.t('show_all', { defaultValue: 'Show all' })
      : i18n.t('show_core_only', { defaultValue: 'Show core only' });

    return (
      <div className="control-panel">
        <div>
          <Components.Icon
            link
            size="large"
            title={collapseAllText}
            className={collapseAllClassName}
            name={collapseAllIcon}
            onClick={this.handleToggleCollapseAllItems}
          />
          <Components.Icon
            link
            size="large"
            title={showFavoritesText}
            className={showFavoritesClassName}
            name={showFavoritesIcon}
            onClick={this.handleToggleShowFavorites}
          />
          <Components.Icon
            link
            size="large"
            title={showCoreText}
            className={showCoreClassName}
            name={showCoreIcon}
            onClick={this.handleToggleShowCore}
          />
        </div>
      </div>
    )
  }

  renderItems = () => {
    const { items, favoriteItems, collapsedItems, showFavorites, showCore } = this.state;

    let itemsToShow = items;
    if (showFavorites) itemsToShow = itemsToShow.filter(({ id }) => favoriteItems.includes(id));
    if (showCore) itemsToShow = itemsToShow.filter(({ type }) => type === 'core');

    return itemsToShow.map((item) =>
      <Item
        key={item.id}
        item={item}
        favorited={favoriteItems.includes(item.id)}
        collapsed={collapsedItems.includes(item.id)}
        toggleFavorite={this.handleToggleFavorite}
        toggleCollapse={this.handleToggleCollapse}
        onClose={this.props.onClose}
        onItemClick={this.props.onItemClick}
      />
    );
  }

  renderList() {
    const items = this.renderItems();
    if (!items.length) return null;

    
    return (
      <div className="items-list">
        {items}
      </div>
    );
  }

  render() {
    if (!this.props.open) return null

    return (
      <div className="sidebar-list" style={{ width: 300, height: 'calc(100% - 60px)', backgroundColor: '#fff', borderRadius: '10px' }}>
        <Components.Input
          type="text"
          style={{ width: '100%' }}
          autoFocus
          placeholder="Search"
          onChange={(e, data) => {
            this.setState({
              searchTerm: data.value,
              collapsedItems: [],
              items: this.getVisibleItems(data.value),
            })
          }}
        />
        {this.renderControlPanel()}
        {this.renderList()}
      </div>
    )
  }
}
