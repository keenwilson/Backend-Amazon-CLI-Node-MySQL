require('dotenv').config();

const mysql = require('mysql');
const inquirer = require('inquirer');
const columnify = require('columnify');
const c = require('ansi-colors');

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
    console.log(c.yellow("Displaying all of the products available for sale...\n"));
    var query = "SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 20,
            config: {
              product_name: {maxWidth: 80}
            }
          })
        console.log(columns)
        buyProducts(res);
    });
    
}

function buyProducts(res){

    // Create an array of choice
    var buyProductChoices = [];

    for (var i=0; i < res.length; i++) {
        buyProductChoices.push(res[i].item_id.toString())      
    }

    
    inquirer
    .prompt([{
        name: "buyID",
        type: "list",
        message: "Which item would you like to buy?",
        choices: buyProductChoices
    },{
        name: "buyQuantity",
        type: "input",
        message: "What quantity would you like to purchase?",
    }])
    .then(function(answer) {

        res.forEach(product => {
            if (product.item_id == answer.buyID) {
                var buyName = product.product_name;
                var buyPrice = product.price
                var buyQty = answer.buyQuantity

                // Calculate subtotal cost
                var subtotalCost = parseFloat(product.price * answer.buyQuantity).toFixed(2) ;

                // Print order details to the user
                console.log(c.green("Order Summary: ") + " \n\n " +
                c.cyan(buyName) + "\n\n " +
                c.cyan("Qty: " + buyQty ) + "\n\n " +
                c.yellow("Subtotal: $" + subtotalCost));
            }
        });        
    });
};