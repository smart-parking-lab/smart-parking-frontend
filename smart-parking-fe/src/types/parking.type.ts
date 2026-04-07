export interface ParkingSLots{
    id: string,
    slot_code: string,
    status: string,
    position_x: number,
    position_y: number,
    created_at: Date,
    updated_at: Date
}
export interface ParkingSessions{
    id:string 
    plate_number: string
    entry_time: Date
    exit_time: Date
    status: string
    entry_image_url:string
    exit_image_url: string
    updated_at: Date
}