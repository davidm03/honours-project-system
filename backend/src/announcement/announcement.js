const Announcement = require('./announcement.model');
const projectDAL = require('../project/project');

exports.postAnnouncement = function (message_body, module_leaderID) {
    return new Promise((resolve, reject) => {
        var newAnnouncement = new Announcement({
            module_leaderID,
            date: new Date() / 1000,
            message_body
        });
        newAnnouncement.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

exports.getLatestAnnouncement = function () {
    return new Promise((resolve, reject) => {
        Announcement.find({ }, function (err, announcements) {
            if (err) {
                console.log('Error: Announcements not found.');
                reject(err);
            }
            else {
                var latestAnnouncement = announcements.pop();
                resolve(latestAnnouncement);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};
