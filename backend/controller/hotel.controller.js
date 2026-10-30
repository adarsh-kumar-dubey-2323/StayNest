
import Hotel from "../models/hotel.model.js";
import cloudinary from "../config/cloudinary.js";

// Upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// Register a new hotel
export const registerHotel = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.user?._id;

    const {
      hotelName,
      hotelAddress,
      amenities,
      rating,
      price,
    } = req.body;

    // Validate required fields
    if (!hotelName || !hotelAddress || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Hotel name, address and image are required.",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "staynest/hotels"
    );

    // Handle amenities
    let parsedAmenities = amenities || [];

    if (typeof parsedAmenities === "string") {
      parsedAmenities = parsedAmenities.startsWith("[")
        ? JSON.parse(parsedAmenities)
        : [parsedAmenities];
    }

    if (!Array.isArray(parsedAmenities)) {
      parsedAmenities = [parsedAmenities];
    }

    // Save Cloudinary URL in MongoDB
    const newHotel = await Hotel.create({
      hotelName,
      hotelAddress,
      amenities: parsedAmenities,
      rating,
      price,
      image: uploadedImage.secure_url,
      owner: ownerId,
    });

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully.",
      hotel: newHotel,
    });

  } catch (error) {
    console.error("Register hotel error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register hotel.",
    });
  }
};


// Get hotels belonging to logged-in owner
export const getOwnerHotels = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.user?._id;

    const hotels = await Hotel.find({ owner: ownerId })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: hotels.length,
      hotels,
    });

  } catch (error) {
    console.error("Get owner hotels error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your hotels.",
    });
  }
};


// Get all hotels
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      hotels,
    });

  } catch (error) {
    console.error("Get all hotels error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotels.",
    });
  }
};


// Delete a hotel
export const deleteHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const ownerId = req.user?.id || req.user?._id;

    const deletedHotel = await Hotel.findOneAndDelete({
      _id: hotelId,
      owner: ownerId,
    });

    if (!deletedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found or you are not authorized.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hotel deleted successfully.",
    });

  } catch (error) {
    console.error("Delete hotel error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete hotel.",
    });
  }
};
