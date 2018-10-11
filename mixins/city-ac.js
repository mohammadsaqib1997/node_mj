export default {
    computed: {
        filteredCityArray() {
            return this.cities.filter(option => {
                return (
                    option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.ac_city.toLowerCase()) >= 0
                );
            });
        }
    },
    async mounted() {
        let ct_data = await this.$axios.$get("/api/web/pk");
        this.cities = ct_data.cities;
    },
    data() {
        return {
            cities: [],
            ac_city: "",
        }
    }
}