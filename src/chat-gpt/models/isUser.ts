export class IsUser {
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  update(isUser: IsUser) {
    return new IsUser(isUser.value);
  }
}
