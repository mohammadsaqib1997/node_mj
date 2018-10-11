export default {
    bind: function (el, binding, vnode) {
        if (el.tagName.toLocaleUpperCase() !== "INPUT") {
            var els = el.getElementsByTagName("input");
            if (els.length !== 1) {
                throw new Error(
                    "v-mask-percent directive requires 1 input, found " + els.length
                );
            } else {
                el = els[0];
            }
        }
        el.oninput = function (evt) {
            if (!evt.isTrusted) return;

            let spl_val = el.value.split("%").join("");
            let mask = "%";
            let new_val = spl_val;

            if (evt.data === null) {
                var position = el.selectionEnd;
                if (position === new_val.length) {
                    new_val =
                        new_val != 0 ? new_val.substring(0, new_val.length - 1) : 0;
                }
                new_val = new_val !== "" ? parseInt(new_val) : 0;
            } else {
                if (!/^[0-9]$/.test(evt.data)) {
                    new_val = spl_val.substring(0, spl_val.length - 1);
                }

                new_val = new_val !== "" ? parseInt(new_val) : 0;

                if (!/^0$|^[1-9][0-9]?$|^100$/.test(new_val)) {
                    new_val = new_val
                        .toString()
                        .substring(0, new_val.toString().length - 1);
                }
            }

            el.value = new_val + mask;
        };
    }
}