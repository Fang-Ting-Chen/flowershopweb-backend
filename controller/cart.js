const CartModelPromise = require('../models/CartModel');

//獲取購物車數據
exports.getcart = async(req, res)=>{
    try{
        
        const CartModel = await CartModelPromise;

         /*//用作刪除購物車數據
        const existingCart = await CartModel.find();
        if (existingCart.length >0) {
            await CartModel.deleteMany({});
            return res.status(200).send('已删除所有產品');
        }*/

        const cartData = await CartModel.find({ user_id: req.session._id }); // 從資料庫中查詢購物車數據
        res.status(200).json(cartData); // 返回購物車數據給前端


    }catch (error) {
        console.error(error);
        res.status(500).send('發生錯誤');
    }
}

//增添數據到購物車
exports.addtocart = async(req, res)=>{
    try{
        const CartModel = await CartModelPromise;
        const userCart = await CartModel.findOne({ user_id: req.session._id }); 
        const item = req.body;

        // 確認找到用戶的購物車
        if (!userCart) {
            return res.status(404).send('找不到用戶的購物車');
        }

        userCart.items.push(item);
        await userCart.save(); //保存更新後的購物車數據庫
        res.sendStatus(200);
    }catch (error) {
        console.error(error);
        res.status(500).send('發生錯誤');
    }

}

//更改購物車數據
exports.changecart = async(req, res)=>{
    try{
        const CartModel = await CartModelPromise;
        const userId = req.session._id;

        const productId = req.params.id;
        const { number } = req.body;

        const updatedNumber = await CartModel.findOneAndUpdate(
            { user_id: userId, 'items._id': productId },
            { $set: { 'items.$.number': number } }, //更新數據
            { new: true } //設置為true可以在數據更新後獲取最新的文檔信息，不設置的話，則默認返回更新前的文檔
        );

        res.status(200).json(updatedNumber);

    }catch (error) {
        console.error(error);
        res.status(500).send('發生錯誤');
    }

}

//刪除購物車數據
exports.deletecart = async(req, res)=>{
    try{
        const CartModel = await CartModelPromise;
        const userId = req.session._id;
        const productId = req.params.id;
        
        const deletecart = await CartModel.findOneAndUpdate(
            { user_id: userId },
            { $pull: { items: { _id: productId } } }, // 使用 $pull 操作符删除 items 數組中的指定商品
            { new: true } // 返回更新後的購物車對象
        );

        res.status(200).json(deletecart);
        
    }catch (error) {
        console.error(error);
        res.status(500).send('發生錯誤');
    }

}