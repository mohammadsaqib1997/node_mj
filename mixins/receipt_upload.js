import Vue from 'vue'

export default {
    data() {
        return {
            loading: false,
            sel_file: {}
        }
    },
    methods: {
        hasFile(key) {
            return this.sel_file.hasOwnProperty(key)
        },
        remFile(key) {
            Vue.delete(this.sel_file, key)
        },
        addFile(data) {
            Vue.set(this.sel_file, data.id, data.e[0])
        },
        mimetype_check(file) {
            return (
                file.type === "image/png" ||
                file.type === "image/jpeg" ||
                file.type === "application/pdf" ||
                file.type === "application/msword" ||
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.type === "application/rtf" ||
                file.type === "text/plain" ||
                file.type === "image/photoshop" ||
                file.type === "image/x-photoshop" ||
                file.type === "image/psd" ||
                file.type === "application/photoshop" ||
                file.type === "application/psd" ||
                file.type === "zz-application/zz-winassoc-psd"
            )
        },
        fileChange(data) {
            if (this.mimetype_check(data.e[0])) {
                if (data.e[0].size <= 5000000) {
                    this.addFile(data)
                } else {
                    this.$toast.open({
                        duration: 3000,
                        message: "Maximum Upload File Size Is 5MB!",
                        position: "is-bottom",
                        type: "is-danger"
                    });
                }
            } else {
                this.$toast.open({
                    duration: 3000,
                    message: "Invalid File Selected! Valid types: .pdf, .doc, .docx, .rtf, .txt, .jpeg, .png, .jpg, .psd",
                    position: "is-bottom",
                    type: "is-danger"
                });
            }
        },
        async uploadFile(mem_id, ref_id, type) {
            const self = this;
            self.loading = true;
            let form_data = new FormData();
            form_data.append("ref_id", ref_id);
            form_data.append("mem_id", mem_id);
            form_data.append("type", type);
            form_data.append(
                "receipt",
                self.sel_file[ref_id],
                self.sel_file[ref_id].name
            );
            let config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            };
            await this.$axios
                .post("/api/receipt/upload", form_data, config)
                .then(async res => {
                    if (res.data.status === true) {
                        self.remFile(ref_id)
                        await self.loadData()
                    } else {
                        self.$toast.open({
                            duration: 3000,
                            message: "Uploading Error",
                            position: "is-bottom",
                            type: "is-danger"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            self.loading = false;
        },
        async deleteReceipt(id) {
            const self = this;
            self.loading = true;
            await this.$axios
                .post("/api/receipt/delete", {
                    id
                })
                .then(async res => {
                    if (res.data.status === true) {
                        await self.loadData()
                    } else {
                        self.$toast.open({
                            duration: 3000,
                            message: "Deleting Error",
                            position: "is-bottom",
                            type: "is-danger"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            self.loading = false;
        },
        async download(id, file_name, type) {
            const self = this;
            self.loading = true;
            await self
                .$axios({
                    url: `/api/receipt/dn_file/${id}/${type}`,
                    method: "GET",
                    responseType: "blob"
                })
                .then(res => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    let link = document.getElementById("download_anc");
                    if (!link) {
                        link = document.createElement("a");
                        link.id = "download_anc";
                    }
                    link.href = url;
                    link.setAttribute("download", file_name);
                    if (!document.getElementById("download_anc")) {
                        document.body.appendChild(link);
                    }
                    link.click();
                    let el = document.getElementById("download_anc");
                    el.parentNode.removeChild(el);
                })
                .catch(err => {
                    console.log(err);
                });
            self.loading = false;
        }
    }
}