const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if(!username || !room){
        return {
            error:'Username and room are required!'
        }
    }

    //check for existing user 
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username    
    })

    //Validate user
    if(existingUser){
        return {
            error:'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room };
    users.push(user);
    return { user };
}



const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
        //splice returns an array and since we are only remove 1 element 
        //therefore we are returning 1st element
    }
}



const getUser = (id) => {
    return users.find((user)=>{
        return user.id === id
    });
}



const getUsersInRoom = (roomName)=>{
    roomName = roomName.trim().toLowerCase();
    return users.filter((user)=>{
        return user.room === roomName;
    });
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}