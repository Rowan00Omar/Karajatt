const db = require("../db");

exports.getProduct = async(req , res)=>{
  console.log("it")
   const productId = req.params.id
   const [products] = await db.query("SELECT * FROM products WHERE product_id =?",[productId])
   if (!products) return res.status(404).json({ message: 'Products Not found' });

   const category_id = products[0].category_id;

   const [category_name] = await db.query("SELECT category_name FROM categories WHERE id =?",[category_id])
   const [seller_name] = await db.query("SELECT first_name,last_name FROM users WHERE id =?",[products[0].seller_id])
   console.log(seller_name[0])
   const fullSellerName = seller_name[0].first_name+ " " + seller_name[0].last_name;
   console.log(fullSellerName)
   res.json({
     ...products[0],
     category_name: category_name[0].category_name,
     seller_name:  fullSellerName
    });
    
}