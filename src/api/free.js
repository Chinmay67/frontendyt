import axios from './axios'

export const fetchOtherChannelProfile=async(channelName)=>{
    try {
        const response =await axios.get(`/free/user/${channelName}`)
        // console.log(response);
        return response.data.data
    } catch (error) {
        console.log(error)        
    }
}
export const fetchOtherChannelVideos=async(channelName)=>{
    try {
        const response=await axios.get(`/free/videos/${channelName}`)
        return response
    } catch (error) {
        console.log(error)
    }
}