// 導入 mongoose
const mongoose = require('mongoose');
// 導入數據庫連接模塊
const db = require('../db/db.js');

//由于 mongoose.model 方法是異步的，建議使用 Promise 或回調函數确保在模型準備好之後再導出

const UserModelPromise = new Promise((resolve, reject) => {
    db(()=>{
        //創建文檔的結構對象
        //Schema 是一種描述數據結構的方式，用來設置集合中文檔的屬性以及屬性值的類型
        const UserSchema = new mongoose.Schema({
            username: String,
            password: String
        });
        
        //創建模型對象  對文檔操作的封裝對象  此users為自訂的集合名
        //model包裝schema，使集合能夠增刪查改
        const UserModel = mongoose.model('users',UserSchema); 

        // 將 UserModel 暴露出去
        resolve(UserModel);
    });

});

//暴露模型對象
module.exports = UserModelPromise;