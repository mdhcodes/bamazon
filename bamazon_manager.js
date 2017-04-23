// Include npm package 'mysql' to create and manipulate SQL databases.
var mysql = require('mysql');

// Include the npm package 'colors' to customize command line text.
var colors = require('colors');

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
  managerOptions();
});


var managerOptions = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Please select what you\'d like to do?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
  ]).then(function(answers) {
    switch(answers.option) {
      case 'View Products for Sale':
        displayAllProducts();
      break;
      case 'View Low Inventory':
        displayLowInventory();
      break;
      case 'Add to Inventory':
        addToInventory();
      break;
      case 'Add New Product':
        addNewProduct();
      break;
    }
  });
};


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
    //console.log(results);
    console.log('\n' + table.toString());
  }); // end connection.query()
}; // end displayTable()


// Function to display the table with all the products for sale including the IDs, names, departments, prices, and quantities.
var displayAllProducts = function() {
  console.log('ITEMS FOR SALE');
  displayTable();
  selectAnotherOption();
}; // end displayAllProducts()


// Function to list all items with an inventory count lower than five.
var displayLowInventory = function() {
  var query = "SELECT `item_id`, `product_name`, `department_name`, `price`, `stock_quantity` FROM  `products` WHERE `stock_quantity` < 5";
  connection.query(query, function(error, results) {
    if(error) throw error;
    //console.log('Results', results.length);
    console.log('LOW INVENTORY');
    if(results.length === 0) {
      console.log('------------------------------------');
      console.log('There are no products with an inventory below 5 items.');
    } else {
      // Loop over the results array and display details about the products with low inventory.
      results.forEach(function(element, index) {
        console.log('------------------------------------');
        console.log('ID:', results[index].item_id);
        console.log('Product Name:', results[index].product_name);
        console.log('Department:', results[index].department_name);
        console.log('Price:', results[index].price);
        console.log('stock Quantity:', results[index].stock_quantity);
      });
    }
    console.log('------------------------------------');
    selectAnotherOption();
  }); // end connection.query()
}; // end displayLowInventory()


// Function to display prompts that will allow the manager to "add more" of any item currently in the store.
var addToInventory = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Please enter the ID of the product you\'d like to add items to:',
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        } else {
          console.log(' Please enter a number.'.red);
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'number',
      message: 'How many would you like to add?',
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        } else {
          console.log(' Please enter a number.'.red);
          return false;
        }
      }
    }
  ]).then(function(answers) {
    var query = "SELECT `stock_quantity` FROM `products` WHERE item_id=" + answers.id;
    connection.query(query, function(error, results) {
      if(error) throw error;
      //console.log(results);
      var itemId = answers.id;
      console.log('ID', itemId);
      var inventory = results[0].stock_quantity;
      console.log('Stock Quantity', inventory);
      var amountToAdd = parseFloat(answers.number);
      console.log('Amount To Add', amountToAdd);
      updateStock(itemId, inventory, amountToAdd);
      selectAnotherOption();
    });
  });
};


var updateStock = function(itemId, inventory, amountToAdd) {
  var query = "UPDATE `products` SET stock_quantity=" + (inventory += amountToAdd) + " WHERE item_id=" + itemId;
  connection.query(query, function(error, results) {
    if(error) throw error;
    displayTable();
  });
};


// Function to allow the manager to add a completely new product to the store.
var addNewProduct = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'input',
      name: 'productName',
      message: 'Please enter the name of the product:',
    },
    {
      type: 'input',
      name: 'departmentName',
      message: 'Please enter the name of the department:',
    },
    {
      type: 'input',
      name: 'productPrice',
      message: 'Please enter the price for this product:',
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        } else {
          console.log(' Please enter a number.'.red);
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'stockQuantity',
      message: 'Please enter the number of items you\'re adding to the inventory:',
      validate: function(value) {
        if(isNaN(value) === false) {
          return true;
        } else {
          console.log(' Please enter a number.'.red);
          return false;
        }
      }
    }
  ]).then(function(answers) {
    var newProduct = '"' + answers.productName + '", ' + '"' + answers.departmentName + '", ' + answers.productPrice + ", " + answers.stockQuantity;
    var query = "INSERT INTO `products` (`product_name`, `department_name`, `price`, `stock_quantity`) VALUES(" + newProduct + ")";
    //console.log(newProduct);
    //console.log(query);
    connection.query(query, function(error, results) {
      if(error) throw error;
      //console.log(results);
      displayTable();
      selectAnotherOption();
    });
  });
};


// Function to ask the manager if they'd like to selectAnotherOption.
var selectAnotherOption = function() {
  // Include the npm package 'inquirer' and ask the user a series of questions.
  var inquirer = require('inquirer');
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'anotherOption',
      message: 'Would you like to select another option?'
    }
  ]).then(function(answers) {
    if(answers.anotherOption) {
      managerOptions();
    } else {
      console.log('Thank you for your time!');
      connection.end();
    }
  });
};