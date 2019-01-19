import _ from 'lodash'

export default {
    data() {
        let auto_rewards_data = [{
                lvl_id: 0,
                lvl: "You",
                rwds: ['Business Kit']
            },
            {
                lvl_id: 1,
                lvl: "1st Level",
                rwds: ['Watch']
            },
            {
                lvl_id: 2,
                lvl: "2nd Level",
                rwds: ['Travelling bag']
            },
            {
                lvl_id: 3,
                lvl: "3rd Level",
                rwds: ['Mobile', 'Rs. 25,000/-'],
            },
            {
                lvl_id: 4,
                lvl: "4th Level",
                rwds: ['Laptop', 'Rs. 50,000/-'],
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
        let self_rewards_data = [{
                lvl_id: 0,
                lvl: "0 Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 1,
                lvl: "1st Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 2,
                lvl: "2nd Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 3,
                lvl: "3rd Level",
                rwds: ['CD 70'],
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 4,
                lvl: "4th Level",
                rwds: ['120 SQYD PLOT'],
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 5,
                lvl: "5th Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 6,
                lvl: "6th Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 7,
                lvl: "7th Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 8,
                lvl: "8th Level",
                pp: 1,
                act_p: 1,
            },
            {
                lvl_id: 9,
                lvl: "9th Level",
                pp: 1,
                act_p: 1,
            }
        ]
        for (let ind in self_rewards_data) {
            if (ind > 0) {
                self_rewards_data[ind].pp = self_rewards_data[ind - 1].pp * 4;
                self_rewards_data[ind].act_p = self_rewards_data[ind - 1].act_p + self_rewards_data[ind].pp
            }
        }
        return {
            auto_rewards_data,
            self_rewards_data
        }
    },
    methods: {
        getLvlRwd: function (type, lvl, get_param) {
            if (type === 0) {
                return _.get(_.find(this.auto_rewards_data, {
                    lvl_id: lvl
                }), get_param, null)
            } else {
                return _.get(_.find(this.self_rewards_data, {
                    lvl_id: lvl
                }), get_param, null)
            }
        },
        getSelfLevel: function (tot_refls) {
            const self = this
            let lvl = '';
            for (let ind in self.self_rewards_data) {
                let g_data = self.self_rewards_data[ind];
                if (g_data.act_p >= tot_refls) {
                    lvl = g_data.lvl
                    break;
                }
            }
            return lvl
        }
    }
}