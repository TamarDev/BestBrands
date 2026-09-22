import Message from "../Models/Message.js";

export const getAllMessages=async (req, res)=>{
    try{
         const messages = await Message.find({})
         .populate("userId", "firstName lastName email")
         .sort({ createdAt: -1 })
         .lean();
         res.status(200).json(messages)
    }
    catch(err){
        res.status(500).json({error: err.message})
        }
}

export const addMessage = async (req, res) => {
    try {
        const { subject, body } = req.body;

        // userId comes from the JWT
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User ID not found"
            });
        }

        if (!subject || !subject.trim()) {
            return res.status(400).json({
                message: "Message subject is required"
            });
        }

        if (!body || !body.trim()) {
            return res.status(400).json({
                message: "Message body is required"
            });
        }

        const newMessage = new Message({
            userId,
            subject: subject.trim(),
            body: body.trim()
        });

        await newMessage.save();

        res.status(201).json({
            message: "Message added successfully",
            data: newMessage
        });

    } catch (err) {
        console.error("Add message error:", err);

        res.status(500).json({
            error: err.message
        });
    }
};
export const deleteMessage=async(req, res)=>
{
    try
    {
        const deleted = await Message.findByIdAndDelete(req.params.id)
        
        if(!deleted)
            return res.status(404).json({message: "Message not found"})
            
        res.status(200).json({message: "Message deleted successfully", data: deleted})
    }
    catch(err)
    {
        res.status(500).json({error: err.message})
    };
}

export const markMessageAsRead = async (req, res) => {
    
  try {
        
        const message = await Message.findByIdAndUpdate(req.params.id,{isRead: true},{new: true});
                
        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }         
                
            res.status(200).json({
            message: "Message marked as read",
            data: message
        });

    }       
                
    catch (err) {
        console.error("Mark message as read error:", err);

        res.status(500).json({
            error: err.message
        });
    }
};      
            
export const updateMessageStatus = async (req, res) => {
    try {
    const { status } = req.body;

    const allowedStatuses = [
        "new",
        "inProgress",
        "answered",
        "closed"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid message status"
        });
    }

    const message = await Message.findByIdAndUpdate(req.params.id,{status},{new: true});

    if (!message) {  
          return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message status updated successfully",
            data: message
        });

    } catch (err) {
        console.error("Update message status error:", err);

        res.status(500).json({
            error: err.message
        });
    }
};

     
  