//Import dependencies
var express=require('express');
var path=require('path');
var myApp=express();
myApp.use(express.urlencoded({extended:true}));
const {check,validationResult}=require('express-validator');

//Set path to public and view folders
myApp.set('views', path.join(__dirname,'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine','ejs');

//Set up home pages
myApp.get('/', function(req,res)
{
    res.render('bubbleTeaShop');
})


//-------Phone Regular Expression Check-----
var phoneRegex=/^[0-9]{10}$/;

function checkRegex(userInput,regex)
{
    if (regex.test(userInput)){
        return true;
    }
    else{
        return false;
    }
}

function customerPhoneValidation(value)
{
    if(!checkRegex(value,phoneRegex))
    {
        throw new Error('Please enter a valid phone number: 1231231234');
    }
    return true;
}

//-------Email Regular Expression Check-----
var emailRegex=/^\w+@[a-zA-Z_0-9]+\.[a-zA-Z]{2,3}$/;

function customerEmailValidation(value)
{
    if(!checkRegex(value,emailRegex))
    {
        throw new Error('Please enter a valid email address: test@test.com');
    }
    return true;
}

//---check if name,address,city, province is empty? validate the format of phone and email-----
myApp.post('/', [
    check('name', "Name is required!").notEmpty(),
    check('address', "Address is required!").notEmpty(),
    check('city',"City is Required!").notEmpty(),
    check('province', "Please select a province!").notEmpty(),
    check('phone','').custom(customerPhoneValidation),
    check('email','').custom(customerEmailValidation),
], function(req,res){

    var brownSugar=req.body.brownSugar;
    var taro=req.body.taro;
    var roasted=req.body.roasted;

    var subTotal = 0;
    if(brownSugar ==='yes') {subTotal += 7.65;}
    if(taro ==='yes') {subTotal += 6.50;}
    if(roasted ==='yes') {subTotal += 7.50;}

    const errors = validationResult(req);
    var errorsArray = errors.array();

//----Validate if the subTotal is larger than $10, if not, add the error msg to array------
    if (subTotal < 10) {
        errorsArray = errorsArray.concat([{'msg': 'The minimum purchases should be $10'}])
    }

    if(errorsArray.length > 0) //----some errors exist---
    {
        res.render('bubbleTeaShop',{
            errors: errorsArray
        })
    }
    else
    {
        var name=req.body.name;
        var address=req.body.address;
        var city=req.body.city;
        var province=req.body.province;
        var phone=req.body.phone;
        var email=req.body.email;

        var tax=0;
        if(province === "ON") {tax = subTotal * 0.13;}
        if(province === "QC") {tax = subTotal * 0.14975;}
        if(province === "NS") {tax = subTotal * 0.15;}
        if(province === "NB") {tax = subTotal * 0.15;}
        if(province === "MB") {tax = subTotal * 0.12;}
        if(province === "BC") {tax = subTotal * 0.12;}
        if(province === "PE") {tax = subTotal * 0.15;}
        if(province === "SK") {tax = subTotal * 0.11;}
        if(province === "AB") {tax = subTotal * 0.05;}
        if(province === "NL") {tax = subTotal * 0.15;}

        var total = subTotal + tax;

        var pageData={
            name:name,
            address:address,
            city:city,
            province:province,
            phone:phone,
            email:email,
            subTotal:subTotal,
            tax:tax,
            total:total
        };
        res.render('bubbleTeaShop',pageData);
    }
});

//5. start the server and listen to port
myApp.listen(8000);


//6. confirmation output
console.log('Run successfully at port http://localhost:8000');