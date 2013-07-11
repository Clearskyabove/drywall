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
      email: ''
    },
    events = {
      'submit form': 'preventSubmit',
      'click .btn-signup': 'signup'
    };

//if 'subdomain' rendered by server this is a required part of the model. (variable set in Jade)
if(subdomainUsed){
  defaults.subdomain = '';
  events['keypress [name="subdomain"]'] ='signupOnEnter';
}else{
  events['keypress [name="email"]'] ='signupOnEnter';
}

app.Signup = Backbone.Model.extend({
  url: '/signup/social/',
  defaults: defaults
});

/**
* VIEWS
**/
app.SignupView = Backbone.View.extend({
  el: elSel,
  template: _.template( $('#tmpl-signup').html() ),
  events: events,
  initialize: function() {
    this.model = new app.Signup();
    this.model.set('email', $('#data-email').text());
    this.model.bind('change', this.render, this);
    this.render();
  },
  render: function() {
    this.$el.html(this.template( this.model.attributes ));
    this.$el.find('[name="email"]').focus();
  },
  preventSubmit: function(event) {
    event.preventDefault();
  },
  signupOnEnter: function(event) {
    if (event.keyCode !== 13) return;
    event.preventDefault();
    this.signup();
  },
  signup: function() {
    this.$el.find('.btn-signup').attr('disabled', true);

    var saveModel = {
      email: this.$el.find('[name="email"]').val()
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


