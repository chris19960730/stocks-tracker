const searchUsers = async (queryRegex) => {
  const rawRes = await fetch('/friends?queryRegex=' + queryRegex);
  const usersInfo = await rawRes.json();
  const result = usersInfo.map((user) => {
    const info = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
    return info;
  });
  return result;
};

const onClickSearchBtn = async () => {
  const queryRegex = document.querySelector('#friend').value;
  const usersInfo = await searchUsers(queryRegex);
  console.log(usersInfo);
  loadTable(usersInfo);
};

const loadTable = (usersInfo) => {
  const table = document.querySelector('#usersResultTable');
  table.innerHTML = '';
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const colName = ['First Name', 'Last Name', 'Email Address', 'Actions'];
  for (let i = 0; i < 4; i++) {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode(colName[i]));
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  usersInfo.forEach((user) => {
    const row = document.createElement('tr');
    const td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(user.first_name));
    const td3 = document.createElement('td');
    td3.appendChild(document.createTextNode(user.last_name));
    const td4 = document.createElement('td');
    td4.appendChild(document.createTextNode(user.email));
    const td5 = document.createElement('td');
    const viewProfileBtn = document.createElement('button');
    viewProfileBtn.className = 'btn btn-outline-success';
    viewProfileBtn.appendChild(document.createTextNode('View Profile'));
    viewProfileBtn.addEventListener('click', () => {
      console.log(user._id);
      loadUserWatchlists(user._id);
    });
    td5.appendChild(viewProfileBtn);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
};

document
  .querySelector('#searchBtn')
  .addEventListener('click', onClickSearchBtn);

const loadUserWatchlists = async (user_id) => {
  const res = await fetch('/friendStocks?user_id=' + user_id);

  const stocks = await res.json();
  console.log(stocks);

  const userRes = await fetch('/userProfile?user_id=' + user_id);
  const user = await userRes.json();
  console.log(user);

  document.querySelector(
    '#exampleModalLabel'
  ).innerHTML = `${user.first_name}'s watchlists
  `;
  const table = document.querySelector('#stocksList');
  table.innerHTML = '';
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const colName = ['Ticker', 'Logo', 'Company Name', 'High Price', 'Low Price'];
  for (let i = 0; i < 5; i++) {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode(colName[i]));
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  stocks.forEach((stock) => {
    const row = document.createElement('tr');
    const th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.appendChild(document.createTextNode(stock.ticker));
    const td1 = document.createElement('td');
    td1.className = 'w-25';
    const image = document.createElement('img');
    image.className = 'img-fluid img-thumbnail';
    image.src = stock.logo;
    image.style.maxHeight = '88px';
    image.style.maxWidth = '88px';
    td1.appendChild(image);
    const td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(stock.companyName));
    const td3 = document.createElement('td');
    td3.appendChild(document.createTextNode(stock.high_price));
    const td4 = document.createElement('td');
    td4.appendChild(document.createTextNode(stock.low_price));
    row.appendChild(th);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // eslint-disable-next-line no-undef
  const myModal = new bootstrap.Modal(
    document.getElementById('profileDetailModal'),
    {
      keyboard: true,
    }
  );
  myModal.show();
};
