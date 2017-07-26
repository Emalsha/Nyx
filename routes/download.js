/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const debug = require('debug')('nyx:router');

const ar = require('../module/ariac_runner');
let Download = require('../model/Download');
let Time = require('../model/Time');
let Bw_list = require('../model/Bw_list');

router.post('/request', function (req, res) {

    Download.find({$and: [{size_in_byte: req.body.size_bytes}, {admin_decision: true}, {state:{$ne:'deleted'}}]}, function (err, downloads) {
        if (err) {
            debug(err);
        }

        if (downloads.length > 0) {
            let dlinks = [];
            for (let i = 0; i < downloads.length; i++) {
                let ob = {
                    link: downloads[i].link,
                    availability: downloads[i].availability,
                    owner: downloads[i].request_user,
                    state: downloads[i].state,
                    tags: downloads[i].tags,
                    description: downloads[i].description,

                };
                dlinks.push(ob);
            }
            res.render('similar_downloads', {
                title: 'NYX | Download Suggestions',
                user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
                downloads: dlinks
            });
        } else {
            saveRequest();
        }
    });

    function saveRequest() {
        let tags_array;
        let availability;
        let description;
        let size;
        let file_path;
        let state = 'pending';
        let admin_decision;
        let admin_decision_date;
        let reject_note;
        let admin = '';
        let admin_note = '';
        let size_in_byte;

        if (req.body.tags) {
            let st = req.body.tags;
            tags_array = st.split(',');
        }

        if (req.body.availability === 'true') {
            availability = 'public';
        } else {
            availability = 'private';
        }

        file_path = __dirname + '/../tempDownload';

        if (req.body.description) {
        }
        description = req.body.description;

        if (req.body.size) {
            size = req.body.size;
            size_in_byte = req.body.size_bytes;
        }


        //split and get the domain
        let dom = req.body.link;
        let dom_array = dom.split('/');
        let req_domain = dom_array[2];
        Bw_list.findOne({domain: req_domain})
            .then((doc) => {

                // console.log(doc);
                if (doc === null) {
                    console.log("no result");

                } else if (doc['list_type'] === 'white') {
                    state = 'approved';
                    admin_decision = true;
                    admin_decision_date = new Date();
                    admin = 'auto-approve';
                    admin_note = 'White listed domain';
                    Bw_list.findOneAndUpdate({domain: req_domain}, {$inc: {hits: 1}}, function (err, bw) {
                        if (err) {
                            debug('Error on update BW list');
                        }
                    });
                } else if (doc['list_type'] === 'black') {
                    state = 'rejected';
                    admin_decision = false;
                    admin_decision_date = new Date();
                    admin = 'auto-reject';
                    admin_note = 'Black listed domain';
                    reject_note = 'This is a black list domain';
                    Bw_list.findOneAndUpdate({domain: req_domain}, {$inc: {hits: 1}}, function (err, bw) {
                        if (err) {
                            debug('Error on update BW list');
                        }
                    });
                }

                let newDownload = new Download({
                    link: req.body.link,
                    request_date: new Date(),
                    tags: tags_array,
                    availability: availability,
                    request_user: req.user.username,
                    state: state,
                    description: description,
                    size: size,
                    file_path: file_path,
                    admin_decision: admin_decision,
                    admin_decision_date: admin_decision_date,
                    reject_note: reject_note,
                    admin: admin,
                    admin_note: admin_note,
                    size_in_byte: size_in_byte,
                });

                newDownload.save(function (err) {
                    if (err) {
                        debug(err)
                    }
                    req.flash('success', 'New download request added.');
                    res.redirect('/users/dashboard');
                })


                // console.log(newDownload);
                // console.log(state);

            });
    }


});

// Approve download request handler
router.post('/approve', function (req, res) {

    Download.findById(req.body.download_id, function (err, download) {
        if (err) {
            debug(err);
        }

        if (req.body.new_tags) {
            let st = req.body.new_tags;
            let tags_array = st.split(',');
            download.tags = download.tags.concat(tags_array);
        }

        if (req.body.priority) {
            download.priority = req.body.priority;
        }

        if (req.body.admin_note) {
            download.admin_note = req.body.admin_note;
        }

        download.admin = req.user.username;
        download.admin_decision = true;
        download.admin_decision_date = new Date();
        download.state = 'approved';

        let dom = download.link;
        let dom_array = dom.split('/');
        let req_domain = dom_array[2];

        Bw_list.findOne({domain: req_domain})
            .then((doc) => {

                if (doc === null) {
                    console.log("no result");
                    let newBw_list = new Bw_list({
                        domain: req_domain,
                        hits: 1,
                    });

                    newBw_list.save(function (err) {
                        if (err) {
                            debug(err)
                        }
                        debug("New white-listed domain added");
                    });

                } else if (doc.hits == 4) {
                    doc.hits = doc.hits + 1;
                    doc.list_type = 'white';
                    doc.save(function (err) {
                        if (err) {
                            debug(err);
                        }
                    });

                } else {
                    Bw_list.findOneAndUpdate({domain: req_domain}, {$inc: {hits: 1}}, function (err, bw) {
                        if (err) {
                            debug('Error on update BW list');
                        }
                    });
                }
            });


        download.save(function (err) {
            if (err) {
                debug(err);
            }

            Time.findOne({})
                .sort({'edit_date': -1})
                .select({'_id': 0, 'start': 1, 'end': 1,})
                .then(function (time) {
                    let sm = 0, em = 0;
                    console.log(time);
                    let t = new Date();
                    let nowTime = t.getHours();
                    if (nowTime) { //TODO : time select proooo
                        ar.start_ariac();
                    }

                    res.redirect(req.header('Referer'));
                });

        });

    })

});

// Reject download request handler
router.post('/reject', function (req, res) {

    Download.findById(req.body.download_id, function (err, download) {
        if (err) {
            debug(err);
        }

        if (req.body.reason) {
            download.reject_note = req.body.reason;
        }

        if (req.body.admin_note) {
            download.admin_note = req.body.admin_note;
        }

        download.admin = req.user.username;
        download.admin_decision = false;
        download.admin_decision_date = new Date();
        download.state = 'rejected';

        let dom = download.link;
        let dom_array = dom.split('/');
        let req_domain = dom_array[2];
        Bw_list.findOne({domain: req_domain})
            .then((doc) => {

                if (doc === null) {
                    let newBw_list = new Bw_list({
                        domain: req_domain,
                        hits: -1,
                    });

                    newBw_list.save(function (err) {
                        if (err) {
                            debug(err)
                        }
                        debug("New Black-listed domain added");
                    })
                } else if (doc.hits == -4) {
                    doc.hits = doc.hits - 1;
                    doc.list_type = 'black';
                    doc.save(function (err) {
                        if (err) {
                            debug(err);
                        }
                    });

                } else {
                    doc.hits = doc.hits - 1;
                    doc.save(function (err) {
                        if (err) {
                            debug(err);
                        }
                    });
                }
            });

        download.save(function (err) {
            if (err) {
                debug(err);
            }

            res.redirect(req.header('Referer'));
        });

    })

});

module.exports = router;
