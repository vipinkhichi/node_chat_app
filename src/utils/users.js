
const users =[]

const addUser = ({id, username, room}) => {

    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate Data
    if(!username || !room){
        return {
            error: 'Username and room is required!'
        }
    }

    //Check existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {

    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=> {

    const user = users.find((user) => {
        return user.id === id
    })

    if(!user){
        return {
            error: 'User do not exist'
        }
    }

    return user
}

const getUsersInRoom = (room) => {

    room = room.trim().toLowerCase();

    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}
