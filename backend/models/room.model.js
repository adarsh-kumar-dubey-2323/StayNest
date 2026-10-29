
import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: [true, "Hotel is required"],
    },

    roomType: {
      type: String,
      required: [true, "Room type is required"],
      trim: true,
    },

    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: (images) => images.length > 0,
        message: "Upload at least one room image",
      },
    },

    amenities: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", hotelRoomSchema);

export default Room;
