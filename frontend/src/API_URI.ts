interface API_URI_I {
    login: string
    change_pass: string
    download_photos: string
    load_photos: string
}

export const API_URI = {
    login: `http://localhost:5000/api/login`,
    change_pass: `http://localhost:5000/api/change-pass`,
    download_photos: `http://localhost:5000/api/load-photo/`,
    load_photos: `http://localhost:5000/api/download-photos/`
}