var Test = require('./../models/Test.js'),
    TestProgress = require('./../models/TestProgress'),
    TestView = require('./../views/TestView'),
    TestListView = require('../views/TestListView'),
    TestFormView = require('./../views/TestFormView'),
    TestReadOnlyView = require('./../views/TestReadOnlyView'),
    Presenter = require('./../utils/Presenter'),
    Authnz = require('./../utils/Authnz'),
    BaseRouter = require('./BaseRouter'),
    Formatter = require('./../utils/Format');

module.exports = BaseRouter.extend({
  routes: {
    'test/list': 'list',
    'test/new': 'neu',
    'test/:id/take': 'take',
    'test/:id/edit': 'edit',
    'test/:id/view': 'view'
  },

  filters: {
    test: {
      before: Authnz.isAuthorized(),
    },

    'test/new': {
      before: Authnz.isAuthorized(['admin'])
    },

    'test/list': {
      before: Authnz.isAuthorized(['admin'])
    }
  },

  list: function() {
    var tests = new Backbone.Collection;
    tests.url = "/tests";

    tests.fetch({
      success: function(tests) {
        self.listView = new TestListView({collection: tests});

        Presenter.presentMainContent(self.listView);
      }
    });
  },

  neu: function() {
    var self = this;

    self.newView = self.newView || new TestFormView();

    Presenter.presentMainContent(self.newView);
  },

  edit: function(id) {
    var self = this,
        test = new Test({id: id});

    test.fetch({
      success: function(model) {
        self.editView = new TestFormView({model: model});

        Presenter.presentMainContent(self.editView);
      }
    });
  },

  load: function(id, callback) {
    var self = this,
        test = new TestProgress({id: id});

    test.fetch({success: callback});
  },

  take: function(id) {
    var self = this;

    self.load(id, function(model) {
      var progress = model.get('progress');

      if (progress.na === progress.nq) return window.location.href = Formatter.path('#', 'test', id, 'view');

      self.showView = new TestView({model: model});

      Presenter.presentMainContent(self.showView);
    });
  },

  view: function(id) {
    var self = this;

    self.load(id, function(model) {
      var progress = model.get('progress');

      if (progress.na < progress.nq) return window.location.href = Formatter.path('#', 'test', id, 'take');

      self.readOnlyView = new TestReadOnlyView({model: model});

      Presenter.presentMainContent(self.readOnlyView);
    });
  }
});