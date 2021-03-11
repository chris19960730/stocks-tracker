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
      // removeStock(user._id);
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
