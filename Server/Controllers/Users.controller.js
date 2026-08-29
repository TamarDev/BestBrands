
import Users from '../Models/Users.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({})
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getUsersById = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await Users.findById(id)
        if (!users) return res.status(404).json({ message: "User not found" })
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const UpdateUsers = async (req, res) => {
    try {
        let update = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!update) return res.status(404).json({ message: "User not found" })
        return res.status(200).json({ message: "User updated successfully", user: update })
    } catch (err) {
        res.status(500).json({ error: err.message })
    };
}

export const deleteUsers = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await Users.findByIdAndDelete(id)
        if (!deleted) return res.status(404).json({ message: "User not found" })
        res.status(200).json({ message: "User deleted successfully", user: deleted })
    } catch (err) {
        res.status(500).json({ error: err.message })
    };
}