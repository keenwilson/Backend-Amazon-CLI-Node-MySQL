require('dotenv').config();

// Requiring packages
const mysql = require('mysql');
const inquirer = require('inquirer');
const columnify = require('columnify');
const c = require('ansi-colors');
const boxen = require('boxen');

// Initial variables
let updatedInventory = [];
let updateItemID, updateName, updateDepartmet, updatePrice, updateQty, stockQty

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
    console.log(boxen(c.inverse.yellow("\n Bamazon Manager View \n"), { padding: 1, margin: 1, borderStyle: 'round' }));
    console.log();
    // Running this application will first display all of the options the manager can do
    managerMenuOptions();
});

function managerMenuOptions() {
    // Use inquirer package to ask manager what they want to do
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "Select a menu option:",
            choices: ["View Products for Sale"
                , "View Low Inventory"
                , "Add to Inventory"
                , "Add New Product"
                , "Quit Bamazon Manager"]
        }])
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    readProductsForSale();
                    break;
                case "View Low Inventory":
                    readLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    // code block
                    addNewProduct();
                    break;
                case "Quit Bamazon Manager":
                    quitBamazonManager();
                    break;
            }
        });
};

function quitBamazonManager() {
    // Print total cost to the customer
    console.log(c.yellow("\nExiting Bamazon Manager App...\nHave a wonderful day!\n\n "));

    // End connections
    connection.end();
};


function readProductsForSale() {
    console.log(c.inverse.green("\n  View Products for Sale  \n"));
    console.log(c.green("Displayinging all productsfor sale \n"));
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 14,
            config: {
                product_name: { maxWidth: 70 }
            }
        })
        console.log(columns)
        managerMenuOptions();
    });
};


function readLowInventory() {
    console.log(c.inverse.green("\n  View Low Inventory  \n"));
    console.log(c.green("Displayinging products with inventory less than 50 \n"));
    // Read all products with inventory less than 50
    var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 50";
    connection.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 14,
            config: {
                product_name: { maxWidth: 70 }
            }
        })
        console.log(columns)
        managerMenuOptions();
    });
};

function addToInventory() {
    console.log(c.inverse.green("\n  Add to Inventory  \n"));
    console.log(c.green("Current inventory of all products for sale \n"));

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 14,
            config: {
                product_name: { maxWidth: 70 }
            }
        })
        console.log(columns)

        // Create an array of choice for inquirer.js
        var productChoices = [];

        for (var i = 0; i < res.length; i++) {
            var productChoice = res[i].product_name.toString();
            productChoices.push(productChoice);
        }
        // Ask the manager which product he/she wants to add inventory
        inquirer
            .prompt([{
                name: "item",
                type: "list",
                message: "Which item would you like to add inventory to?",
                choices: productChoices
            }, {
                name: "quantity",
                type: "input",
                message: "What quantity would you like to add?"
            }])
            .then(function (answer) {

                // Find the selected product and add the quantity to inventory
                // Identify the product the customer wants to buy
                res.forEach(product => {
                    if (product.product_name == answer.item) {

                        // Refer the product info
                        updateItemID = product.item_id;
                        updateName = product.product_name;
                        updateDepartmet = product.department_name;
                        updatePrice = product.price;
                        originalQty = parseInt(product.stock_quantity);
                        updateQty = parseInt(answer.quantity);
                        stockQty = parseInt(product.stock_quantity) + parseInt(updateQty);

                        /*                       // Store this product to a changedInventory variable
                                              var changedInventory = {
                                                  item_id: updateItemID
                                                  , product_name: updateName
                                                  , department_name: updateDepartmet
                                                  , price: updatePrice
                                                  , original_quantity: originalQty
                                                  , update_quantity: updateQty
                                                  , stock_quantity: stockQty
                                              }
                                              // Add to the updatedInventory array
                                              updatedInventory.push(changedInventory); */

                        // Update inventory on the SQL database to reflect the remaining quantity.
                        updateInventory();

                        // Print order details to the user
                        console.log(c.italic.yellow("\nAdd to Inventory\n") +

                            c.green(updateName) + "\n " +
                            c.cyan("Item#: " + updateItemID) + "\n " +
                            c.cyan("Quantity: " + c.white(originalQty) + c.yellow(" + " + updateQty)) + "\n\n " +
                            c.italic.yellow("The inventory for " + updateName + " has been updated to " + stockQty)
                            + "\n---------------------------------------------------------------------------------------------------------------------------------\n");

                        managerMenuOptions();
                    };



                });
            });


    });
}

function updateInventory() {
    // Update stock quantity in the database
    var query = "UPDATE products SET ? WHERE  ?";
    connection.query(query, [{ stock_quantity: stockQty }, { item_id: updateItemID }], function (err, res) {
        if (err) throw err;
    });
}

function addNewProduct() {
    console.log(c.inverse.green("\n  Add New Product  \n"));
    console.log(c.green("Enter product information \n"));

    // Use inquirer.prompt to ask for the manager input
    inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "What is product name?"
        }, {
            name: "itemid",
            type: "input",
            message: "What is an 8-digit item id?",
            validate: validateItemID
        }, {
            name: "department",
            type: "list",
            message: "What department is this product in?",
            choices: ["Sports & Outdoors", "Kitchen & Dining", "Home Decor", "Toys", "Women's Clothing", new inquirer.Separator(), "Others"]
        }, {
            name: "price",
            type: "input",
            message: "What is the retail price per item"
        }, {
            name: "quantity",
            type: "input",
            message: "What is the initial stock quantity?"
        }]).then(function (answer) {

            var sql = `INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
            VALUES ('${answer.itemid}', "${answer.name}", "${answer.department}", '${answer.price}', '${answer.quantity}');`

            connection.query(sql, function (err, res) {
                if (err) throw err;
                // Print order details to the user
                console.log(c.italic.yellow("\nAdd New Product\n") +
                    c.green(`${answer.name} (Item#: ${answer.itemid})`) + c.cyan(`has been added to the store's product list.`) +
                    c.cyan(`\nDepartment: ${answer.department}`) +
                    c.cyan(`\nRetail price: $${answer.price}`) +
                    c.cyan(`\nStock Quantity: ${answer.quantity}`) +
                    "\n---------------------------------------------------------------------------------------------------------------------------------\n"
                );
                managerMenuOptions();
            });




           
        });
};



function validateItemID(x) {
    var isValid = /^[0-9]{8}$/.test(x);
    return isValid || "Item ID should be an 8-digit number";
};


function readProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // Using the columnify package, column headings are extracted from the keys in supplied objects.
        var columns = columnify(res, {
            minWidth: 14,
            config: {
                product_name: { maxWidth: 70 }
            }
        })
        console.log(columns)
    });
}