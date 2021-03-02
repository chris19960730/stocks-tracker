let stockToDatabase = null;
const insertStockIntoPage = async () => {
  const ticker = document.querySelector('#ticker').value.toUpperCase();
  console.log(ticker);
  const res = await fetch('/stocks?ticker=' + ticker);

  const stockInfo = await res.json();
  stockToDatabase = {
    ...stockInfo,
    logo: stockInfo.logo.url,
  };
  const resultDiv = document.createElement('div');
  resultDiv.setAttribute('id', 'stockResult');
  // create card in the page
  const card = document.createElement('div');
  card.className = 'card';
  const image = document.createElement('img');
  image.src = stockInfo.logo.url;
  image.className = 'card-img-top';
  image.style.width = '12rem';
  card.appendChild(image);

  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  cardTitle.className = 'card-title';
  const titleCotent = document.createTextNode(ticker);
  cardTitle.appendChild(titleCotent);
  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);
  const infoList = document.createElement('ul');
  infoList.classList = 'list-group list-group-flush';
  for (const key in stockInfo) {
    if (key != 'logo') {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      const content = document.createTextNode(key + ': ' + stockInfo[key]);
      li.appendChild(content);
      infoList.appendChild(li);
    }
  }
  card.appendChild(infoList);
  resultDiv.appendChild(card);

  // if stock already in watchlist, can't add to lists
  const stocks = await getCurrentUserStocks();
  let alreadyTracked = false;
  stocks.find((stock) => {
    if (stock.ticker === ticker) {
      alreadyTracked = true;
    }
  });

  if (alreadyTracked) {
    const span = document.createElement('span');
    span.className = 'badge bg-warning text-dark mt-3';
    span.appendChild(
      document.createTextNode('You have already been tracking this stock')
    );
    resultDiv.appendChild(span);
  } else {
    // add to watchlist button
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-outline-primary';
    addBtn.setAttribute('id', 'addBtn');
    addBtn.appendChild(document.createTextNode('Add to watchlist'));
    resultDiv.appendChild(addBtn);
    addBtn.addEventListener('click', addStock);
  }
  const oldDiv = document.getElementById('stockResult');
  document.getElementById('result').replaceChild(resultDiv, oldDiv);
};

const searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener('click', insertStockIntoPage);

const addStock = async () => {
  if (stockToDatabase) {
    fetch('/myStocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockToDatabase),
    })
      .then(console.log('Success'))
      .catch((error) => {
        console.error('Error:', error);
      });
    window.location = '/watchlists';
  }
};

const getCurrentUserStocks = async () => {
  const res = await fetch('/myStocks');
  const data = await res.json();
  //   console.log(data);
  return data;
};

const showUserStocks = async () => {
  const stocks = await getCurrentUserStocks();
  console.log(stocks);
  if (!stocks || stocks.length === 0) {
    return;
  }
  const myStockList = document.querySelector('#myStockList');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const colName = [
    'Ticker',
    'Logo',
    'Company Name',
    'High Price',
    'Low Price',
    'Actions',
  ];
  for (let i = 0; i < 6; i++) {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.appendChild(document.createTextNode(colName[i]));
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  myStockList.appendChild(thead);
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
    image.style.maxHeight = '138px';
    image.style.maxWidth = '138px';
    td1.appendChild(image);
    const td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(stock.companyName));
    const td3 = document.createElement('td');
    td3.appendChild(document.createTextNode(stock.high_price));
    const td4 = document.createElement('td');
    td4.appendChild(document.createTextNode(stock.low_price));
    const td5 = document.createElement('td');
    const a = document.createElement('a');
    a.className = 'btn btn-outline-primary';
    a.href = stock.website;
    a.appendChild(document.createTextNode('check out homePage'));
    td5.appendChild(a);
    row.appendChild(th);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    tbody.appendChild(row);
  });
  myStockList.appendChild(tbody);
  addRemoveInputElement();
};

const addRemoveInputElement = async () => {
  //   <select class="form-select" aria-label="Default select example">
  //     <option selected>Open this select menu</option>
  //     <option value="1">One</option>
  //     <option value="2">Two</option>
  //     <option value="3">Three</option>
  //   </select>;
  //   <button type="button" class="btn btn-outline-danger">
  //     Danger
  //   </button>;
  const select = document.createElement('select');
  select.className = 'form-select';
  select.setAttribute('id', 'selectInput');
  const stocks = await getCurrentUserStocks();
  const option = document.createElement('option');
  option.setAttribute('selected', true);
  option.value = '';
  option.appendChild(
    document.createTextNode('Select a stock to remove from your watchlist')
  );
  select.appendChild(option);

  stocks.forEach((stock) => {
    const option = document.createElement('option');
    option.value = stock.ticker;
    option.appendChild(document.createTextNode(stock.ticker));
    select.appendChild(option);
  });

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-outline-danger';
  submitBtn.appendChild(document.createTextNode('Remove'));
  submitBtn.addEventListener('click', deleteStock);
  document.querySelector('#removeInput').appendChild(select);
  document.querySelector('#removeInput').appendChild(submitBtn);
  console.log(document.querySelector('#selectInput').value);
};

const deleteStock = async () => {
  const ticker = document.querySelector('#selectInput').value.toUpperCase();
  if (!ticker) {
    return;
  }
  fetch('/myStocks', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker: ticker }),
  })
    .then((window.location = '/watchlists'))
    .catch((error) => {
      console.error('Error:', error);
    });
};

// hacky way, to refresh page after searching
// const tickerInput = document.querySelector('#ticker');
// const clearSearchResult = () => {
//   if (tickerInput.value) {
//     window.location = '/watchlists';
//   }
// };
// tickerInput.addEventListener('focus', clearSearchResult);

window.onload = () => {
  console.log('reloaded!');
  showUserStocks();
};
