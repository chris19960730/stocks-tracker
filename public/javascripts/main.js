const getStockLogo = async () => {
  const res = await fetch('/test');
  console.log(res);
  const imageSrc = await res.json();
  document.querySelector('#logo').src = imageSrc;
};

window.onload = () => {
  getStockLogo();
};
