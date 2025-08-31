interface API_URI_I {
    login: string
    change_pass: string
    download_photos: string
    load_photos: string
}

export const API_URI = {
    login: `/api/login`,
    change_pass: `/api/change-pass`,
    load_photos: `/api/load-photo/`,
    download_photos: `/api/download-photos/`
}