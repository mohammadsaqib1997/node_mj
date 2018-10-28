import vueRecaptcha from "vue-recaptcha";
export default {
    components: {
        vueRecaptcha
    },
    head: {
        script: [{
            src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit",
            async: true,
            defer: true
        }]
    },
    data() {
        return {
            form: {
                captcha: null,
            }
        }
    },
    methods: {
        captchaExpTr() {
            const self = this;
            self.form.captcha = null;
            if (self.$refs["vue-captcha-ref"]) {
                self.$refs["vue-captcha-ref"].reset();
            }
        },
        captchaTr(e) {
            const self = this;
            self.form.captcha = e;
        },
    },
    destroyed() {
        let all_scripts = $("head").find("script");
        let find_scpt = _.filter(all_scripts, function (o) {
            return _.includes(o.src, "https://www.gstatic.com/recaptcha/api2");
        });
        _.each(find_scpt, function (script) {
            script.parentNode.removeChild(script);
        });
    }
}