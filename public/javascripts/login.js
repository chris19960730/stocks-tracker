const submit = document.querySelector('#login');

submit.addEventListener('click', (event) => {
  event.preventDefault();
  const formData = {};
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  formData.email = email;
  formData.password = password;
  postLoginData(formData);
});

const postLoginData = async (formData) => {
  fetch('/login', {
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
    .catch((error) => {
      showErrorMsg();
      console.error('Error:', error);
    });
};

const showErrorMsg = () => {
  const errorDiv = document.querySelector('#errrorMessage');
  errorDiv.innerHTML = '';

  errorDiv.innerHTML = `<div class="alert alert-warning fade show"  role="alert"> 
 <strong>Something wrong!</strong> you should check in on some of
 those fields below. </div>
 `;
};
