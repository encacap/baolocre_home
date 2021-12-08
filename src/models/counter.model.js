const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        required: true,
    },
});

/**
 * @typedef Counter
 */
const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
