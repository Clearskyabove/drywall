/**
 * SETUP
 **/
var app = app || {};

/**
 * MODELS
 **/
var elSel = '#signup',
  defaults = {
    errors: [],
    errfor: {},
    username: '',
    email: '',
    password: ''
  };

//if 'subdomain' rendered by server this is a required part of the model. (variable set in Jade)
if(subdomainUsed){
  defaults.subdomain = '';
}

app.Signup = Backbone.Model.extend({
  url: '/signup/',
  defaults: defaults
});


/**
 * VIEWS
 **/
app.SignupView = Backbone.View.extend({
  el: elSel,
  template: _.template( $('#tmpl-signup').html() ),
  events: {
    'submit form': 'preventSubmit',
    'keypress [name="password"]': 'signupOnEnter',
    'click .btn-signup': 'signup'
  },
  initialize: function() {
    this.model = new app.Signup();
    this.model.bind('change', this.render, this);
    this.render();
  },
  render: function() {
    this.$el.html(this.template( this.model.attributes ));
    this.$el.find('[name="username"]').focus();
  },
  preventSubmit: function(event) {
    event.preventDefault();
  },
  signupOnEnter: function(event) {
    if (event.keyCode !== 13) return;
    if ($(event.target).attr('name') !== 'password') return;
    event.preventDefault();
    this.signup();
  },
  signup: function() {
    this.$el.find('.btn-signup').attr('disabled', true);

    var saveModel = {
      username: this.$el.find('[name="username"]').val(),
      email: this.$el.find('[name="email"]').val(),
      password: this.$el.find('[name="password"]').val()
    };
    if(subdomainUsed){
      saveModel.subdomain = this.$el.find('[name="subdomain"]').val();
    }
    this.model.save(saveModel,{
      success: function(model, response, options) {
        if (response.success) {
          location.href = '/account/';
        }
        else {
          model.set(response);
        }
      }
    });
  }
});



/**
 * BOOTUP
 **/
$(document).ready(function() {
  app.signupView = new app.SignupView();
});


