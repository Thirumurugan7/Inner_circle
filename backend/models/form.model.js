// src/models/Form.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const FormSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "" },
  twitterId: { type: String, default: "" },
  github: { type: String, default: "" },
  website: { type: String, default: "" },
  telegram: { type: String, default: "" },
});

const Form = mongoose.model("Form", FormSchema);
export default Form;
