const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({
    id: { type: String, required: true },
    members: [
        {
            memberID: { type: String, required: true },
            position: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("Teams", teamsSchema);
