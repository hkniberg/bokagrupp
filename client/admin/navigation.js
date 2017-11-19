Template.navigation.events({
  'click .logout-link': function() {
    AccountsTemplates.logout()
    Router.go("/admin")
  },

  'click .collapse-on-click': function() {
    //Make sure the navbar gets collapsed after an item is selected
    //(if it was extended in the first place)
    $("#myNavbar").collapse('hide')
  }
})