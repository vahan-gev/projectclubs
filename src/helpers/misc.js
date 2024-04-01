const validEmailDomains = ["clubs.net", "lion.lmu.edu"]
const notValidUsernames = ["admin", "administrator", "moderator", "mod", "root", "user", "users", "username", "usernames", "login", "signup", "register", "settings", "profile", "profiles", "account", "accounts", "home", "dashboard", "feed", "post", "posts", "message", "messages", "friends", "friend", "friendship", "friendships", "club", "clubs", "create", "edit", "delete", "update", "remove", "add", "new", "old", "all", "everyone", "everybody", "nobody", "noone", "someone", "somebody", "anyone", "anybody", "someone", "somebody", "none", "nothing", "something", "everything", "anything", "everything", "somet"]
export function getDomainFromEmail(email) {
  var regex = /@(.+)/;
  var domain = email.match(regex)[1];
  return domain;
}
// Thank you https://stackoverflow.com/users/164392/csharptest-net

export function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function formatNumber(num) {
  if (num < 1000) {
    return num;
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'k';
  } else if (num < 1000000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else {
    return (num / 1000000000).toFixed(1) + 'B';
  }
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



export function validateEmail(email) {
  const domain = getDomainFromEmail(email);
  return validEmailDomains.includes(domain);
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validateUsername(username) {
  return username.length <= 20 && !notValidUsernames.includes(username);
}

export function validateDisplayName(displayName) {
  return displayName.length <= 20;
}

export function validateClubName(clubName) {
  return clubName.length <= 20;
}

export function validateClubDescription(clubDescription) {
  return clubDescription.length <= 100;
}

export function validateBio(bio) {
  return bio.length <= 30;
}