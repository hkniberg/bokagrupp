
export function initDb() {
  if (Meteor.users.find().count() === 0) {
    const password = "admin"
    console.log("Adding 'admin@example.com' user with password " + password);


    let _id = Accounts.createUser({
      email: 'admin@example.com',
      password: password
    });
    Roles.addUsersToRoles(_id, 'superUser', Roles.GLOBAL_GROUP);
  }
}
