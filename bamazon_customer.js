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
  // console.log('Connection ID:', connection.threadID); // undefined?
});


// Upon running this application, the items for sale will be displayed.
var displayProducts = function() {
  connection.query('SELECT * FROM `products`', function(error, results) {
    if(error) throw error;
    //console.log('Products', results);

    console.log('----- ITEMS FOR SALE -----');
    for(var i = 0; i < results.length; i++) {
      console.log('Product ID:', results[i].item_id);
      console.log('Product Name:', results[i].product_name);
      console.log('Department:', results[i].department_name);
      console.log('Price: $' + results[i].price);
      console.log('--------------------------');
    }
  });
};

displayProducts();


connection.end(function() {
  console.log('The connection ended.');
});