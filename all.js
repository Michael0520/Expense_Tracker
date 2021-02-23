$("#balance");
$("#money-plus");
$("#money-minus");
$("#list");
$("#form");
$("#text");
$("#amount");

// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: 12 },
//   { id: 2, text: "box", amount: -500 },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add addTransaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class = "delete-btn" onclick="removeTransaction(${
    transaction.id
  })" >x</button>
       `;
  list.appendChild(item);
}

// Update the balance, income the expense
function updateValues() {
  // 使用 map 方法回傳一個新 Array，他的內容是舊 Array 的 amount 值
  const amounts = transactions.map((transaction) => transaction.amount);
  // 用 reduce 方法，加總所有值的 amount，並 toFixed(2) 取到小數第二位
  // acc += item -> acc = acc + item
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    // .filter取得大於零的值
    .filter((item) => item > 0)
    // .reduce將 >0 的值 (income) 加總
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = ( // .filter 取得大於零的值 &  .reduce 將 <0 的值 (expense) 加總
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  // 將動態更新好的 income, total, expense 放到 DOM 裡面更新文字
  $("#balance").text(`$${total}`);
  $("#money-plus").text(`$${income}`);
  $("#money-minus").text(`$${expense}`);
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transaction", JSON.stringify(transactions));
}

// Init app
function init() {
  // list.innerHTML = "";
  $("#list").html("");

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

$("#form").submit(addTransaction);
