import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";


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

    // Validate required fields
    if (
      !hotel ||
      !roomType ||
      pricePerNight === undefined ||
      pricePerNight === "" ||
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one room image.",
      });
    }

    // Ensure this hotel belongs to the logged-in owner
    const ownerId = req.user.id || req.user._id;

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

    let parsedAmenities = [];

    try {
      parsedAmenities = amenities ? JSON.parse(amenities) : [];
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

    const room = await Room.create({
      hotel: selectedHotel._id,
      roomType,
      pricePerNight: price,
      description: description.trim(),
      isAvailable: isAvailable !== "false",
      amenities: parsedAmenities,
      images: req.files.map((file) => file.filename),
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


//  Get all rooms for a specific Owner

export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;

    const rooms = await Room.find().populate({
      path: "hotel",
      match: { owner: ownerId },
      select: "hotelName hotelAddress rating amenities owner",
    });

    // Populate ke baad non-owned hotels null ho sakte hain
    const ownerRooms = rooms.filter((room) => room.hotel !== null);

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



//  Get all rooms for users
 export const getAllRooms = async (req,res)=>{
    try{
        const rooms = await Room.find()
        .populate({
            path:"hotel",
            select: "hotelName hotelAddress amenities rating owner",
            populate:{
                path: "owner",
                select: "name email",
            },
        })
        .exec();
        res.json({success: true, rooms});
    }catch(error){
        return res.status(500).json({message:"Internal Server Error"});
    }
 };

// delete a room
export const deleteRoom = async(req,res)=>{
    try{
        const { roomId } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(roomId);
        if(!deletedRoom){
            return res.status(404).json({message:"Room not found", success:false});
        }
        res.json({success:true, message:"Room deleted successfully"});
    }catch(error){
          res.status(500).json({message:"Internal Server Error"})
    }
};