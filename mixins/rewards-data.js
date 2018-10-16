import _ from 'lodash'

export default {
    data() {
        let auto_rewards_data = [{
                lvl_id: 3,
                lvl: "3rd Level",
                rwds: ['Laptop', 'Rs. 25,000/-'],
            },
            {
                lvl_id: 4,
                lvl: "4th Level",
                rwds: ['Mobile', 'Rs. 50,000/-'],
            },
            {
                lvl_id: 5,
                lvl: "5th Level",
                rwds: ['CG-125 Motorcycle', 'Rs. 100,000/-'],
            },
            {
                lvl_id: 6,
                lvl: "6th Level",
                rwds: ['Ummrah With Dubai Tour', 'Rs. 200,000/-'],
            },
            {
                lvl_id: 7,
                lvl: "7th Level",
                rwds: ['Malaysia Tour', 'Rs. 300,000/-'],
            },
            {
                lvl_id: 8,
                lvl: "8th Level",
                rwds: ['Gli New Model Current Year', '$. 18,000/-'],
            },
            {
                lvl_id: 9,
                lvl: "9th Level",
                rwds: ['Toyota Fortuner 2018', '$. 50,000/-'],
            }
        ];
        let self_rewards_data = [
            {
                lvl_id: 3,
                lvl: "3rd Level",
                rwds: ['CD 70'],
            },
            {
                lvl_id: 4,
                lvl: "4th Level",
                rwds: ['120 SQYD PLOT'],
            },
            {
                lvl_id: 5,
                lvl: "5th Level",
            },
            {
                lvl_id: 6,
                lvl: "6th Level",
            },
            {
                lvl_id: 7,
                lvl: "7th Level",
            },
            {
                lvl_id: 8,
                lvl: "8th Level",
            },
            {
                lvl_id: 9,
                lvl: "9th Level",
            }
        ]
        return {
            auto_rewards_data,
            self_rewards_data
        }
    },
    methods: {
        getLvlRwd: function (type, lvl, get_param) {
            if(type === 0) {
                return _.get(_.find(this.auto_rewards_data, { lvl_id: lvl}), get_param, null)
            }else{
                return _.get(_.find(this.self_rewards_data, { lvl_id: lvl}), get_param, null)
            }
        }
    }
}