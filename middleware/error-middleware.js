
const { discordMessage, slackMessage } = require("../utils.js");
const dbMethods = require("../data/db-model.js");


exports.handleError = async (err, req, res) => {
    let errObj = { endpoint: req.endpoint, user_id: req.user ? req.user.id : null}; 
    let status = ''; let responseObj = '';
    let defaultReached = false;
    let sendError = true;

    switch (err) {
        //#region auth router
        case `/auth post /register 400`: status = 400; responseObj = { message: 'email is required' }; break;
        case `/auth post /register 400-2`: status = 400; responseObj = { message: 'cognito_username is required' }; break;
        case `/auth post /register 400-3`: status = 400; responseObj = { message: 'Invalid register_password code' }; break;
        case `cognito-middleware.js 400`: status = 400; responseObj = { message: 'No token provided', forceLogout: true }; break;
        //#endregion
        //#region users router
        case `/users get /:id 400`: status = 400; responseObj = { message: `Param id must be a number. Received: ${req.params.id}` }; break;
        case `/users get /:id 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        case `/users get /user 404`: status = 404; responseObj = { message: `User with id ${req.user.id} not found` }; break;
        case `/users put /user 400`: status = 400; responseObj = { message: 'Current password is required' }; break;
        case `/users put /user 403`: status = 403; responseObj = { message: 'Invalid credentials' }; break;
        case `/users put /user 409`: status = 409; responseObj = { message: `Email '${req.body.email}' is already in use` }; break;
        case `/users delete /user 400`: status = 400; responseObj = { message: 'Password is required to delete user' }; break;
        case `/users delete /user 403`: status = 403; responseObj = { message: 'Invalid credentials' }; break;
        //#endregion
        //#region error router
        case `/errors post /getByQuery 400`: status = 400; responseObj = { message: 'Protected endpoint, password is required' }; break;
        case `/errors post /getByQuery 400-2`: status = 400; responseObj = { message: 'sortType can only be set to null, asc, or desc' }; break;
        case `/errors post /getByQuery 400-3`: status = 400; responseObj = { message: 'userID must be null or a number' }; break;
        case `/errors post /getByQuery 403`: status = 403; responseObj = { message: 'Invalid Password, access denied' }; break;
        case `/errors post /getByQuery 404`: status = 404; responseObj = { message: 'No errors found' }; break;
        case `/errors delete /deleteByQuery 400`: status = 400; responseObj = { message: 'Protected endpoint, password is required' }; break;
        case `/errors delete /deleteByQuery 400-2`: status = 400; responseObj = { message: 'userID must be null or a number' }; break;
        case `/errors delete /deleteByQuery 400-3`: status = 400; responseObj = { message: 'deleteAll must be true if trying to delete everything. Otherwise, provide query vars.' }; break;
        case `/errors delete /deleteByQuery 403`: status = 403; responseObj = { message: 'Invalid Password, access denied' }; break;
        case `/errors delete /deleteByQuery 404`: status = 404; responseObj = { message: 'No errors found' }; break;
        //#endregion
        //#region functions
        case `utils.js validateDate 400`: status = 400; responseObj = { message: 'Date format: mm/dd/yyyy' }; break;
        case `utils.js validateDate 400-2`: status = 400; responseObj = { message: 'Month must be between 1 and 12' }; break;
        case `utils.js validateDate 400-3`: status = 400; responseObj = { message: 'Date must be between 1 and 31' }; break;
        //#endregion
        default: defaultReached = true; status = 500; responseObj = { message: `${errObj.endpoint} 500 error`, error: err }; 
            console.log(`${responseObj.message}, error: ${err}`);
    }

    if (defaultReached){ errObj.errorID = responseObj.message; errObj.errorMessage = err; }
    else{ errObj.errorID = err; errObj.errorMessage = responseObj.message; }

    const errorLogged = await dbMethods.add('errors', errObj);

    if (errorLogged){ 
        let errorText = ''
        if (status === 500){ errorText = `Error 500 at ${errObj.endpoint}.\nMessage: ${errObj.errorMessage}`; }
        else { errorText = `Error ${errObj.errorID} at ${errObj.endpoint}.\nMessage: ${errObj.errorMessage}`; }
        console.error(errorText);

        res.status(status).json(responseObj);

        if (sendError){
            slackMessage('Error', errorText);
            discordMessage('Error', errorText);
        }
    }
    else{
        console.error(`Something broke inside handleErrors. Not good, investigate immediately! errorLogged: ${errorLogged}`);
        res.status(status).json(responseObj);
    }
}