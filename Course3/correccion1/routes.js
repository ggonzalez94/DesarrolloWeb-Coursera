Router.configure({
 layoutTemplate: 'layout',

});
Router.route('/', {
  name: 'home'
});
Router.route('/detail', {
  name: 'detail'
});
