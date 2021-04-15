/* 
    David McDowall - Honours Project
    Announcement.js class for performing Announcement functionality
*/

// define announcement model
const Announcement = require('./announcement.model');

/*  Function for posting a new announement
    Params: announcement message, user ID of module leader 
*/
exports.postAnnouncement = function (message_body, module_leaderID) {
    return new Promise((resolve, reject) => {
        // Attempt to create a new Announcement and save within DB
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

/* Function for returning the latest announcement */
exports.getLatestAnnouncement = function () {
    return new Promise((resolve, reject) => {
        // Get all announcements from DB
        Announcement.find({}, function (err, announcements) {
            if (err) {
                console.log('Error: Announcements not found.');
                reject(err);
            }
            else {
                // Get and return the last announcement element in the collection
                var latestAnnouncement = announcements.pop();
                resolve(latestAnnouncement);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};
