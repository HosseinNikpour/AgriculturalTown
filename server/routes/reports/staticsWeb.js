const queries = [
  { key: 'Web_Invoice_Contractor', query:`select
 (select title from town where con.town_id =town.id order by no_id desc limit 1) as town,
 con.title,
 con.contract_no,
 co.title as company,
 con.initial_amount/1000000 as initial_amount ,
 (coalesce((select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) ,  con.initial_amount))/1000000  as contract_new_price,

 CONCAT(round((round((select contract_new_price from value_Change where 
        contract_Id=con.id order by no_id desc limit 1)-con.initial_amount ::numeric, 2) / con.initial_amount)*100 ::numeric, 2), '%') as  changeprecent,
 (select  b4.title from Invoice_Contractor LEFT JOIN baseinfo b4 ON Invoice_Contractor.no_id= b4.id  where contract_Id=con.id order by Invoice_Contractor.no_id desc limit 1) as  max_invoice,
 
 g2j(Invoice_Contractor.end_date+1) as  end_date,
 Invoice_Contractor.manager_price,
 g2j(Invoice_Contractor.letter_date_manager+1) as  letter_date_manager,
 
 (select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
                 from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
               ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                 where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
              from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                  where c.id=con.id
              group by c.title) as  pishraft_phisical , 
      
         
   
              CONCAT(round(Invoice_Contractor.manager_price/(coalesce((select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) ,  con.initial_amount)) ::numeric, 2), '%') as  pishraft_mali
  
   
   
   
 From  contract as con left join town on town.id =con.town_id
      LEFT JOIN company as co  ON con.company_id =co.id
      LEFT JOIN Invoice_Contractor  ON con.id=Invoice_Contractor.contract_Id
     where no_id in (select  no_id from Invoice_Contractor  
     where contract_Id=con.id order by Invoice_Contractor.no_id desc limit 1)
	 `},
 
{ key: 'Web_invoice_consultant', query:`select	
   b9.title as province,
   town.title as town,
   Ag.title,
   Ag.contract_no,
   co.title as company,
   
  (select round(sum(((x.done-x.value_change)*wieght/100))::numeric, 2)as pishraft
         from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
       ,(select round(sum(d.current_done)::numeric, 2) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
     where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
     from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
     where c.id=Ag.id
     group by c.title)  as  pishraft_phisical ,
   
   
   Ag.initial_amount/1000000 as initial_amount ,

  (coalesce((select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) ,  Ag.initial_amount))/1000000 as contract_new_price,
  round(inv.manager_price/(select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1)::numeric, 2) as manager_pishraft_mali,
  round(inv_approve.prev_price/(select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1)::numeric, 2) as technical_pishraft_mali,
  inv_Pay.price/(select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) as mali_pishraft_mali,
   g2j(Ag.contract_date+ 1) as contract_date ,
   g2j(Ag.end_date+ 1) as ag_end_date,
  (select duration from extension  where contract_Id=Ag.id order by no_id desc limit 1) as duration ,
  (select g2j(end_date) from extension  where contract_Id=Ag.id order by no_id desc limit 1) as extension_end_date ,
  g2j(Ag.record_letter_date) as record_letter_date,  
 (select  b2.title from invoice_consultant LEFT JOIN baseinfo b2 ON invoice_consultant.no_id= b2.id  
       where contract_Id=Ag.id order by invoice_consultant.no_id desc limit 1) as no_id,
  g2j(inv.start_date) as period_start_date,
  g2j(inv.end_date) as period_end_date,
  g2j(inv.letter_date_branch)as letter_date_branch,
  g2j(inv.letter_date_manager) as letter_date_manager,
  g2j(inv_approve.letter_date_employer) as letter_date_employer,
  g2j(inv_Pay.pay_date) AS pay_date,
  inv.manager_price as manager_price,
  inv_approve.price as approve_price,
  inv_Pay.price as Pay_price,
  (inv_approve.letter_date_manager-inv.letter_date_branch)as during_manager,
  (inv_approve.letter_date_employer - inv_approve.letter_date_manager) as during_technical,
  (inv_approve.letter_date_manager - inv_Pay.pay_date) as during_mali
  
  
  From  agreement as Ag 
        LEFT JOIN company as co  ON Ag.company_id =co.id
        LEFT JOIN invoice_consultant  as inv ON Ag.id=inv.contract_Id
        LEFT JOIN invoice_consultant_approve as inv_approve on Ag.id=inv_approve.contract_Id
        LEFT JOIN invoice_Consultant_Pay as inv_Pay on Ag.id=inv_Pay.contract_Id
        left join town  on town.id=ANY ( Ag.town_id)
       LEFT JOIN baseinfo b9 ON town.province_id = b9.id
     
      where inv.no_id in ((select  no_id from invoice_consultant  
      where contract_Id=Ag.id order by invoice_consultant.no_id desc limit 1))
    
       
      and inv_approve.no_id in ((select  no_id from invoice_consultant_approve  
      where contract_Id=Ag.id order by invoice_consultant_approve.no_id desc limit 1))
    
    
    and inv_Pay.no_id in ((select  no_id from invoice_Consultant_Pay  
      where contract_Id=Ag.id order by invoice_Consultant_Pay.no_id desc limit 1))
    
   --and co.id=
  -- and town.id=
      -- and Ag.id=
     `},

{ key: 'Web_insurance', query:`select town.title as town ,con.title,con.contract_no,co.title as company,
     g2j(con.land_delivery_date+ 1)as land_delivery_date ,
     g2j(con.end_date+ 1) as end_date ,
     g2j(coalesce((select end_date from Extension where type_id=2 and contract_id=con.id order by end_date desc limit 1) , con.end_date)) as date_end_extension ,
     ins.fund,
     g2j(ins.start_date+ 1) as ins_start_date,
     g2j(ins.end_date+ 1) as ins_end_date,
     g2j(insApp.start_date+ 1) as insapp_start_date ,
     g2j(insApp.end_date+ 1) as insapp_end_date ,
     g2j(coalesce((select end_date from insurance_Appendix where contract_id=con.id order by end_date desc limit 1) , ins.end_date)) as date_expire,
            
      DATE_PART('day',(coalesce((select end_date from insurance_Appendix where contract_id=con.id order by end_date desc limit 1) , ins.end_date))- NOW()) as time_to_expire 
     
   
       From insurance as ins  LEFT JOIN contract as con  ON  ins.contract_id =con.id
                LEFT JOIN insurance_Appendix as insApp  ON  ins.contract_id =insApp.contract_id
                LEFT JOIN company as co  ON con.company_id =co.id
                LEFT JOIN town  ON con.town_id =town.id `},

 { key: 'Web_contractCycle', query:`select town.title as town, con.title,con.contract_no,co.title as company, b3.title as status_title,con.duration,
             (coalesce (con.duration +(select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) ,con.duration))  as  ex_total_duration ,
             g2j(con.announcement_date+ 1) as announcement_date ,con.land_delivery_date::date - con.announcement_date ::date as announcement_to_land_delivery,
             g2j(con.land_delivery_date+ 1) as land_delivery,
             
             (select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
                              from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
                            ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                              where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
                           from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                               where c.id=con.id
                           group by c.title) as  pishraft_phisical , 
             
             
             DATE_PART('day', (coalesce((select  (end_date)  from extension  where contract_Id=con.id order by end_date desc limit 1 ),con.end_date))- NOW())  as re,
             g2j(con.land_delivery_date  + (coalesce (con.duration +(select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) ,con.duration)) * interval '1 day')  as ex_end_date ,
             DATE_PART('day',(select commision_date from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1)- (coalesce((select (end_date) from extension  where contract_Id=con.id order by no_id  desc limit 1),con.end_date) ::timestamp))as rh,
             (select  g2j(commision_date+ 1)  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1) as td_commision_date ,
             '***'as nn,
             (select  g2j(commision_date+ 1)  from Delivery  where contract_Id=con.id order by Delivery.commision_date  desc limit 1) as tm_commision_date
                     
             From contract_cycle  as cc LEFT JOIN contract  as con ON cc.contract_id =con.id
                LEFT JOIN town  ON con.town_id =town.id
                LEFT JOIN company as co  ON con.company_id =co.id
                LEFT JOIN baseinfo b3 ON  cc.state_id= b3.id `},

{ key: 'Web_tender', query:`select tn.title,b8.title as province,town.title as town,b3.title as service_type,tender_no,
                                 g2j(commission_date+ 1) as commission_date,
                                 b5.title as commission_result,
                                 tn.first_winner_name,
                                 g2j(tn.winner_letter_date) as winner_letter_date,
                                 tn.winner_letter_no,
                                 g2j(contract.contract_date) as contract_date,
                                 contract.contract_no as contract_no,
                                 co.title as compuny ,
                                 contract.initial_amount/1000000 as initial_amount ,
                                 tn.file_record,
                                 commission_date::date- winner_letter_date::date  as commission_to_winner,
                                 signification_date ::date - winner_letter_date::date as winner_to_signification
                                 
                                 From tender as tn  LEFT JOIN town  ON tn.town_id =town.id 
                                                    LEFT JOIN baseinfo b3 ON  tn.service_type_id = b3.id
                                                  LEFT JOIN baseinfo b5 ON  tn.commission_result_id = b5.id
                                                  LEFT JOIN contract  ON tn.id =contract.tender_id
                                                  LEFT JOIN Agreement  ON tn.id =Agreement.tender_id
                                                  LEFT JOIN company as co  ON contract.company_id =co.id
                                                LEFT JOIN baseinfo b8 ON town.province_id = b8.id
                                where 1=1 `},

{ key: 'Web_contract', query:`  select  town.title as town,con.title, con.contract_no,
g2j(con.contract_date+ 1) as contract_date ,
(coalesce((select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) ,  con.initial_amount))/1000000  as contract_new_price,
co.title as company,
(select  b3.title from contract_cycle LEFT JOIN baseinfo b3 ON contract_cycle.state_id= b3.id  where contract_Id=con.id order by contract_cycle.id desc limit 1) as state_id ,
g2j(con.land_delivery_date+1) as con_land_delivery_date,
(coalesce (con.duration +(select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) ,con.duration))  as  ex_total_duration ,
(select  g2j(end_date+ 1) from extension  where contract_Id=con.id order by no_id  desc limit 1) as ex_end_date ,

(select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
 from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
 where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
  where c.id=con.id
group by c.title) as  pishraft_phisical , 
  

round((select manager_price from invoice_Contractor where contract_Id=con.id order by invoice_Contractor.no_id desc limit 1)/
(select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1)::numeric, 2)as  pishraft_mali,
co1.title as company_monitoring_agreement,
Ag.contract_no as contract_no_monitoring_agreement,
g2j(Ag.contract_date) as ag_contract_date_monitoring_agreement,
g2j(coalesce((select end_date from Extension where type_id=2 and contract_id=Ag.id order by end_date desc limit 1) , Ag.end_date)) as  agex_end_date ,
 co2.title as company_study_agreement,
ag_2.contract_no  as contract_no_study_agreement,
g2j(ag_2.contract_date ) as contract_date_study_agreement


From contract as con  LEFT JOIN town  ON con.town_id =town.id
       LEFT JOIN company as co  ON con.company_id =co.id
       LEFT JOIN agreement as ag  ON con.monitoring_agreement_id =Ag.id
LEFT JOIN agreement as ag_2  ON con.study_agreement_id =ag_2.id
LEFT JOIN company as co1  ON co1.id = ag.company_id
LEFT JOIN company as co2  ON co2.id =ag_2.company_id `
              ,filter:` where (select  state_id  from  contract_cycle  where contract_Id=con.id order by date desc limit 1)=*sid*`},

{ key: 'Web_Document', query:`select 
              town.file_dxf,
            town.file_kmz,
            town.file_plan,
           town.title as town,
          con.title as contract,
         con.contract_no,
         con.file_agreement as con_file_agreement,
         con.file_announcement as con_file_announcement,
         con.file_delivery,
        (select file_signification from value_Change   where contract_Id=con.id order by value_Change.no_id desc limit 1) as vc_file_signification,
      (select file_signification from extension   where contract_Id=con.id order by extension.no_id desc limit 1) as ex_file_signification,
      (select file_late from extension   where contract_Id=con.id order by extension.no_id desc limit 1) as ex_file_late,
      (select file_plan_pdf from extension   where contract_Id=con.id order by extension.no_id desc limit 1) as ex_file_plan_pdf,
      (select file_plan_msp from extension   where contract_Id=con.id order by extension.no_id desc limit 1) as ex_file_plan_msp,
           contract_Cycle.file_record as cc_file_record,
       (select file_contract from insurance   where contract_Id=con.id order by insurance.end_date desc limit 1) as  in_file_contract,
         (select file_contract from insurance_Appendix   where contract_Id=con.id order by insurance_Appendix.end_date desc limit 1) as  in_App_file_contract,
         (select file_record from temp_Delivery   where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as  file_record,
         (select file_defect from temp_Delivery   where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as  file_defect,
         (select file_elimination_defects from temp_Delivery   where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as  file_elimination_defects,
      (select file_record from delivery   where contract_Id=con.id order by delivery.commision_date desc limit 1) as delivery_file_record,
      (select file_letter_manager from invoice_Contractor   where contract_Id=con.id order by invoice_Contractor.no_id desc limit 1) as inv_file_letter_manager,
      (select file_invoice from invoice_Contractor   where contract_Id=con.id order by invoice_Contractor.no_id desc limit 1) as file_invoice,
        (select file_letter_employer from invoice_Contractor_Approve   where contract_Id=con.id order by invoice_Contractor_Approve.no_id desc limit 1) as file_letter_employer,
          (select invoice_Contractor_Pay from invoice_Contractor_Pay   where contract_Id=con.id order by invoice_Contractor_Pay.no_id desc limit 1) as file_invoice_pay,
         c.title as company
               
               
                   From contract as con  LEFT JOIN town  ON con.town_id =town.id
                   left join company as c on c .id=con.company_id 
                 LEFT JOIN  contract_Cycle ON contract_Cycle.contract_Id=con.id`},

];

module.exports ={queries}  
   
   
   
   