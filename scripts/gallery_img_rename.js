const fs = require('fs');
const folder = __dirname + '/../static/gallery/';



fs.readdir(folder, (err, files) => {
    if (err) {
        console.log(err)
        return;
    }
    let file_inc = 0
    files.forEach(async file => {
        let s_fname = file.split(".")
        let g_ext = s_fname[s_fname.length - 1]
        if (g_ext === "jpg" || g_ext === "png") {
            file_inc++;
            let new_fname = file_inc + "." + g_ext;
            await fs.rename(folder + file, folder + new_fname, err => {
                if (err) {
                    console.log("file name not change some error! -> " + err.message)
                }
            })
        }
    });
})