// const getStockInfo = async () => {
//   const ticker = document.querySelector('#ticker').value;
//   console.log(ticker);
//   const res = await fetch('/stocks?ticker=' + ticker);

//   const stockInfo = await res.json();
//   return stockInfo;
// };

let stockToDatbase = null;
const insertStockIntoPage = async () => {
  const ticker = document.querySelector('#ticker').value;
  console.log(ticker);
  const res = await fetch('/stocks?ticker=' + ticker);

  const stockInfo = await res.json();
  stockToDatbase = {
    ...stockInfo,
    logo: stockInfo.logo.url,
  };
  // create card in the page
  const card = document.createElement('div');
  card.className = 'card';
  const image = document.createElement('img');
  image.src = stockInfo.logo.url;
  image.className = 'card-img-top';
  image.style.width = '18rem';
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

  const stockResult = document.getElementById('stockResult');
  stockResult.parentNode.insertBefore(card, stockResult);
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/myStocks');
  const addBtn = document.createElement('button');
  addBtn.className = 'btn btn-outline-primary';
  addBtn.setAttribute('id', 'addBtn');
  addBtn.appendChild(document.createTextNode('Add to watchlist'));
  stockResult.parentNode.insertBefore(addBtn, stockResult);
  addBtn.addEventListener('click', postData);
};

const searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener('click', insertStockIntoPage);

const postData = async () => {
  if (stockToDatbase) {
    fetch('/myStocks', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockToDatbase),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
};
