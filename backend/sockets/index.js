
export const  socketInit=(io)=>{
    io.on("connection",socket =>{
        console.log(`User connected with socket id ${socket.id}.`)
        
        
        socket.on("disconnect",user=>{
            console.log(`User with socket id ${user.id} disconnected.`)
        })
    })

    
}