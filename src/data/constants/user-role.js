export default class UserRole {
  static SuperAdmin = 1;
  static Admin = 2;
  static Moderator = 3;
  static Reporter = 4;

  static all = () => [this.SuperAdmin, this.Admin, this.Moderator];

  static selectOptions = () => [
    { name: "Select Role", value: 0 },
    { name: "Reporter", value: this.Reporter },
    { name: "Moderator", value: this.Moderator },
    { name: "Admin", value: this.Admin },
  ];
}
