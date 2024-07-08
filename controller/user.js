// router.js
const UserModelPromise = require('../models/UserModel');
const CartModelPromise = require('../models/CartModel');
const md5 = require('md5'); //用作加密


//用戶註冊
exports.register =  async(req, res) =>{
    try {
        const UserModel = await UserModelPromise;

        const userdata = {
            ...req.body,
            password: md5(req.body.password) // 使用 md5 加密密码
        };

        const existingUser = await UserModel.findOne(userdata);

        if (!existingUser) {
            //如用戶不存在，則增加新用戶帳密
            await UserModel.create(userdata);
            res.sendStatus(200); // Success
        } else {
            //如用戶存在，則返回錯誤
            res.status(409).send('帳號或密碼已被註冊過'); 
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('註冊失敗，請稍後再試');
    }
}



/* 以下使用 Session */
//用戶登入  
exports.login = async(req, res) =>{
    try {

        const UserModel = await UserModelPromise;

        const CartModel = await CartModelPromise;
        
        // 獲取用户名和密碼
        const { username, password } = req.body;

        // 查詢數據庫
        const data = await UserModel.findOne({
            username: username,
            password: md5(password)
        });

        // 判斷 data
        if (!data) {
            return res.status(401).send('帐号或密码错误');
        }
        //寫入SESSION
        req.session.username = data.username;
        req.session._id = data._id;

        //確認是否有此用戶的專屬購物車，如沒有則創建購物車
        const userCart = await CartModel.findOne({ user_id: req.session._id }); 
        if(!userCart){
            await CartModel.create({
                user_id: req.session._id,
                items: [] 
            });
        }
     
        res.status(200).send('登录成功');
    } catch (error) {
        console.error(error);
        res.status(500).send('登录失败，请稍后再试');
    }
}

//用戶登出
exports.logout = async(req, res) =>{
    req.session.destroy(); //清除伺服器上的會話資料
    //清除前端名為sid的cookie
    res.clearCookie('sid').send('登出成功');
}

//檢查session狀態(是否過期)
exports.ckecksession = async(req,res) =>{
    try{
        if(req.session && req.session._id){
            res.status(200)
        }else{
            res.clearCookie('sid');
        }
    }catch(error){
        res.clearCookie('sid');      
    }
}