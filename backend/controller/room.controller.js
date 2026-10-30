
import Room from "../models/room.model.js";
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


// Add new room
export const addRoom = async (req, res) => {
  try {
    const {
      hotel,
      roomType,
      pricePerNight,
      description,
      isAvailable,
      amenities,
    } = req.body;

    const ownerId = req.user?.id || req.user?._id;

    // Validate required fields
    if (
      !hotel ||
      !roomType ||
      !pricePerNight ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required room details.",
      });
    }

    const price = Number(pricePerNight);

    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid room price.",
      });
    }

    // Validate images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one room image.",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 images are allowed.",
      });
    }

    // Check hotel ownership
    const selectedHotel = await Hotel.findOne({
      _id: hotel,
      owner: ownerId,
    });

    if (!selectedHotel) {
      return res.status(403).json({
        success: false,
        message: "Hotel not found or you do not own this hotel.",
      });
    }

    // Parse amenities
    let parsedAmenities = [];

    try {
      parsedAmenities = amenities
        ? JSON.parse(amenities)
        : [];
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid amenities format.",
      });
    }

    if (
      !Array.isArray(parsedAmenities) ||
      !parsedAmenities.every((item) => typeof item === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Amenities must be an array of strings.",
      });
    }

    // Upload all room images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(
          file.buffer,
          "staynest/rooms"
        )
      )
    );

    const imageUrls = uploadedImages.map(
      (image) => image.secure_url
    );

    // Save room and Cloudinary image URLs in MongoDB
    const room = await Room.create({
      hotel: selectedHotel._id,
      roomType,
      pricePerNight: price,
      description: description.trim(),
      isAvailable: isAvailable !== "false",
      amenities: parsedAmenities,
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Room added successfully.",
      room,
    });

  } catch (error) {
    console.error("Add room error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add room.",
    });
  }
};


// Get rooms belonging to logged-in owner
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.user?._id;

    const rooms = await Room.find().populate({
      path: "hotel",
      match: { owner: ownerId },
      select: "hotelName hotelAddress rating amenities owner",
    });

    const ownerRooms = rooms.filter(
      (room) => room.hotel !== null
    );

    return res.status(200).json({
      success: true,
      rooms: ownerRooms,
    });

  } catch (error) {
    console.error("Get owner rooms error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your rooms.",
    });
  }
};


// Get all rooms for users
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate({
        path: "hotel",
        select: "hotelName hotelAddress amenities rating owner",
        populate: {
          path: "owner",
          select: "name email",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      rooms,
    });

  } catch (error) {
    console.error("Get all rooms error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms.",
    });
  }
};


// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const ownerId = req.user?.id || req.user?._id;

    const deletedRoom = await Room.findById(roomId).populate({
      path: "hotel",
      select: "owner",
    });

    if (!deletedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    if (
      !deletedRoom.hotel ||
      deletedRoom.hotel.owner.toString() !== ownerId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this room.",
      });
    }

    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully.",
    });

  } catch (error) {
    console.error("Delete room error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete room.",
    });
  }
};
