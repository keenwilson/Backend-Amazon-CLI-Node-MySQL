require('dotenv').config();

// Requiring packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const columnify = require('columnify');
const c = require('ansi-colors');

// Initial variables
let shoppingCart = [];
let buyItemID, buyName, buyDepartmet, buyPrice, buyQty, stockQty, subtotalCost;

// Connect to database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DATABASE_SECRET,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // Running this application will first display all of the items available for sale.
    readAvailableProducts();
});

function readAvailableProducts() {
    console.log(c.cyan("Displaying all of the products available for sale...\n"));
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity > 0";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 20,
            config: {
                product_name: { maxWidth: 80 }
            }
        })
        console.log(columns)
        buyThisProduct(res);
    });

}

function buyThisProduct(res) {
    // Create an array of choice for inquirer.js
    var buyProductChoices = [];

    for (var i = 0; i < res.length; i++) {
        var productChoice = res[i].product_name.toString();
        buyProductChoices.push(productChoice);
    }

    inquirer
        .prompt([{
            name: "buyID",
            type: "list",
            message: "Which item would you like to add to cart?",
            choices: buyProductChoices
        }, {
            name: "buyQuantity",
            type: "input",
            message: "What quantity would you like to purchase?",
        }])
        .then(function (answer) {

            // Identify the product the customer wants to buy
            res.forEach(product => {
                if (product.product_name == answer.buyID) {

                    // Refer the product info
                    buyItemID = product.item_id;
                    buyName = product.product_name;
                    buyDepartmet = product.department_name;
                    buyPrice = product.price;
                    buyQty = parseInt(answer.buyQuantity);
                    stockQty = parseInt(product.stock_quantity) - parseInt(buyQty);

                    // Check if your store has enough of the product to meet the customer's request
                    if (parseInt(stockQty) < 0) {
                        // We don't have enough inventory if stockQty is less than 0.
                        console.log(c.red("\n\n Insufficient quantity! We only have " + product.stock_quantity + " items of " + buyName + ".\n\n"));
                    } else if (parseInt(stockQty) >= 0) {
                        // If our store does have enough of the product, fulfill the customer's order

                        // Calculate subtotal cost
                        subtotalCost = parseFloat(buyPrice * buyQty).toFixed(2);

                        // Add this product to a cart
                        var newShoppingCartItem = {
                            item_id: buyItemID
                            , product_name: buyName
                            , department_name: buyDepartmet
                            , price: buyPrice
                            , buy_quantity: buyQty
                            , stock_quantity: stockQty
                            , subtotal_cost: subtotalCost
                        }
                        shoppingCart.push(newShoppingCartItem);

                        // Update inventory on the SQL database to reflect the remaining quantity.
                        updateInventory();

                        // Print order details to the user
                        console.log(c.italic.yellow("\nAdd to Cart\n") +
                            c.green(buyName) + "\n " +
                            c.cyan("Item#: " + buyItemID) + "\n " +
                            c.cyan("Qty: " + buyQty) + "\n\n " +
                            c.italic.yellow("                                             Subtotal: $" + subtotalCost)
                            + "\n--------------------------------------------------------------\n");
                    };
                }
            });
            askToContinueShopping(res);
        });
};

function askToContinueShopping(res) {

    inquirer
        .prompt([{
            name: "confirm",
            type: "list",
            message: "Would you like to continue shopping?",
            choices: ["Continue shopping!", "Ready to checkout!"]
        }])
        .then(function (answer) {

            switch (answer.confirm) {
                case "Continue shopping!":
                    readAvailableProducts();
                    break;
                case "Ready to checkout!":
                    // code block
                    showOrderSummary();
                    break;
                default:
                // code block
            }

        });

};

function updateInventory() {
    // Update stock quantity in the database
    var query = "UPDATE products SET ? WHERE  ?";
    connection.query(query, [{ stock_quantity: stockQty }, { item_id: buyItemID }], function (err, res) {
        if (err) throw err;
        // Log all results of the UPDATE statement
        /*  console.log(res);
         console.log(res.affectedRows + " inventory updated!\n"); */

    });
}
function showOrderSummary() {
    // Shows the customer the total cost of their purchase
    // Set totalCost equal to zero so that the app will add up the subtotal cost to it
    let totalCost = 0;

    // Print order summary to the user
    console.log(c.yellow.underline("\n\nOrder Summary\n"));

    // Prit details of each order item
    shoppingCart.forEach(product => {
        console.log(
            c.green(product.product_name) + "\n " +
            c.cyan("Item#: " + product.item_id) + "\n " +
            c.cyan("Qty: " + product.buy_quantity) + "\n\n " +
            c.italic.yellow("                                             Subtotal: $" + product.subtotal_cost)
            + "\n--------------------------------------------------------------\n");

        // Add subtotal cost of each order item to Total Cost
        var a = parseFloat(totalCost);
        var b = parseFloat(product.subtotal_cost);
        totalCost = a + b;
    });

    // Print total cost to the customer
    console.log(c.yellow("Total Cost: $" + totalCost))
    console.log(c.yellow("Thank you for shopping with us today!" + "\n\n "));

    // End connections
    connection.end();
};


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 20,
            config: {
                product_name: { maxWidth: 80 }
            }
        })
        console.log(columns)
    });
}