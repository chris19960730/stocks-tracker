const getCurrentUserProfile = async () => {
  const res = await fetch('/myProfile');
  const data = await res.json();
  return data;
};

const fillInfo = async () => {
  const user = await getCurrentUserProfile();
  const firstName = document.querySelector('#first_name');
  firstName.value = user.first_name;
  const lastName = document.querySelector('#last_name');
  lastName.value = user.last_name;
  const email = document.querySelector('#email');
  email.value = user.email;
};

fillInfo();
