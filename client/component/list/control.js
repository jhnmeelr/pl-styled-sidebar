import React from 'react'

export default class SidebarListControl extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true,
      search: false,

      searchTerm: '',
      items: this.getVisibleItems(),
      collapsedItems: [],
      favoriteItems: [],
      showFavorites: false,
      showCore: false,
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

    const modelsToShow = lodash.filter(models, model => sandbox.executeScript(model.visibility_rule, { modelId: model.id }));
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

  handleClickMenu = () => {
    this.setState({ open: !this.state.open })
  }

  handleClickSearch = () => {
    this.setState({ open: true, search: true })
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
}