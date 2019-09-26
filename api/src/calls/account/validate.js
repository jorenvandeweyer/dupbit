const express = require('express');
const validate = require('../../utils/validateUser');

module.exports = express.Router()
    .post('/', async (req, res) => {
        const data = req.body;

        const response = {};

        if (data.username)
            response.username = validate.getErrorMessage(await validate.username(data.username));

        if (data.email)
            response.email = validate.getErrorMessage(await validate.email(data.email));

        if (data.password)
            response.password = validate.getErrorMessage(await validate.password(data.password));

        if (data.confirmpassword) 
            response.confirmpassword = validate.getErrorMessage(await validate.password(data.password, data.confirmpassword));
        
        res.jsons(response);
    });

