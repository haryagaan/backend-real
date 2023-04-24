const { Schema, Types , model } = require("mongoose");

const jobSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

});

exports.Job = model("jobs", jobSchema);
