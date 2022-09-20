const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

//Creating Options Tag & Inserting it inside Select Tag
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    // Selecting USD by Default as From Currency and AED as To Currency
    let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "AED" ? "selected" : "";
    //Creating Option tag with passing currency code as a text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    //inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", e => {
    loadFlag(e.target); //calling loadFlag with passing target element as an argument
  });
}

//Showing Flag of a Selected Country
function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) { // if currency code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
      imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", e => {
  e.preventDefault(); // preventing form from submiting
  getExchangeRate();
});

//Exchanging or Reversing Currency Codes on Icon Click
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value; //temporary currency code of FROM drop list
  fromCurrency.value = toCurrency.value; // passing To currency code to From Currency code
  toCurrency.value = tempCode; // passing temporary currency code to TO currency code
  loadFlag(fromCurrency); //calling loadFlag with passing select element (FromCurrency) of From
  loadFlag(toCurrency);//calling loadFlag with passing select element (ToCurrency) of To
  getExchangeRate();
})


//Creating Function, Sending Request to API, Retrieving Data From API
function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  //If user do not enter a value or enters 0, 1 will appear as a default in the input field
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let apiKey = "bcd3e8a34977a6029894480f";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  //fetching api response and returing it with parsing into js obj and in another, then method receving that obj 
  fetch(url).then(response => response.json()).then(result => {
    let exchangeRate = result.conversion_rates[toCurrency.value];
    let totalExRate = (amountVal * exchangeRate).toFixed(2);
    exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
  }).catch(() => { //If user is offline or any other error occured while fetching data, then catch function will run  
    exchangeRateTxt.innerText = "Something went wrong";
  });
}