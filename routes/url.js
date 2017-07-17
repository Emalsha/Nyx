/**
 * Created by emalsha on 5/8/17.
 */

const express = require('express');
const router = express.Router();
const request = require('request');
const debug = require('debug')('nyx:url_router');

router.post('/validate', function (req, res) {
    let url = decodeURIComponent(req.body.url);
    if (url) {
        request({url: url, method: 'HEAD'}, (err, status) => {
            if (err) {
                res.send(false);
            }

            if (status !== undefined) {

                let ctype = status.headers['content-type'].split('/')[0];
                debug(ctype);

                if (status.statusCode === 200 && ctype !== 'text') {

                    // Copy from Stackoverflow
                    function formatBytes(bytes, decimals) {
                        if (bytes === 0) return '0 Bytes';
                        let k = 1024,
                            dm = decimals || 2,
                            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                            i = Math.floor(Math.log(bytes) / Math.log(k));
                        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
                    }

                    let size = formatBytes(status.headers['content-length']);

                    res.send({val: true, size: size});

                } else {
                    res.send(false);
                }
            }
        })
    }
});

module.exports = router;