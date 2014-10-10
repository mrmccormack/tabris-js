/**
 * Copyright (c) 2014 EclipseSource.
 * All rights reserved.
 */

tabris.UIProxy = function() {
  this._pages = [];
};

tabris.UIProxy.prototype = {

  _create: function() {
    var self = this;
    tabris.create("rwt.widgets.Display");
    tabris._shell = tabris.create("rwt.widgets.Shell", {
      style: ["NO_TRIM"],
      mode: "maximized",
      active: true,
      visibility: true
    });
    tabris._shell.on("Close", function() {
      tabris._shell.dispose();
    });
    this._ui = tabris.create("tabris.UI", {
      shell: tabris._shell
    });
    this._ui.on("ShowPage", function(properties) {
      var page = tabris._proxies[properties.pageId];
      self.setActivePage(page);
    });
    this._ui.on("ShowPreviousPage", function() {
      self.getActivePage().close();
    });
    return this;
  },

  _install: function(target) {
    target.createAction = util.bind(this.createAction, this);
    target.createPage = util.bind(this.createPage, this);
    target._uiProxy = this;
  },

  setActivePage: function(page) {
    this._pages.push(page);
    this._ui.set("activePage", page);
  },

  getActivePage: function() {
    return this._pages[ this._pages.length - 1 ];
  },

  setLastActivePage: function() {
    this._pages.pop();
    var page = this.getActivePage();
    if (page) {
      this._ui.set("activePage", page);
    }
  },

  createAction: function(properties, handler) {
    var action = tabris.create("Action", properties);
    if (typeof handler === "function") {
      action.on("Selection", handler);
    }
    return action;
  },

  createPage: function(properties) {
    return tabris.create("Page", properties);
  }
};

tabris.load(function() {
  new tabris.UIProxy()._create()._install(tabris);
});