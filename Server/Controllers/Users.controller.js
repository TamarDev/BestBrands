
import Users from '../Models/Users.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({}).select('-password')
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getUsersById = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await Users.findById(id).select('-password')
        if (!users) return res.status(404).json({ message: "User not found" })
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const UpdateUsers = async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user && req.user.userId && req.user.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You can only update your own profile" });
        }

        const allowedFields = ['firstName', 'lastName', 'email', 'address', 'city', 'password'];

        // רק מנהל רשאי לשנות תפקיד; אצל משתמש רגיל השדה מסונן בשקט
        if (req.user?.role === 'admin') {
            allowedFields.push('role');
        }

        const updates = {};

        Object.keys(req.body || {}).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (!Object.keys(updates).length) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        if (updates.role && !['user', 'admin'].includes(updates.role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const update = await Users.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!update) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "User updated successfully", user: update });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ message: "Email already exists" });
        }

        return res.status(500).json({ error: err.message });
    }
};

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