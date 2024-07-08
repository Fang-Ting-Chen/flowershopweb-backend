//以下連接mongodb

module.exports = function (success,error){
    //判斷 error 為其設置默認值
    if(typeof error !== 'function'){
        error = ()=>{
            console.log('連接失敗');
        }
    }

    //1、安裝 mongoose
    //2、導入 mongoose
    const mongoose = require('mongoose');

    const dotenv = require('dotenv');
    dotenv.config();

    const DB_URL = process.env.atlas_URL;

    //設置 strictQuery 為 true (可設可不設)
    //strictQuery選項設為true來強制執行嚴格的查詢檢查
    mongoose.set('strictQuery',true);

    //3、連接 mongodb 服務                          
    mongoose.connect(DB_URL)
      .then(() => {
        console.log('Connected to MongoDB');
        // 在連接成功時執行 success 回調
        success();
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        // 在連接失敗時執行 error 回調
        error();
      });


    //設置連接關閉的回調
    mongoose.connection.once('close',()=>{
        console.log('連接關閉');
    });

}