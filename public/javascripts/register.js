const submit = document.querySelector('#submit');

submit.addEventListener('click', (event) => {
  event.preventDefault();
  const formData = {};
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const firstName = document.querySelector('#first_name').value;
  const lastName = document.querySelector('#last_name').value;
  const passwordConfirmation = document.querySelector('#password_confirmation')
    .value;
  formData.email = email;
  formData.password = password;
  formData.first_name = firstName;
  formData.last_name = lastName;
  if (passwordConfirmation === password) {
    postRegisterData(formData);
  } else {
    showErrorMsg();
  }
});

const postRegisterData = async (formData) => {
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        window.location = '/watchlists';
      } else {
        showErrorMsg();
      }
    })
    .catch(() => {
      console.error('Error');
    });
};

const showErrorMsg = () => {
  const errorDiv = document.querySelector('#errrorMessage');
  errorDiv.innerHTML = '';
  errorDiv.innerHTML = `<div class="alert alert-warning fade show"  role="alert"> 
   <strong>Password not match!</strong> Please try again </div>
   `;
};
