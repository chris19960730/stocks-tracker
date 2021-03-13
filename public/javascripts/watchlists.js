let stockToDatabase = null;
const insertStockIntoPage = async () => {
  const result = document.querySelector('#result');
  result.innerHTML = '';
  const resultDiv = document.createElement('div');
  resultDiv.setAttribute('id', 'stockResult');
  resultDiv.innerHTML = '';
  const ticker = document.querySelector('#ticker').value.toUpperCase();
  const res = await fetch('/stocks?ticker=' + ticker);

  if (res.status === 200) {
    const stockInfo = await res.json();
    stockToDatabase = {
      ...stockInfo,
      logo: stockInfo.logo.url,
    };
    const card = document.createElement('div');
    card.className = 'card';
    const image = document.createElement('img');
    image.src = stockInfo.logo.url;
    image.className = 'card-img-top';
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
    const stockInfoLabelText = {
      ticker: 'Stock Ticker',
      high_price: 'Hight Price',
      low_price: 'Low Price',
      companyName: 'Company Name',
      website: 'Website',
    };
    for (const key in stockInfo) {
      if (key == 'website') {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const anchor = document.createElement('a');
        anchor.href = stockInfo[key];
        const content = document.createTextNode(stockInfo[key]);
        anchor.appendChild(content);
        li.appendChild(
          document.createTextNode(stockInfoLabelText[key] + ' : ')
        );
        li.appendChild(anchor);
        infoList.appendChild(li);
        continue;
      }
      if (key != 'logo') {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const content = document.createTextNode(
          (key in stockInfoLabelText ? stockInfoLabelText[key] : key) +
            ': ' +
            stockInfo[key]
        );
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
      span.className = 'badge bg-warning text-dark';
      span.appendChild(
        document.createTextNode('You have already been tracking this stock')
      );
      card.appendChild(span);
    } else {
      // add to watchlist button
      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn-outline-primary';
      addBtn.setAttribute('id', 'addBtn');
      addBtn.appendChild(document.createTextNode('Add to watchlist'));
      card.appendChild(addBtn);
      addBtn.addEventListener('click', addStock);
    }
    document.getElementById('result').appendChild(resultDiv);
  } else {
    const alertContainer = document.querySelector('#alertContainer');
    const message =
      'No data founded for this ticker symbol, double-check you input!';
    alertContainer.innerHTML =
      '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>' +
      message +
      '</strong> <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
  }
};

const searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener('click', insertStockIntoPage);

const addStock = async () => {
  const result = document.querySelector('#result');
  result.innerHTML = '';
  if (stockToDatabase) {
    fetch('/myStocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockToDatabase),
    })
      .then(console.log('Success'))
      .then(() => showUserStocks())
      .catch((error) => {
        console.error('Error:', error);
      });
  }
};

const getCurrentUserStocks = async () => {
  const res = await fetch('/myStocks');
  const data = await res.json();
  return data;
};

const showUserStocks = async () => {
  const myStockList = document.querySelector('#myStockList');
  myStockList.innerHTML = '';
  const stocks = await getCurrentUserStocks();
  if (!stocks || stocks.length === 0) {
    return;
  }
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
    a.className = 'btn btn-outline-primary me-3';
    a.href = stock.website;
    a.appendChild(document.createTextNode('Company Homepage'));
    td5.appendChild(a);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-outline-danger';
    removeBtn.appendChild(document.createTextNode('Remove'));
    removeBtn.addEventListener('click', () => {
      removeStock(stock._id);
    });
    td5.appendChild(removeBtn);
    row.appendChild(th);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    tbody.appendChild(row);
  });
  myStockList.appendChild(tbody);
};

const removeStock = (stock_id) => {
  fetch('/myStocks', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stock_id: stock_id }),
  })
    .then(() => {
      showUserStocks();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
showUserStocks();
