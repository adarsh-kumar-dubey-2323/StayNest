import Hotel from "../models/hotel.model.js";

// 1. Register a new hotel
export const registerHotel = async (req, res) => {
   
  try {
     const{id} = req.user || {};
    const {
      hotelName,
    //   description,
      hotelAddress,
    //   city,
    //   state,
    //   country,
    //   pincode,
    //   contactNumber,
    //   email,
    //   image,
    //   images,
      amenities,
      rating,
      price,
    } = req.body;
   
    // Validate required fields
    if (
       !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required hotel details.",
      });
    }

    const image = req.file.filename;

    // Save hotel into model
    const newHotel = new Hotel({
        hotelName,
        hotelAddress,
        rating,
        amenities,
        price,
        image,
        owner:id,
    });
    await newHotel.save()

    // Get owner from authenticated user
    // const ownerId = req.user?._id;

    // if (!ownerId) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Please log in to register a hotel.",
    //   });
    // }

    // const hotel = await Hotel.create({
    //   hotelName,
    // //   description,
    //   hotelAddress,
    // //   city,
    // //   state,
    // //   country,
    // //   pincode,
    // //   contactNumber,
    // //   email,
    //   image,
    // //   images,
    //   amenities,
    // //   starRating,
    //   price,
    //   owner: ownerId,
    // });

    return res.status(201).json({
      success: true,
      message: "Hotel registered successfully."
    });
  } catch (error) {
    console.error("Register hotel error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register hotel.",
    });
  }
};


// 2. Get all active and approved hotels
// export const getAllHotels = async (req, res) => {
//   try {
//     const hotels = await Hotel.find({
//       isActive: true,
//       isApproved: true,
//     })
//       .populate("owner", "name email")
//       .populate("rooms")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: hotels.length,
//       hotels,
//     });
//   } catch (error) {
//     console.error("Get all hotels error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch hotels.",
//     });
//   }
// };


// 3. Get hotels belonging to the logged-in owner
export const getOwnerHotels = async (req, res) => {
  try {
    const ownerId = req.user.id;

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


// Get All Hotels
export const getAllHotels = async (req,res) => {
      try{
        const hotels = await Hotel.find().populate("owner", "name email");
        return res.status(200).json({hotels, success: true});
      }
      catch(error){
         console.error("Get owner hotels error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your hotels.",
    });
      }
}



// 4. Get a single hotel by ID
// export const getHotelById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid hotel ID.",
//       });
//     }

//     const hotel = await Hotel.findOne({
//       _id: id,
//       isActive: true,
//       isApproved: true,
//     })
//       .populate("owner", "name email")
//       .populate("rooms");

//     if (!hotel) {
//       return res.status(404).json({
//         success: false,
//         message: "Hotel not found.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       hotel,
//     });
//   } catch (error) {
//     console.error("Get hotel error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch hotel details.",
//     });
//   }
// };


// 5. Update hotel details
// export const updateHotel = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ownerId = req.user?._id;

//     if (!ownerId) {
//       return res.status(401).json({
//         success: false,
//         message: "Please log in first.",
//       });
//     }

//     if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid hotel ID.",
//       });
//     }

//     const allowedFields = [
//       "name",
//       "description",
//       "address",
//       "city",
//       "state",
//       "country",
//       "pincode",
//       "contactNumber",
//       "email",
//       "image",
//       "images",
//       "amenities",
//       "starRating",
//       "pricePerNight",
//       "isActive",
//     ];

//     const updates = {};

//     for (const field of allowedFields) {
//       if (req.body[field] !== undefined) {
//         updates[field] = req.body[field];
//       }
//     }

//     const hotel = await Hotel.findOneAndUpdate(
//       {
//         _id: id,
//         owner: ownerId,
//       },
//       { $set: updates },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!hotel) {
//       return res.status(404).json({
//         success: false,
//         message: "Hotel not found or you are not authorized to update it.",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Hotel updated successfully.",
//       hotel,
//     });
//   } catch (error) {
//     console.error("Update hotel error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update hotel.",
//     });
//   }
// };


// 6. Delete a hotel
export const deleteHotel = async (req, res) => {
    const { hotelId } = req.params;
  try {
    
    // const ownerId = req.user?._id;

    // if (!ownerId) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Please log in first.",
    //   });
    // }

    // if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid hotel ID.",
    //   });
    // }

    // const hotel = await Hotel.findOneAndDelete({
    //   _id: id,
    //   owner: ownerId,
    // });

    // if (!hotel) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Hotel not found or you are not authorized to delete it.",
    //   });
    // }

    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    if(!deletedHotel){
        return res.status(404).json({message:"Hotel not Found"});
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
