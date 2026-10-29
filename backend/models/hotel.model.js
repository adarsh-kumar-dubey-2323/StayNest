
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      minlength: [3, "Hotel name must be at least 3 characters"],
      maxlength: [100, "Hotel name cannot exceed 100 characters"],
    },

    // description: {
    //   type: String,
    //   required: [true, "Hotel description is required"],
    //   trim: true,
    // },

    hotelAddress: {
      type: String,
      required: [true, "Hotel address is required"],
      trim: true,
    },

    // city: {
    //   type: String,
    //   required: [true, "City is required"],
    //   trim: true,
    //   index: true,
    // },

    // state: {
    //   type: String,
    //   required: [true, "State is required"],
    //   trim: true,
    // },

    // country: {
    //   type: String,
    //   required: [true, "Country is required"],
    //   trim: true,
    //   default: "India",
    // },

    // pincode: {
    //   type: String,
    //   trim: true,
    //   required: [true, "Pincode is required"],
    // },

    // contactNumber: {
    //   type: String,
    //   required: [true, "Contact number is required"],
    //   trim: true,
    // },

    // email: {
    //   type: String,
    //   trim: true,
    //   lowercase: true,
    //   required: [true, "Hotel email is required"],
    //   match: [
    //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    //     "Please enter a valid email address",
    //   ],
    // },

    image: {
      type: String,
      required: [true, "Hotel image is required"],
    },

    // images: {
    //   type: [String],
    //   default: [],
    // },

    amenities: {
      type: [String],
      default: [],
      enum: [
        "Free WiFi",
        "Swimming Pool",
        "Parking",
        "Restaurant",
        "Room Service",
        "Air Conditioning",
        "Gym",
        "Spa",
        "Airport Shuttle",
        "Laundry",
        "Conference Room",
        "Pet Friendly",
      ],
    },

    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 3,
    },

    price: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price cannot be negative"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Hotel owner is required"],
      index: true,
    },

//     rooms: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Room",
//       },
//     ],

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     isApproved: {
//       type: Boolean,
//       default: false,
//     },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
