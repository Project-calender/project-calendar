const express = require('express')

const router = express.Router();

router.get('/api', (req, res) => {
    res.json('Hello post api')
})

module.exports = router;