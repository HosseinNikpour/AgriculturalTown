const queries = [

{key:'exec', query:`select period_id,(select sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)
					from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
					,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
			  		where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title and m.period_id=main.period_id) as done
					from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
					where c.id=main.contract_id
					group by c.title) as done
from weekly_operation as main
where contract_id=*cid*
order by period_id`},

{key:'plan', query:`select period_id ,cumulative_done as done
from weekly_operation_plan as m left join weekly_operation_plan_detail as d on m.id=d.parent_id
where m.contract_id=*cid* and m.plan_id=(select max(plan_id) from weekly_operation_plan where contract_id=*cid*)
order by period_id`},

{key:'info', query:`select 
con.title,
town.title as town,
b9.title as province,
con.contract_no,
g2j(con.contract_date+ 1) as contract_date ,
co.title as company,
g2j(con.land_delivery_date+1) as con_land_delivery_date,
con.duration,
g2j(con.land_delivery_date+ con.duration+1) as con_end_date,
 (select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id )  as  ex_total_duration,
(select  g2j(end_date+ 1) from extension  where contract_Id=con.id order by no_id  desc limit 1) as ex_end_date ,
town.gross_area,
(select cc.title from agreement as ag join company as cc on cc.id=ag.company_id where con.monitoring_agreement_id=ag.id order by ag.id desc limit 1) as monitoring,
(select contract_no from agreement as ag where con.monitoring_agreement_id=ag.id order by ag.id desc limit 1) as monitoring_no,
(select g2j(contract_date+ 1) from agreement as ag where con.monitoring_agreement_id=ag.id order by ag.id desc limit 1) as monitoring_contract_date,
(select cc.title from agreement as ag join company as cc on cc.id=ag.company_id where con.study_agreement_id=ag.id order by ag.id desc limit 1) as study,
(select contract_no from agreement as ag where con.study_agreement_id=ag.id order by ag.id desc limit 1) as study_no,
(select g2j(contract_date+ 1) from agreement as ag where con.study_agreement_id=ag.id order by ag.id desc limit 1) as study_contract_date,
(select  g2j(commision_date+ 1) from temp_Delivery  where contract_Id=con.id order by temp_Delivery.id desc limit 1) as td_commision_date,
(select  g2j(commision_date+ 1) from Delivery  where contract_Id=con.id order by  Delivery.id desc limit 1) as d_commision_date,
(select  b3.title from contract_cycle LEFT JOIN baseinfo b3 ON contract_cycle.state_id= b3.id  where contract_Id=con.id order by contract_cycle.id desc limit 1) as state_id ,
  b6.title as operation_type,
 coalesce((select g2j(end_date+ 1) from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.id desc limit 1) ,(select g2j(end_date+ 1) from insurance  where contract_Id=con.id order by insurance.id desc limit 1)) as insurance_date,
con.initial_amount as initial_amount ,
(coalesce((select contract_new_price from value_Change   where contract_Id=con.id order by value_Change.no_id desc limit 1) ,  con.initial_amount)) as contract_new_price,
(select manager_price from invoice_contractor where contract_Id=con.id order by invoice_contractor.no_id desc limit 1) as manager_price,
(select price from invoice_contractor_pay where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1) as price,
(select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
   from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
   ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
     where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
     from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
     where c.id=con.id
      group by c.title) as  pishraft_phisical ,  
	  
	  
 (select round( ROUND((select manager_price  from invoice_contractor  where contract_Id=con.id  order by no_id desc limit 1)::numeric, 2)/
          ROUND((coalesce((select contract_new_price from value_Change   where contract_Id=con.id order by value_Change.no_id desc limit 1) ,  con.initial_amount))::numeric, 2)*100::numeric, 2))
             as pishraft_percent_approve,



 (select round( ROUND((select price  from invoice_contractor_pay  where contract_Id=con.id order by no_id desc limit 1)::numeric, 2)/
             ROUND((coalesce((select contract_new_price from value_Change   where contract_Id=con.id order by value_Change.no_id desc limit 1) ,  con.initial_amount))::numeric, 2)*100::numeric, 2))
              as pishraft_percent_pay	



 From contract as con  LEFT JOIN town  ON con.town_id =town.id
     LEFT JOIN company as co  ON con.company_id =co.id
      left join baseinfo b6 on b6.id=ANY ( con.operation_type_id)
      LEFT JOIN baseinfo b9 ON town.province_id = b9.id
	  
    where con.id=*cid*`},
    
{key:'invoice', query:`select b5.title as no_id,
    g2j(inv.start_date+ 1)	as inv_start_date  ,  
    g2j(inv.end_date+ 1)	as inv_end_date ,
    inv.consultant_letter_date as  inv_consultant_letter_date,
    g2j(inv.letter_date_branch+ 1) as inv_letter_date_branch ,
    g2j(inv.letter_date_manager+ 1) as inv_letter_date_manager ,
    
    (select g2j(letter_date_employer+ 1) from invoice_contractor_approve   where contract_Id=inv.contract_id   and invoice_contractor_approve.no_id=inv.no_id order by invoice_contractor_approve.no_id desc limit 1) as inv_app_letter_date_employer  ,
    
    (select  g2j(pay_date+ 1)  from invoice_contractor_pay where contract_Id=inv.contract_Id and invoice_contractor_pay.no_id=inv.no_id order by invoice_contractor_pay.no_id desc limit 1)  as inv_pay_pay_date ,						
    
    inv.manager_price as inv_manager_price ,	
    (select sum(price)  from invoice_contractor_approve   where contract_Id=inv.contract_id   and invoice_contractor_approve.no_id=inv.no_id)as inv_app_price,
                            
    (select sum(price)  from invoice_contractor_pay as pp  where contract_Id=inv.contract_id   and 
              pp.no_id=inv.no_id)as inv_pay_price 					 
                
    From  invoice_contractor as inv LEFT JOIN baseinfo b5 ON inv.no_id= b5.id 
    where inv.contract_id=*cid*`},

{key:'wbs', query:`select operation.title as operation_title,b2.title as unit, wbs.price_change,wbs.wieght,wbs.value_change
,(select sum(current_done) from weekly_operation_detail  as d join weekly_operation as m on m.id=d.parent_id
  where m.contract_id=*cid* and m.period_id<=*pid* and  d.operation=operation.title and d.unit=b2.title) as done

From  wbs  LEFT JOIN operation  ON wbs.operation_id= operation.id
LEFT JOIN baseinfo b2 ON  wbs.unit_id= b2.id
	  where contract_id=*cid*`},

{key:'delivery',query:`select substring(g2j(announcement_date),1,4) as year,count(announcement_date) as count,'contract' as type
from (select c.id,announcement_date,town_id  from contract as c join town as t on c.town_id=t.id where 1=1  ) as tmp
where announcement_date is not null group by 1
UNION ALL
select substring(g2j(announcement_date),1,4) as year,count(commision_date) as count,'temp_delivery' as type
from temp_delivery join (select c.id,announcement_date,town_id from contract as c join town as t on c.town_id=t.id where 1=1 ) as tmp on temp_delivery.contract_id=tmp.id 
where commision_date is not null group by 1
UNION ALL
select substring(g2j(announcement_date),1,4) as year,count(commision_date) as count,'delivery' as type
from delivery join (select c.id,announcement_date,town_id from contract as c join town as t on c.town_id=t.id where 1=1  )as tmp on delivery.contract_id=tmp.id
where commision_date is not null group by 1
union All
select substring(g2j(announcement_date),1,4) as year,count(announcement_date) as count,'ended' as type
FROM public.contract_cycle join (select c.id,announcement_date,town_id from contract as c join town as t on c.town_id=t.id where 1=1  )as tmp on contract_cycle.contract_id=tmp.id where state_id=217  group by 1
union All
select substring(g2j(announcement_date),1,4) as year,count(announcement_date) as count,'cancel' as type
FROM public.contract_cycle join (select c.id,announcement_date,town_id from contract as c join town as t on c.town_id=t.id where 1=1  )as tmp on contract_cycle.contract_id=tmp.id where state_id=219   group by 1 
order by 1`},

{key:'notif_invoice',query:`select tb.*,c.title as contract,c.contract_no,t.title as town,b.title as province,com.title as company,b2.title as no

from (select i.contract_id,i.no_id, DATE_PART('day',now() - i.letter_date_manager)  as diff
from invoice_contractor as i 
where (select DATE_PART('day',now() - i.letter_date_manager) >10)
		and (select no_id from invoice_contractor_approve as ip where ip.contract_id=i.contract_id and ip.no_id=i.no_id) is null
)as tb  left join contract as c on tb.contract_id = c.id
		left join town  as t on t.id= c.town_id
		left join baseinfo as b on t.province_id=b.id
		left join baseinfo as b2 on tb.no_id=b2.id
    left join company as com on com.id=c.company_id
order by province`},
    
{key:'notif_insurance',query:`select c.id ,c.title as contract,c.contract_no,t.title as town,b.title as province,com.title as company
from contract as c left join town  as t on t.id= c.town_id
          left join baseinfo as b on t.province_id=b.id
          left join company as com on com.id=c.company_id
where (select  state_id  from  contract_cycle  where contract_Id=c.id order by date desc limit 1)=211
and(select i.id from insurance as i where i.contract_id=c.id) is null 
order by province`},

{key:'notif_zamin',query:`select c.id ,c.title as contract,c.contract_no,t.title as town,b.title as province,com.title as company, DATE_PART('day',now()- announcement_date)  as diff
from contract as c left join town  as t on t.id= c.town_id
					left join baseinfo as b on t.province_id=b.id
					left join company as com on com.id=c.company_id
where land_delivery_date is null and announcement_date is not null
order by diff desc`},

{key:'notif_extension',query:`select c.id,c.title as contract,c.contract_no,t.title as town,b.title as province,com.title as company, DATE_PART('day',now() - coalesce((select end_date  from extension as e where e.contract_id=c.id order by no_id desc limit 1),c.land_delivery_date+ c.duration+1)) as diff 
from contract as c left join town  as t on t.id= c.town_id
        left join baseinfo as b on t.province_id=b.id
        left join company as com on com.id=c.company_id
where (select  state_id  from  contract_cycle  where contract_Id=c.id order by date desc limit 1)=211
	and DATE_PART('day',now() - coalesce((select end_date  from extension as e where e.contract_id=c.id order by no_id desc limit 1),c.land_delivery_date+ c.duration+1))>0
order by diff desc`},

{key:'notif_pishraft',query:` select c.id,c.title as contract,c.contract_no,t.title as town,b.title as province,com.title as company,sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end) as actual,
(select d.cumulative_done from weekly_operation_plan as m join weekly_operation_plan_detail as d on m.id=d.parent_id where m.contract_id=c.id 
     and m.plan_id=(select max(plan_id) from weekly_operation_plan where contract_id=c.id) 
     and( d.period_id=(select id from period where start_date<=now()::date and end_date>=now()::date) 
 		or	(d.period_id< (select id from period where start_date<=now()::date and end_date>=now()::date))and d.cumulative_done=100))as plan
  
from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
    ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
      where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
  	from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
   left join town  as t on t.id= c.town_id
            left join baseinfo as b on t.province_id=b.id
            left join company as com on com.id=c.company_id
where (select  state_id  from  contract_cycle  where contract_Id=c.id order by date desc limit 1)=211
group by c.id,c.title,c.contract_no,t.title ,b.title ,com.title 
order by plan desc`},
];


module.exports ={queries}  
   
   
   
   