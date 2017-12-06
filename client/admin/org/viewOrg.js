
Template.viewOrg.helpers({
})

Template.viewOrg.events({
  "click .removeOrgButton"() {
    const org = Template.currentData()
    sweetAlert({
      title: "Är du säker?",
      text: "Vill du verkligen ta bort organisationen?",
      type: "warning",
      confirmButtonColor: "red",
      confirmButtonText: "Japp! Bort med organisationen!",
      showCancelButton: true
    }, function(){
      Meteor.call("removeOrg", org._id)
      Router.go("/admin/orgs")
    });
  },

  "click .editOrgButton"() {
    const org = Template.currentData()
    Router.go('/admin/editOrg/' + org.shortName)
  }

})

