// Include npm package 'mysql' to create and manipulate SQL databases.
var mysql = require('mysql');


// Create a mysql connection to the bamazon_db database.
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'code1310',
  database: 'bamazon_db'
});


// Establish a connection to the bamazon_db database.
connection.connect(function(error) {
  if(error) throw error;
  console.log('Connection ID:', connection.threadId);
  displayProducts();
});


// Function to display the table with all the products for sale.
var displayTable = function() {
  // Include the npm package 'cli-table' to create a custom command line table.
  var Table = require('cli-table');
  // Include the npm package 'colors' to customize command line cli-tables.
  var colors = require('colors');
  // Instantiate - create a new instance of the table object.
  var table = new Table({
    head: ['ID'.cyan, 'Product Name'.cyan, 'Department'.cyan, 'Price'.cyan, 'Stock Quantity'.cyan],
    colWidths: [5, 30, 20, 20, 20]
  });
  // Establish a connection to the database to access stored information and populate the table.
  connection.query('SELECT * FROM `products`', function(error, results) {
    if(error) throw error;
    //console.log('Products', results);
    // The table is an array so all array methods apply.
    for(var i = 0; i < results.length; i++) {
      table.push(
          [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
      );
    }
    // Print the table.
    console.log('\n' + table.toString());
  }); // end connection.query()
}; // end displayTable()


// Function to display the items for sale and execute start().
var displayProducts = function() {
  // Display the table title.
  console.log('ITEMS FOR SALE');
  // Execute displayTable() and show all the items for sale.
  displayTable();
    // Execute the start() function.
    start();
}; // end displayProducts()


// Function to start the customer interaction and ask them if they'd like to buy an item for sale.
var start = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmBuy',
      message: 'Would you like to purchase any of these items?'
    }
  ]).then(function(answers) {
    if(answers.confirmBuy) {
      // If the customer would like to buy something, execute buyProducts().
      buyProducts();
    } else {
      // If the customer doesn't want to buy anything, display a friendly message.
      console.log('Have a great day!');
    }
  }); // end then() Promise
}; // end start()


// Function to prompt users with two messages when they choose to make a purchase.
var buyProducts = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Please enter the ID of the product you\'d like to buy:',
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        } else {
          return false;
          console.log('Please enter a number.');
        }
      }
    },
    {
      type: 'input',
      name: 'number',
      message: 'How many would you like to buy?',
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        } else {
          return false;
          console.log('Please enter a number.');
        }
      }
    }
  ]).then(function(answers) {
    console.log('Item ID:', answers.id, 'Item Amount:', answers.number);
    // Establish a connection to the database to access stored information.
    var query = "SELECT price, stock_quantity FROM `products` WHERE item_id=" + answers.id;
    connection.query(query, function(error, results) {
      if(error) throw error;
      //console.log('Current Inventory:', results[0].stock_quantity);
      var itemId = answers.id;
      //console.log('Results', results);
      var itemInventory = results[0].stock_quantity;
      console.log('Item Inventory:', results[0].stock_quantity);
      var itemAmount = answers.number;
      //console.log('Item Amount (variable):', answers.number);
      var itemPrice = results[0].price;
      var totalPrice = parseFloat(itemPrice) * parseFloat(itemAmount);
      // Check if the store has enough items to meet the customer's request.
      if(itemInventory >= itemAmount) {
        // Fulfill the customer's order and show the customer the total cost of their purchase.
        console.log('We\'d be happy to fill your order! The total price is $' + totalPrice + '.');
        // Update the SQL database to reflect the remaining quantity.
        updateStock(itemId, itemInventory, itemAmount);
        // Execute continueShopping()
        continueShopping();
      } else {
        // Prevent the order from going through and explain to the customer why we can't place their order.
        console.log('Insufficient quantity! We\'re unable to fill your order at this time.');
        console.log('We have only ' + itemInventory + ' items in stock.');
        // Execute displayTable()
        displayTable();
        // Execute continueShopping()
        continueShopping();
      }
    }); // end connection.query()
  }); // end then() Promise
}; // end buyProducts()


// Function to update the stock_quantity when a purchase is successfully completed.
var updateStock = function(itemId, inventory, purchaseAmount) {
  // Build query to decrease the number of items in stock after a purchase.
  var query = "UPDATE `products` SET stock_quantity=" + (inventory -= purchaseAmount) + " WHERE item_id=" + itemId;
  connection.query(query, function(error, results) {
    if(error) throw error;
    // Execute displayTable() to display the updated information.
    displayTable();
  }); // end connection.query()
}; // end updateStock()


// Function to ask the customer if they'd like to continue shopping.
var continueShopping = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'buyMore',
      message: 'Would you like to continue shopping?'
    }
  ]).then(function(answers) {
    if(answers.buyMore) {
      buyProducts();
    } else {
      console.log('Thank you for your purchase!');
    }
  });
};
