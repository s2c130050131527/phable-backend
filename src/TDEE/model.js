import mongoose, { Schema } from 'mongoose';

const listSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
});

export const ListColl = mongoose.model('List', listSchema);

const UserbodySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
    default: 15,
  },
  activity: {
    type: String,
    default: 'sedentary',
  },
  foodids: {
    type: [String],
    default: [],
  },
});

export const UserDetailColl = mongoose.model('userbody', UserbodySchema);
