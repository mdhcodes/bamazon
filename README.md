# bamazon
Node.js &amp; MySQL Application

### Overview

Bamazon is an Amazon-like storefront created with Node.js and MySQL. The application fills customer orders and reduces store inventory as needed.  

### Customer View

[Click here to see the Customer View in action](/video/customer_view.webm).

This application includes a MySQL database named `bamazon_db` and a table named `products`.

The table includes the following columns:
  * item_id (unique id for each product)
  * product_name (name of each product)
  * department_name (name of the department where the item can be found)
  * price (customer cost)
  * stock_quantity (how much of the product is available in the store)

The 'Customer View' Node application is called `bamazon_customer.js`. Running this application will first display a table with the title 'ITEMS FOR SALE' that displays all of the items available to purchase. The user is then prompted with a question:

  * Would you like to purchase any of these items?
    * If true (they want to make a purchase), the user will see the following messages:
      * Please enter the ID of the product you'd would like to buy:
      * How many would you like to buy?
        * Once the user places an order, the application checks if the store has enough items to meet the customer's request.
          * If true (stock_quantity >= number of items the customer would like to buy), fulfill the order and display the total cost of the purchase.
             * We'd be happy to fill your order! The total price is $ + (price * number of items the customer would like to   buy).
             * Update the SQL database to reflect the remaining quantity (stock_quantity - number of items purchased).
             * Display the table with the change / update.
             * Thank you for your purchase!
          * If false (stock_quantity < number of items the customer would like to buy), display message.
            * Insufficient quantity! We're unable to fill your order at this time.
            * We have only + stock_quantity + items in stock.
            * Display the table with no change / update.
    * If false (they don't want to make a purchase), the user will see this message, 'Have a great day!'