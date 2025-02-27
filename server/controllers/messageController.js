import Message from "../models/Message.js";
export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;

  if (!receiverId || !text) {
    return res.status(400).json({ message: "Receiver and text are required" });
  }

  try {
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};
export const getMessages = async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving messages", error });
  }
};
