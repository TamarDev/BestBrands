import api from "./Axios";
const route="/Message";


// Get all messages.
export const getAllMessages= async () => {
    const response = await api.get(`${route}/`);
    return response.data;
};

// Add a message (user).
export const addMessage = async (messageData) => {
    const response = await api.post(`${route}/Add`, {
        subject: messageData.subject,
        body: messageData.body
    });
    return response.data;
};

    // Delete a message (user).
export const deleteMessage = async (messageId) => {

    const response = await api.delete(`${route}/Delete/${messageId}` );
    return response.data;
};

export const updateMessageStatus = async (messageId, status) => {
    const response = await api.put(`${route}/UpdateStatus/${messageId}`,{status});
    return response.data;
};

export const markMessageAsRead = async (messageId) => {
    const response = await api.put( `${route}/MarkAsRead/${messageId}`);
    return response.data;
};