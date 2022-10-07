// Handles all the routes for authenticated user wallet

const express = require("express");

const router = express.Router();


// Views
const { getWallet, fundWallet, walletTransfer, walletWithdraw } = require('../views/walletView');

// Middlewares
const { ensureAuthenticated } = require('../middlewares/authentionMiddleware');
const { validateFundOrWithdrawWalletData, validateWalletTransferData } = require('../middlewares/validationMiddleware');


router.use(ensureAuthenticated);

router.post('/fund', validateFundOrWithdrawWalletData);
router.post('/transfer', validateWalletTransferData);
router.post('/withdraw', validateFundOrWithdrawWalletData);



router.route('/').get(getWallet) // fund user account wallet
router.route('/fund').post(fundWallet) // fund user account wallet
router.route('/transfer').post(walletTransfer) // transfer from authenticated user wallet to another wallet
router.route('/withdraw').post(walletWithdraw) // withdraw from wallet


module.exports = router;
