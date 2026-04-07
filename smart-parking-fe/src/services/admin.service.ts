import axiosClient from "./axiosClient"

export const AdminService = {
    getAllParkingSessions:() => {
        return axiosClient.get('/parking-sessions')
    }
}