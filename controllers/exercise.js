const User = require('../models/user');
const Exercise = require('../models/exercise');

const moment = require('moment');

exports.add_exercise = function (req, res) {
    let {userId, description, duration, date} = req.body;

    User.findOne({_id: userId})
        .then(user => {
            if (!user) {
                res.status(500).send('User doesn\'t exists');
                throw new Error('User doesn\'t exists');
            }
            date = date ? date : Date.now();

            return Exercise.create({
                description,
                duration,
                date: moment(date).format('YYYY-MM-DD'),
                userId,
                exerciseId: Math.random().toString(16).slice(2)
            }).then(exercise => res.status(200).send({
                username: user.username,
                userId: user._id,
                description,
                duration,
                exerciseId: exercise.exerciseId,
                date: moment(exercise.date).format('YYYY-MM-DD')
            }))
        })
        .catch(err => {
            console.log(err);
            res.status(500);
            if (err.kind === 'ObjectId') res.send('User doesn\'t exists');
            else res.status(500).send(err.message);
        });
};


exports.get_logs = function (req, res) {
    let {from, to, limit} = req.query;

    from = moment(from, 'YYYY-MM-DD').isValid() ? moment(from, 'YYYY-MM-DD') : 0;
    to = moment(to, 'YYYY-MM-DD').isValid() ? moment(to, 'YYYY-MM-DD') : moment().add(1000000000000);

    const userId = req.params._id;

    User.findOne({_id: userId}).then(user => {
        if (!user) {
            res.status(500).send('User doesn\'t exists');
            throw new Error('User doesn\'t exists');
        }

        Exercise.find({userId})
            .where('date')
            .gte(from).lte(to)
            .limit(+limit).exec()
            .then(log => res.status(200).send({
                userId, username: user.username,
                count: log.length,
                log: log.map(ex => ({
                    description: ex.description,
                    duration: ex.duration,
                    date: moment(ex).format('YYYY-MM-DD')
                }))
            }))
            .catch(err => {
                console.log(err);
                if (err.kind === 'ObjectId') res.send('User doesn\'t exists');
                else res.status(500).send(err.message);
            });
    }).catch(err => {
        console.log(err);
        if (err.kind === 'ObjectId') res.send('User doesn\'t exists');
        else res.status(500).send(err.message);
    });
};