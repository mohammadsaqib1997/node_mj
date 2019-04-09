drop function if exists get_crzb_mem_sale;
-- delimiter $$
-- create function get_crzb_mem_sale(id int)
-- returns int(11)
-- deterministic
-- begin
-- 	declare ret_sale int(11);
--     set ret_sale = (
-- 		select count(*)
-- 		from assign_roles_trans as asn_role_trans 
-- 		join assign_roles as asn_role
-- 		on asn_role_trans.crzb_id = asn_role.crzb_id and asn_role.role_status=1 and asn_role_trans.member_id = asn_role.member_id
-- 		where asn_role_trans.crzb_id=id
--     );
--     return ret_sale;
-- end$$
-- delimiter ;

drop function if exists get_crzb_mem_sale_monthly;
delimiter $$
create function get_crzb_mem_sale_monthly(crzb_id int, member_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare ret_sale int(11);
    set ret_sale = (
		select count(*) from mem_link_crzb as mem_lk
		join members as m
		on mem_lk.member_id = m.id and m.is_paid_m=1
		left join assign_roles_trans as asn_role_tns
		on mem_lk.crzb_id = asn_role_tns.crzb_id and mem_lk.member_id = asn_role_tns.linked_member_id
		where mem_lk.crzb_id=crzb_id and if(member_id is null, asn_role_tns.member_id is null, asn_role_tns.member_id=member_id) and mem_lk.linked_mem_type=1 and (mem_lk.linked_at>=start_date and mem_lk.linked_at<=end_date)
    );
    return ret_sale;
end$$
delimiter ;

drop function if exists get_zonal_sale_monthly;
delimiter $$
create function get_zonal_sale_monthly(zone_id int, member_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare ret_sale int(11);
    set ret_sale = (
		select count(*) from mem_link_crzb as mem_lk
		join members as m
		on mem_lk.member_id = m.id and m.is_paid_m=1
        
        join crzb_list as b_list
		on mem_lk.crzb_id = b_list.id
		join crzb_list as z_list
		on b_list.parent_id = z_list.id
		
        left join assign_roles_trans as asn_role_tns
		on z_list.id = asn_role_tns.crzb_id and mem_lk.member_id = asn_role_tns.linked_member_id
        
		where z_list.id=zone_id and if(member_id is null, asn_role_tns.member_id is null, asn_role_tns.member_id=member_id) and mem_lk.linked_mem_type=1 and (mem_lk.linked_at>=start_date and mem_lk.linked_at<=end_date)
    );
    return ret_sale;
end$$
delimiter ;

drop function if exists get_crzb_mem_comm;
-- delimiter $$
-- create function get_crzb_mem_comm(id int)
-- returns int(11)
-- deterministic
-- begin
-- 	declare ret_comm int(11);
--     set ret_comm = (
-- 		select sum(asn_role_trans.amount)
-- 		from assign_roles_trans as asn_role_trans 
-- 		join assign_roles as asn_role
-- 		on asn_role_trans.crzb_id = asn_role.crzb_id and asn_role.role_status=1 and asn_role_trans.member_id = asn_role.member_id
-- 		where asn_role_trans.crzb_id=id
--     );
--     return ret_comm;
-- end$$
-- delimiter ;

drop function if exists get_crzb_mem_comm_monthly;
delimiter $$
create function get_crzb_mem_comm_monthly(crzb_id int, member_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare ret_comm int(11);
    set ret_comm = (
		select sum(asn_role_trans.amount)
		from assign_roles_trans as asn_role_trans 
		where asn_role_trans.crzb_id=crzb_id and asn_role_trans.member_id=member_id and (asn_role_trans.created_at >= start_date and asn_role_trans.created_at <= end_date)
    );
    return ret_comm;
end$$
delimiter ;

drop function if exists get_crzb_rd_code;
delimiter $$
create function get_crzb_rd_code(id int)
returns varchar(20)
deterministic
begin
	declare rd_code varchar(20);
    set rd_code = (
		SELECT 
			concat(
				if(l_c.rd_id IS NOT NULL, concat(l_c.rd_id, "-"), ""),
				if(l_r.rd_id IS NOT NULL, concat(l_r.rd_id, "-"), ""),
				if(l_z.rd_id IS NOT NULL, concat(l_z.rd_id, "-"), ""),
				l_b.rd_id
			) 
		FROM crzb_list as l_b
		LEFT JOIN crzb_list as l_z
		ON l_b.parent_id = l_z.id
		LEFT JOIN crzb_list as l_r
		ON l_z.parent_id = l_r.id
		LEFT JOIN crzb_list as l_c
		ON l_r.parent_id = l_c.id
		WHERE l_b.id=id
    );
    return rd_code;
end$$
delimiter ;

drop function if exists get_franchise_rd_code;
delimiter $$
create function get_franchise_rd_code(id int)
returns varchar(20)
deterministic
begin
	declare rd_code varchar(20);
    set rd_code = (
		select 
			concat(c_l.rd_id, '-', r_l.rd_id, '-', z_l.rd_id, '-', b_l.rd_id, '-','UC', (fr.rd_id * 1)) as code
		from franchises as fr

		join crzb_list as b_l
		on fr.branch_id = b_l.id
		join crzb_list as z_l
		on b_l.parent_id = z_l.id
		join crzb_list as r_l
		on z_l.parent_id = r_l.id
		join crzb_list as c_l
		on r_l.parent_id = c_l.id

		where fr.id=id
    );
    return rd_code;
end$$
delimiter ;

drop function if exists get_crzb_with_p_name;
delimiter $$
create function get_crzb_with_p_name(id int)
returns mediumtext
deterministic
begin
	declare full_name mediumtext;
    set full_name = (
		SELECT 
			concat(
				l_b.name,
                if(l_z.name IS NOT NULL, concat(", ", l_z.name), ""),
                if(l_r.name IS NOT NULL, concat(", ", l_r.name), ""),
                if(l_c.name IS NOT NULL, concat(", ", l_c.name), "")
			) 
		FROM crzb_list as l_b
		LEFT JOIN crzb_list as l_z
		ON l_b.parent_id = l_z.id
		LEFT JOIN crzb_list as l_r
		ON l_z.parent_id = l_r.id
		LEFT JOIN crzb_list as l_c
		ON l_r.parent_id = l_c.id
		WHERE l_b.id=id
    );
    return full_name;
end$$
delimiter ;

drop function if exists get_fr_with_p_name;
delimiter $$
create function get_fr_with_p_name(id int)
returns mediumtext
deterministic
begin
	declare full_name mediumtext;
    set full_name = (
		SELECT 
			concat(
				fr.name,
				if(l_b.name IS NOT NULL, concat(", ", l_b.name), ""),
				if(l_z.name IS NOT NULL, concat(", ", l_z.name), ""),
				if(l_r.name IS NOT NULL, concat(", ", l_r.name), ""),
				if(l_c.name IS NOT NULL, concat(", ", l_c.name), "")
			) 
		FROM franchises as fr
		LEFT JOIN crzb_list as l_b
		on fr.branch_id = l_b.id
		LEFT JOIN crzb_list as l_z
		ON l_b.parent_id = l_z.id
		LEFT JOIN crzb_list as l_r
		ON l_z.parent_id = l_r.id
		LEFT JOIN crzb_list as l_c
		ON l_r.parent_id = l_c.id
		WHERE fr.id=id
    );
    return full_name;
end$$
delimiter ;

drop function if exists get_crzbf_name_type;
delimiter $$
create function get_crzbf_name_type(id int, type int)
returns mediumtext
deterministic
begin
	declare full_name mediumtext;
    set full_name = (
		select * 
		from (
			SELECT 
				if(type < 4, get_crzb_with_p_name(id), get_fr_with_p_name(id)) as name
		) as crzbf_var
    );
    return full_name;
end$$
delimiter ;

drop function if exists get_crzbf_code_type;
delimiter $$
create function get_crzbf_code_type(id int, type int)
returns mediumtext
deterministic
begin
	declare `code` mediumtext;
    set `code` = (
		select * 
		from (
			SELECT 
				if(type < 4, get_crzb_rd_code(id), get_franchise_rd_code(id)) as code
		) as crzbf_var
    );
    return `code`;
end$$
delimiter ;

drop function if exists get_crzb_childs_count;
delimiter $$
create function get_crzb_childs_count(id int)
returns int(11)
deterministic
begin
	declare childs int(11);
    set childs = (
		SELECT 
			count(*)
		FROM crzb_list as crzb_l
		WHERE crzb_l.parent_id=id
    );
    return childs;
end$$
delimiter ;

drop function if exists get_crzb_total_sale;
delimiter $$
create function get_crzb_total_sale(crzb_id int)
returns int(11)
deterministic
begin
	declare sale int(11);
    set sale = (
		select count(*) from crzb_list as crzb_l

		left join (
			select 
				c_l.id,
				concat(
					if(b_l.id is not null, b_l.id, (
						if(z_l.id is not null, z_l.id, (
							if(r_l.id is not null, r_l.id, c_l.id)
						))
					))
				) as b_id

			from crzb_list as c_l

			left join crzb_list as r_l
			on c_l.id=r_l.parent_id

			left join crzb_list as z_l
			on r_l.id=z_l.parent_id

			left join crzb_list as b_l
			on z_l.id=b_l.parent_id
		) as g_branches
		on crzb_l.id = g_branches.id

		right join mem_link_crzb as mem_lk_crzb
		on mem_lk_crzb.crzb_id=g_branches.b_id and mem_lk_crzb.linked_mem_type=1

		join members as m
		on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

		where crzb_l.id=crzb_id
    );
    return sale;
end$$
delimiter ;

drop function if exists get_crzb_month_sale;
delimiter $$
create function get_crzb_month_sale(crzb_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare sale int(11);
    set sale = (
		select count(*) from crzb_list as crzb_l

		left join (
			select 
				c_l.id,
				concat(
					if(b_l.id is not null, b_l.id, (
						if(z_l.id is not null, z_l.id, (
							if(r_l.id is not null, r_l.id, c_l.id)
						))
					))
				) as b_id

			from crzb_list as c_l

			left join crzb_list as r_l
			on c_l.id=r_l.parent_id

			left join crzb_list as z_l
			on r_l.id=z_l.parent_id

			left join crzb_list as b_l
			on z_l.id=b_l.parent_id
		) as g_branches
		on crzb_l.id = g_branches.id

		right join mem_link_crzb as mem_lk_crzb
		on mem_lk_crzb.crzb_id=g_branches.b_id and mem_lk_crzb.linked_mem_type=1 and (mem_lk_crzb.linked_at>=start_date and mem_lk_crzb.linked_at<=end_date)

		join members as m
		on mem_lk_crzb.member_id = m.id and m.is_paid_m=1

		where crzb_l.id=crzb_id
    );
    return sale;
end$$
delimiter ;

drop function if exists get_crzb_total_comm;
delimiter $$
create function get_crzb_total_comm(crzb_id int)
returns int(11)
deterministic
begin
	declare comm int(11);
    set comm = (
		select g_branches.total_comm from crzb_list as crzb_l

		join (
			select 
				c_l.id,
				sum(
					(select if(sum(trans.amount) is null, 0, sum(trans.amount)) from assign_roles_trans as trans where trans.crzb_id=c_l.id)
					+
					if(c_l.type=0 or c_l.type=1 or c_l.type=2, (
						(
							select 
								if(sum(trans.amount) is null, 0, sum(trans.amount)) 
							from crzb_list as crzb_ls
							join assign_roles_trans as trans
							on crzb_ls.id = trans.crzb_id
							where crzb_ls.parent_id=c_l.id
						)
					), 0)
					+
					if(c_l.type=0 or c_l.type=1, (
						(
							select 
								if(sum(trans.amount) is null, 0, sum(trans.amount)) 
							from crzb_list as crzb_ls
							join crzb_list as child_1
							on crzb_ls.id=child_1.parent_id
							join assign_roles_trans as trans
							on child_1.id = trans.crzb_id
							where crzb_ls.parent_id=c_l.id
						)
					), 0)
					+
					if(c_l.type=0, (
						(
							select 
								if(sum(trans.amount) is null, 0, sum(trans.amount)) 
							from crzb_list as crzb_ls
							join crzb_list as child_1
							on crzb_ls.id=child_1.parent_id
							join crzb_list as child_2
							on child_1.id=child_2.parent_id
							join assign_roles_trans as trans
							on child_2.id = trans.crzb_id
							where crzb_ls.parent_id=c_l.id
						)
					), 0)
				) as total_comm

			from crzb_list as c_l
			group by c_l.id
		) as g_branches
		on crzb_l.id = g_branches.id

		where crzb_l.id=crzb_id
    );
    return comm;
end$$
delimiter ;

drop function if exists get_crzb_month_comm;
delimiter $$
create function get_crzb_month_comm(crzb_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare comm int(11);
    set comm = (
		select g_branches.total_comm from crzb_list as crzb_l

		join (
			select 
				c_l.id,
				sum(
					(select if(sum(trans.amount) is null, 0, sum(trans.amount)) from assign_roles_trans as trans where trans.crzb_id=c_l.id and (trans.created_at>=start_date and trans.created_at<=end_date))
					+
					if(c_l.type=0 or c_l.type=1 or c_l.type=2, (
						(
							select 
								if(sum(trans.amount) is null, 0, sum(trans.amount)) 
							from crzb_list as crzb_ls
							join assign_roles_trans as trans
							on crzb_ls.id = trans.crzb_id and (trans.created_at>=start_date and trans.created_at<=end_date)
							where crzb_ls.parent_id=c_l.id
						)
					), 0)
					+
					if(c_l.type=0 or c_l.type=1, (
						(
							select 
								if(sum(trans.amount) is null, 0, sum(trans.amount)) 
							from crzb_list as crzb_ls
							join crzb_list as child_1
							on crzb_ls.id=child_1.parent_id
							join assign_roles_trans as trans
							on child_1.id = trans.crzb_id and (trans.created_at>=start_date and trans.created_at<=end_date)
							where crzb_ls.parent_id=c_l.id
						)
					), 0)
					+
					if(c_l.type=0, (
						(
							select 
								if(sum(trans.amount) is null, 0, sum(trans.amount)) 
							from crzb_list as crzb_ls
							join crzb_list as child_1
							on crzb_ls.id=child_1.parent_id
							join crzb_list as child_2
							on child_1.id=child_2.parent_id
							join assign_roles_trans as trans
							on child_2.id = trans.crzb_id and (trans.created_at>=start_date and trans.created_at<=end_date)
							where crzb_ls.parent_id=c_l.id
						)
					), 0)
				) as total_comm

			from crzb_list as c_l
			group by c_l.id
		) as g_branches
		on crzb_l.id = g_branches.id

		where crzb_l.id=crzb_id
    );
    return comm;
end$$
delimiter ;

drop function if exists get_fr_mem_sale;
delimiter $$
create function get_fr_mem_sale(fr_id int, member_id int)
returns int(11)
deterministic
begin
	declare sale int(11);
    set sale = (
		select 
			count(*) as total_sale
		from assign_roles_trans_fr as asnr_tr_fr
		where 
			asnr_tr_fr.member_id = member_id and 
			asnr_tr_fr.fr_id = fr_id
    );
    return sale;
end$$
delimiter ;

drop function if exists get_fr_mem_date_sale;
delimiter $$
create function get_fr_mem_date_sale(fr_id int, member_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare sale int(11);
    set sale = (
		select 
			count(*)
		from mem_link_franchise as mem_lk_fr

		left join assign_roles_trans_fr as asnr_tr_fr
		on mem_lk_fr.member_id = asnr_tr_fr.linked_member_id

		where 
			(if(member_id is not null, asnr_tr_fr.member_id=member_id, asnr_tr_fr.member_id is null)) and
			mem_lk_fr.franchise_id = fr_id and
			(mem_lk_fr.linked_at >= start_date and mem_lk_fr.linked_at <= end_date)
    );
    return sale;
end$$
delimiter ;

drop function if exists get_mem_lk_exist_month;
-- get the id of assign role member id where crzb mem link
delimiter $$
create function get_mem_lk_exist_month(lk_mem_id int, start_date varchar(20), end_date varchar(20))
returns int(11)
deterministic
begin
	declare exist int(11);
    set exist = (
		SELECT 
			if(mem_lk.member_id is not null, 1, 0) as `count`
		FROM mem_link_crzb as mem_lk

		join mem_link_franchise as mem_lk_fr
		on mem_lk.member_id = mem_lk_fr.member_id

		where mem_lk.member_id = lk_mem_id and (mem_lk.linked_at >= start_date and mem_lk.linked_at <= end_date)
    );
    return exist;
end$$
delimiter ;


