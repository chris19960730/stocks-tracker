const getCurrentUserProfile = async () => {
  const res = await fetch('/myProfile');
  const data = await res.json();
  return data;
};

const showUserProfile = async () => {
  const myProfile = document.querySelector('#myProfile');
  const user = await getCurrentUserProfile();
  console.log(user);
  if (!user || user.length === 0) {
    return;
  }

  const firstNameRow = document.createElement('div');
  firstNameRow.className = 'row';
  const firstNameLeftCol = document.createElement('div');
  firstNameLeftCol.className = 'col-lg-5';
  firstNameLeftCol.innerHTML = '<p>' + 'First Name' + '</p>';
  firstNameRow.appendChild(firstNameLeftCol);
  const firstNameRightCol = document.createElement('div');
  firstNameRightCol.className = 'col-lg-7';
  firstNameRightCol.innerHTML = '<p>' + user.first_name + '</p>';
  firstNameRow.appendChild(firstNameRightCol);
  myProfile.appendChild(firstNameRow);

  const lastNameRow = document.createElement('div');
  lastNameRow.className = 'row';
  const lastNameLeftCol = document.createElement('div');
  lastNameLeftCol.className = 'col-lg-5';
  lastNameLeftCol.innerHTML = '<p>' + 'Last Name' + '</p>';
  lastNameRow.appendChild(lastNameLeftCol);
  const lastNameRightCol = document.createElement('div');
  lastNameRightCol.className = 'col-lg-7';
  lastNameRightCol.innerHTML = '<p>' + user.last_name + '</p>';
  lastNameRow.appendChild(lastNameRightCol);
  myProfile.appendChild(lastNameRow);

  const emailRow = document.createElement('div');
  emailRow.className = 'row';
  const emailLeftCol = document.createElement('div');
  emailLeftCol.className = 'col-lg-5';
  emailLeftCol.innerHTML = '<p>' + 'Email Address' + '</p>';
  emailRow.appendChild(emailLeftCol);
  const emailRightCol = document.createElement('div');
  emailRightCol.className = 'col-lg-7';
  emailRightCol.innerHTML = '<p>' + user.email + '</p>';
  emailRow.appendChild(emailRightCol);
  myProfile.appendChild(emailRow);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'row';
  buttonRow.innerHTML =
    '<a href="/update_profile" class="btn btn-primary btn-block py-2"><span class="font-weight-bold">Change your information</span></button>';
  myProfile.appendChild(buttonRow);
  console.log('finish rendering');
};

showUserProfile();
