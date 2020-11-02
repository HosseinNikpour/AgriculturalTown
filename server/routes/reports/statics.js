const queries = [
    { key: 'company', query:`SELECT full_title,meli_code,economic_code , registration_number,b4.title as province1,town.title as town,contract.contract_no as contract_no,b2.title as registration_province,
               b1.title as province, company.city,company.address ,b3.title as certificate_type_id, rating1,rating2,postalcode ,tell, company.fax, company.email
           FROM company LEFT JOIN baseinfo b1 ON company.province_id = b1.id
           LEFT JOIN baseinfo b2 ON company.registration_province_id = b2.id
           LEFT JOIN baseinfo b3 ON company.certificate_type_id = b3.id
           LEFT JOIN  contract  on contract.company_id=company.id
		   LEFT JOIN  town  on contract.town_id=town.id
		   LEFT JOIN baseinfo b4 ON town.province_id = b4.id`},


                               
    { key: 'town', query:`select ROW_NUMBER () OVER (ORDER BY town.id),Town.title,b1.title as province,city,inityear, gross_area, pure_area,b2.title as activity, b3.title as ownership_type , b4.title as water_supply, water_rate, 
    b5.title as power_supply, power_rate ,b6.title as gas_supply , gas_rate, total_units,used_units,used_number ,
    b9.title as operation_type, water_quality_ec,water_quality_ph,
     water_quality_tds ,exploitable_area ,operating_area ,coordinate_e ,coordinate_n , b8.title as location_id
from Town  LEFT JOIN baseinfo b1 ON Town.province_id = b1.id 
            LEFT JOIN baseinfo b2 ON Town.activity_type_id = b2.id
            LEFT JOIN baseinfo b3 ON Town.ownership_type_id = b3.id
            LEFT JOIN baseinfo b4 ON Town.water_supply_id = b4.id
            LEFT JOIN baseinfo b5 ON Town.power_supply_id = b5.id
            LEFT JOIN baseinfo b6 ON Town.gas_supply_id = b6.id 
            LEFT JOIN baseinfo b8 ON Town.location_id = b8.id
            left join baseinfo b9 on b9.id=ANY (operation_type_id)
            `},




 
            { key: 'contract', query:` 
            select 
            b9.title as province,
            town.title as town,con.title,
             b6.title as operation_type,
            con.contract_no,co.title as company,
            (select  co.title from  company as co  where con.colleague1_id=co.id order by co.id desc limit 1) as  colleague1,
            (select  co.title from  company as co  where con.colleague2_id=co.id order by co.id desc limit 1) as  colleague2,
             b2.title as contract_type,
            (select  b3.title from contract_cycle LEFT JOIN baseinfo b3 ON contract_cycle.state_id= b3.id  where contract_Id=con.id order by contract_cycle.id desc limit 1) as state_id ,
            (select g2j(date+ 1) from contract_cycle  where contract_Id=con.id order by contract_cycle.id desc limit 1 ) as cc_date,
             g2j(con.contract_date+ 1) as contract_date ,
            
             con.signification_letter_no,
             g2j(con.announcement_date+ 1) as con_announcement_date ,
             g2j(con.land_delivery_date) as con_land_delivery_date,g2j(con.end_date+ 1) as con_end_date,
             (select  g2j(end_date+ 1) from extension  where contract_Id=con.id order by no_id  desc limit 1) as ex_end_date , 
             (select  g2j(commision_date+ 1) from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_commision_date,
             (select  g2j(commision_date+ 1) from Delivery  where contract_Id=con.id order by  Delivery.commision_date desc limit 1) as D_commision_date,
             con.duration,
             (select count(id) from extension  where contract_Id=con.id ) as count_no , 
             (coalesce (con.duration +(select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) ,con.duration))  as  ex_total_duration ,
             (select allow_late from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_allow_late ,
           
             con.initial_amount as initial_amount ,con.client_initial_amount as client_initial_amount,
             (select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) as contract_new_price,
           
             (select title from agreement as ag where con.monitoring_agreement_id=ag.id order by ag.id desc limit 1) as monitoring,
             (select title from agreement as ag where con.study_agreement_id=ag.id order by ag.id desc limit 1) as study,
           
             (select g2j(start_date+ 1) from insurance  where contract_Id=con.id order by insurance.end_date desc limit 1) as ins_start_date,
             (select g2j(end_date+ 1) from insurance  where contract_Id=con.id order by insurance.end_date desc limit 1) as ins_end_date,
             (select g2j(start_date+ 1) from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.end_date desc limit 1) as insApp_start_date,
             (select g2j(end_date+ 1) from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.end_date desc limit 1) as insApp_end_date,
             (select  b7.title from insurance LEFT JOIN baseinfo b7 ON insurance.insurance_company_id=b7.id  where contract_Id=con.id order by insurance.end_date desc limit 1) asins_insurance_company ,
             (select fund from insurance where contract_Id=con.id order by insurance.end_date desc limit 1) as ins_fund,
             (select price from insurance where contract_Id=con.id order by insurance.end_date desc limit 1) as ins_price,
             (select price from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.end_date desc limit 1) as insApp_price,
             (select  tender_no from tender where con.tender_id=tender.id order by tender.id desc limit 1) as tender_no , 
             (select b10.title from extension LEFT JOIN baseinfo b10 ON extension.no_id= b10.id where contract_Id=con.id order by no_id desc limit 1) as ex_no_id ,
             (select letter_no from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_letter_no , 
             (select g2j(letter_date+ 1) from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_letter_date , 
             con.project_manager_name,con.project_manager_contacts,
            
             
          (select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
                from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
               ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                 where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
                from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                  where c.id=con.id
                      group by c.title) as  pishraft_phisical ,


             (select  b4.title from Invoice_Contractor LEFT JOIN baseinfo b4 ON Invoice_Contractor.no_id= b4.id  where contract_Id=con.id order by Invoice_Contractor.no_id desc limit 1) as  MaxInvoice,
              (select  b5.title from invoice_contractor_pay  LEFT JOIN baseinfo b5 ON invoice_contractor_pay.no_id= b5.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1) as  MaxInvoicePay,
              (select g2j(end_date+ 1) from invoice_contractor where contract_Id=con.id order by invoice_contractor.no_id desc limit 1) as end_date, 
              (select manager_price from invoice_contractor where contract_Id=con.id order by invoice_contractor.no_id desc limit 1) as manager_price,
              (select price from invoice_contractor_pay where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1) as price,
             
              (select  g2j(free_letter_date+ 1) from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_free_letter_date,
              (select  free_letter_number  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_free_letter_number ,
              (select  free_price  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_free_price , 
              (select  g2j(warranty_letter_date+ 1) from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_warranty_letter_date,
              (select  warranty_letter_number   from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_warranty_letter_number ,
              (select  warranty_price  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date desc limit 1) as td_warranty_price ,
              (select  g2j(free_letter_date+ 1) from Delivery  where contract_Id=con.id order by Delivery.commision_date desc limit 1) as D_free_letter_date,
             (select  free_letter_number from Delivery  where contract_Id=con.id order by Delivery.commision_date desc limit 1) as D_free_letter_number,
             (select  free_price from Delivery  where contract_Id=con.id order by Delivery.commision_date desc limit 1) as D_free_price,
                     
            (select d.cumulative_done from weekly_operation_plan as m join weekly_operation_plan_detail as d on m.id=d.parent_id where m.contract_id=con.id 
                   and m.plan_id=(select max(plan_id) from weekly_operation_plan where contract_id=con.id) 
                     and d.period_id=(select id from period where start_date<=now()::date and end_date>=now()::date)) as  pishraft_Barnameh,
            
             
			 (select round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2) 
               from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
              ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                  where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
                       from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                       where c.id=con.id           
			          group by c.id,c.title)pishraft_Actual 
			 
                From contract as con  LEFT JOIN town  ON con.town_id =town.id
                LEFT JOIN company as co  ON con.company_id =co.id
                LEFT JOIN baseinfo b2 ON con.contract_type_id = b2.id
                 left join baseinfo b6 on b6.id=ANY ( con.operation_type_id)
                 LEFT JOIN baseinfo b9 ON town.province_id = b9.id`},
           





     
                 { key: 'agreement', query:`
                 select b9.title as province,
                 town.title as town,
                 Ag.title,
               b6.title as operation_type,
                 Ag.contract_no,
               co.title as company,
                (select  co.title from  company as co  where Ag.colleague1_id=co.id order by co.id desc limit 1) as  colleague1,
                (select  co.title from  company as co  where Ag.colleague2_id=co.id order by co.id desc limit 1) as  colleague2,
                 b2.title as contract_type,
              (select  tender_no from tender where Ag.tender_id=tender.id order by tender.id desc limit 1) as tender_no ,  
                (select  b3.title from project_cycle LEFT JOIN baseinfo b3 ON project_cycle.state_id= b3.id  where 
                       contract_Id=Ag.id order by project_cycle.id desc limit 1) as state_id ,
                  
                (select g2j(date+ 1) from project_cycle  where contract_Id=Ag.id order by project_cycle.id desc limit 1 ) as PC_date,
                 g2j(Ag.contract_date+ 1) as contract_date ,
                 Ag.file_announcement,
                 g2j(Ag.announcement_date+ 1) as Ag_announcement_date ,
                 g2j(Ag.end_date+ 1) as Ag_end_date,
                 g2j(coalesce((select end_date from Extension where type_id=2 and contract_id=Ag.id order by end_date desc limit 1) , Ag.end_date)) as  DateEndextension,
                 Ag.duration,
                 (select count(id) from extension  where contract_Id=Ag.id ) as count_no , 
                 (coalesce (Ag.duration +(select sUM(duration) from extension  where contract_Id=Ag.id GROUP BY  contract_Id ) ,Ag.duration))  as  ex_total_duration ,
                 Ag.initial_amount,
                 Ag.client_initial_amount,
                 /*(select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) as contract_new_price ,*/
               (select  b4.title from extension LEFT JOIN baseinfo b4 ON extension.no_id= b4.id  where contract_Id=Ag.id order by extension.no_id desc limit 1) as   no_id,
                 (select letter_no from extension  where contract_Id=Ag.id order by no_id desc limit 1) as ex_letter_no , 
                 (select g2j(letter_date+ 1) from extension  where contract_Id=Ag.id order by no_id desc limit 1) as ex_letter_date , 
                  Ag.study_surface,
                  Ag.study_surface_final,
                  Ag.mapping_surface,
                  Ag.mapping_surface_final,
                   
				   (select  round(sum(weight*percent_approve)/100::numeric, 2) from study_operation_detail as d join study_operation as m on m.id=d.parent_id  
			               where m.contract_id=ag.id  and m.report_date=(select max(report_date) from study_operation where contract_id=ag.id)) as  pishraftphsical,
                 (select  b4.title from invoice_Consultant LEFT JOIN baseinfo b4 ON invoice_Consultant.no_id= b4.id where contract_Id=Ag.id order by invoice_Consultant.no_id desc limit 1) as  MaxInvoice,
                (select  b5.title from invoice_Consultant_pay  LEFT JOIN baseinfo b5 ON invoice_Consultant_pay.no_id= b5.id where contract_Id=Ag.id order by invoice_Consultant_pay.no_id desc limit 1) as  MaxInvoicePay,
                 (select  g2j(end_date+ 1) from invoice_Consultant where contract_Id=Ag.id order by invoice_Consultant.no_id desc limit 1) as end_date, 
                 (select manager_price from invoice_Consultant where contract_Id=Ag.id order by invoice_Consultant.no_id desc limit 1) as manager_price,
                 (select price from invoice_Consultant_pay where contract_Id=Ag.id order by invoice_Consultant_pay.no_id desc limit 1) as price,
                 Ag.project_manager_name,
               Ag.project_manager_contacts,
              g2j(Ag.free1_letter_date+ 1) as free1_letter_date ,
                  Ag.free1_letter_number,
                  Ag.free1_price,
                  g2j(Ag.warranty_letter_date+ 1) as warranty_letter_date,
                  Ag.warranty_letter_number,
                  Ag.warranty_price,
                  g2j( Ag.free2_letter_date+ 1) as free2_letter_date,
                  Ag.free2_letter_number,
                  Ag.free2_price,
                  (select  g2j(commission_date+ 1) from tender where Ag.tender_id=tender.id order by tender.id desc limit 1) as commission_date, 
                  (select  g2j(commission_date) from tender where Ag.tender_id=tender.id order by tender.id desc limit 1) ::date -  Ag.announcement_date::date as CommissionTOAnnouncement,
                  
                
                  Ag.land_delivery_date ::date - (coalesce((select report_date from Study_Operation where contract_Id=Ag.id order by Study_Operation.id ASc limit 1) ,current_date))::date as land_deliveryToDate,
             (select g2j(report_date) from Study_Operation where contract_Id=Ag.id order by Study_Operation.id ASc limit 1) as start_date_Operation ,
             (select g2j(report_date) from Study_Operation where contract_Id=Ag.id order by Study_Operation.id Desc limit 1) as end_date_Operation ,  
             DATE_PART('day', (coalesce((select  (end_date)  from extension  where contract_Id=Ag.id order by end_date desc limit 1 ),Ag.end_date))- NOW())  as TimeToEnd,
			 (select  g2j(end_date+ 1) from extension  where contract_Id=Ag.id order by no_id  desc limit 1) as ex_end_date , 
              DATE_PART('day',(Ag.announcement_date + Ag.duration)- NOW())as dateTest,
			  g2j(Ag.record_letter_date+ 1),
               Ag.record_letter_number,
              'http://192.168.4.4:8438'|| Ag.file_record as  file_record 
              
              
                             From agreement as Ag 
                                 LEFT JOIN company as co  ON Ag.company_id =co.id
                                LEFT JOIN baseinfo b2 ON Ag.contract_type_id = b2.id
                              left join baseinfo b6 on b6.id=ANY ( Ag.operation_type_id)
                              left join town  on town.id=ANY ( Ag.town_id)
                            LEFT JOIN tender as tn  ON Ag.tender_id =tn.id
                            LEFT JOIN baseinfo b9 ON town.province_id = b9.id`},
           




    { key: 'valueChange', query:`
    select
     b3.title as province,
    town.title as town,
    con.contract_no,con.title,con.initial_amount,b2.title as no_id,vc.increase_price,
    vc.decrease_price,new_work,
    new_work +(increase_price - decrease_price) as change_price,
	   vc.contract_new_price,
  
   
    round((100*vc.increase_price/con.initial_amount)::numeric,2) as increase_price_percent,
    round((100*vc.decrease_price/con.initial_amount)::numeric,2) as decrease_price_percent,
    round((100*vc.new_work/con.initial_amount) ::numeric,2) as new_work_percent,
    round((100*(new_work +(increase_price - decrease_price))/con.initial_amount) ::numeric,2) as change_price_percent,
    case has_license  when  TRUE  then   'بله' when  FALSE   then   'خیر'  end  as has_license,
    case has25  when  TRUE  then   'بله' when  FALSE   then   'خیر'  end  as has25,
    
    vc.letter_number_signification, vc.letter_number_25percent
    
    
                    From value_Change as vc 
                          LEFT JOIN contract  as con ON vc.contract_id =con.id
                          LEFT JOIN baseinfo b2 ON vc.no_id = b2.id
						              LEFT JOIN town  ON con.town_id =town.id
						              LEFT JOIN baseinfo b3 ON town.province_id = b3.id`},
          
               

               

 { key: 'tender', query:`
 select  ROW_NUMBER () OVER (ORDER BY tn.id),tn.title,
 b8.title as province,
 town.city,
 town.title as town,
b1.title as group_id , b2.title as type_id, b3.title as service_type,
(select STRING_AGG(title, ', ') from baseinfo where  id= ANY (ARRAY[tn.operation_type_id])) as operation_type,
b4.title as modifier_type,
g2j(commission_date+ 1) as commission_date,
 b5.title as commission_result, b6.title as invite_method, b7.title as call_method,recommender_count,
 invite_no,
 tender_no,
call_number,g2j(invite_date+ 1) as invite_date ,
init_amount,first_winner_name,first_winner_amount,second_winner_name,
second_winner_amount,
min_grade,warranty_price,

g2j(contract.announcement_date+ 1) as announcement_date,
contract.contract_no as contract_no,
co.title as compuny ,
tn.send_document_letter_number,
tn.indicator_no,
g2j(tn.send_document_date+ 1),
tn.description

From tender as tn  LEFT JOIN town  ON tn.town_id =town.id
                   LEFT JOIN baseinfo b1 ON  tn.group_id = b1.id
				   LEFT JOIN baseinfo b2 ON  tn.type_id = b2.id
				   LEFT JOIN baseinfo b3 ON  tn.service_type_id = b3.id
				   LEFT JOIN baseinfo b4 ON  tn.modifier_type_id = b4.id
				   LEFT JOIN baseinfo b5 ON  tn.commission_result_id = b5.id
				   LEFT JOIN baseinfo b6 ON  tn.invite_method_id = b6.id
           LEFT JOIN baseinfo b7 ON  tn.call_method_id = b7.id 
           LEFT JOIN contract  ON tn.id =contract.tender_id
           LEFT JOIN company as co  ON contract.company_id =co.id
				    LEFT JOIN baseinfo b8 ON town.province_id = b8.id`},










            { key: 'invoiceContractor', query:`        
            select
            b9.title as province,
             town.title as town ,
            con.title,con.contract_no,b2.title as contract_type, co.title as company,con.initial_amount,
            (coalesce((select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) ,  con.initial_amount)) as contract_new_price,
             
            (select  b6.title from value_Change LEFT JOIN baseinfo b6 ON value_Change.no_id= b6.id  
                where contract_Id=con.id order by value_Change.id desc limit 1) as no_valueChange,
              
             b5.title as no_id,
             g2j(inv.start_date+ 1)	as inv_start_date  ,  
             g2j(inv.end_date+ 1)	as inv_end_date ,  
             inv.manager_price as inv_manager_price ,
            inv.period_price as inv_period_price ,
            (select price  from invoice_contractor_approve  where contract_Id=con.id 
                           and  invoice_contractor_approve.prev_approve_id=b5.title  order by no_id desc limit 1) as inv_app_price ,
            (select period_price  from invoice_contractor_approve  where contract_Id=con.id
			               and  invoice_contractor_approve.prev_approve_id=b5.title   order by no_id desc limit 1) as inv_app_period_price ,
						   
             (select price  from invoice_contractor_pay  where contract_Id=con.id  and 
			 	  invoice_contractor_pay.prev_approve_id=
				     (select  b8.title from invoice_contractor_pay LEFT JOIN baseinfo b8 ON invoice_contractor_pay.no_id= b8.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1)
				         order by no_id desc limit 1)as inv_pay_price ,
						 
						 
			(select period_price  from invoice_contractor_pay  where contract_Id=con.id  and 
			 	  invoice_contractor_pay.prev_approve_id=
				     (select  b8.title from invoice_contractor_pay LEFT JOIN baseinfo b8 ON invoice_contractor_pay.no_id= b8.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1)
				         order by no_id desc limit 1)as inv_pay_period_price,			 
		
            
			
			
			g2j(inv.letter_date_branch+ 1) as inv_letter_date_branch ,
            g2j(inv.letter_date_manager+ 1) as inv_letter_date_manager ,
            
            (select g2j(letter_date_employer+ 1)  from invoice_contractor_approve  where contract_Id=con.id 
			               and  invoice_contractor_approve.prev_approve_id=b5.title  order by no_id desc limit 1) as inv_app_letter_date_employer  ,
           
		   
		   
		   (select  g2j(letter_date_secretariat+ 1)  from invoice_contractor_pay  where contract_Id=con.id  and 
			 	  invoice_contractor_pay.prev_approve_id=
				     (select  b8.title from invoice_contractor_pay LEFT JOIN baseinfo b8 ON invoice_contractor_pay.no_id= b8.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1)
				         order by no_id desc limit 1) as inv_pay_letter_date_secretariat  ,
		   
		   (select  g2j(pay_date+ 1)  from invoice_contractor_pay  where contract_Id=con.id  and 
			 	  invoice_contractor_pay.prev_approve_id=
				     (select  b8.title from invoice_contractor_pay LEFT JOIN baseinfo b8 ON invoice_contractor_pay.no_id= b8.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1)
				         order by no_id desc limit 1) as inv_pay_pay_date ,
		   
		
			 inv.letter_no_branch  as inv_letter_no_branch ,
             inv.letter_no_manager  as letter_no_manager ,
            (select letter_no_employer  from invoice_contractor_approve  where contract_Id=con.id
                           and  invoice_contractor_approve.prev_approve_id=b5.title  order by no_id desc limit 1) as inv_app_letter_no_employer ,
            
		    
	     (select b4.title  from invoice_contractor_pay LEFT JOIN baseinfo b4 ON invoice_contractor_pay.type_id = b4.id  where contract_Id=con.id  and 
		          invoice_contractor_pay.prev_approve_id=
				     (select  b8.title from invoice_contractor_pay LEFT JOIN baseinfo b8 ON invoice_contractor_pay.no_id= b8.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1) 
					       order by no_id desc limit 1) as inv_pay_type_id ,
          
		 (select  g2j(credit_date+ 1)  from invoice_contractor_pay  where contract_Id=con.id  and 
			 	  invoice_contractor_pay.prev_approve_id=
				     (select  b8.title from invoice_contractor_pay LEFT JOIN baseinfo b8 ON invoice_contractor_pay.no_id= b8.id where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1)
				         order by no_id desc limit 1) as inv_pay_credit_date,
		      
            
            
			
                 (select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
                 from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
               ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                 where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
              from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                  where c.id=con.id
              group by c.title) as  pishraft_phisical , 
            
            (select round( ROUND(( inv.manager_price)::numeric, 2)/
            ROUND((coalesce((select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) ,  con.initial_amount))::numeric, 2)*100::numeric, 2))
              as pishraft_percent,


            (select round( ROUND((select prev_price  from invoice_contractor_approve  LEFT JOIN baseinfo b10 ON invoice_contractor_approve.no_id= b10.id  where contract_Id=con.id and  b10.title=b5.title)::numeric, 2)/
               ROUND((select  contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1)::numeric, 2)*100::numeric, 2))
             as pishraft_percent_approve,
              
            (select round( ROUND((select manager_price  from invoice_contractor_pay LEFT JOIN baseinfo b9 ON invoice_contractor_pay.no_id= b9.id where contract_Id=con.id  and  b9.title=b5.title)::numeric, 2)/
            ROUND((coalesce((select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) ,  con.initial_amount))::numeric, 2)*100::numeric, 2))
              as pishraft_percent_pay
            
              
            From  invoice_contractor as inv
                   LEFT JOIN contract  as con ON inv.contract_id =con.id
                 LEFT JOIN baseinfo b2 ON con.contract_type_id = b2.id 
                   LEFT JOIN company as co  ON con.company_id =co.id
                 LEFT JOIN town  ON con.town_id =town.id
                LEFT JOIN baseinfo b9 ON town.province_id = b9.id
                LEFT JOIN baseinfo b5 ON inv.no_id= b5.id  `},
																
																












            

                { key: 'invoiceConsultant', query:`
        
                select
                b9.title as province,
                town.title as town ,
                Ag.title,Ag.contract_no,b2.title as contract_type, co.title as company,Ag.initial_amount,
             (coalesce((select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) ,  Ag.initial_amount)) as contract_new_price,
                (select  b6.title from value_Change LEFT JOIN baseinfo b6 ON value_Change.no_id= b6.id  
                    where contract_Id=ag.id order by value_Change.no_id desc limit 1) as no_valueChange,
             
            
                  b5.title as no_id,
                  g2j(inv.start_date+ 1)	as inv_start_date  ,  
                  g2j(inv.end_date+ 1)	as inv_end_date ,  
                  inv.manager_price as inv_manager_price ,
                  inv.period_price as inv_period_price ,
           
               (select price  from invoice_consultant_approve  where contract_Id=Ag.id 
                                      and  invoice_consultant_approve.prev_approve_id=b5.title  order by no_id desc limit 1) as inv_app_price ,
                  (select period_price  from invoice_consultant_approve  where contract_Id=Ag.id
                                and  invoice_consultant_approve.prev_approve_id=b5.title   order by no_id desc limit 1) as inv_app_period_price ,
                    
                  (select price  from invoice_consultant_pay  where contract_Id=Ag.id  and 
                      invoice_consultant_pay.prev_approve_id=
                        (select  b8.title from invoice_consultant_pay LEFT JOIN baseinfo b8 ON invoice_consultant_pay.no_id= b8.id where contract_Id=Ag.id order by invoice_consultant_pay.no_id desc limit 1)
                            order by no_id desc limit 1)as inv_pay_price ,
               (select period_price  from invoice_consultant_pay  where contract_Id=Ag.id  and 
                      invoice_consultant_pay.prev_approve_id=
                        (select  b8.title from invoice_consultant_pay LEFT JOIN baseinfo b8 ON invoice_consultant_pay.no_id= b8.id where contract_Id=Ag.id order by invoice_consultant_pay.no_id desc limit 1)
                            order by no_id desc limit 1)as inv_pay_period_price,	
                        
               g2j(inv.letter_date_branch+ 1) as inv_letter_date_branch ,
                 g2j(inv.letter_date_manager+ 1) as inv_letter_date_manager , 
              (select g2j(letter_date_employer+ 1)  from invoice_consultant_approve  where contract_Id=Ag.id 
                                and  invoice_consultant_approve.prev_approve_id=b5.title  order by no_id desc limit 1) as inv_app_letter_date_employer  , 
             (select  g2j(letter_date_secretariat+ 1)  from invoice_consultant_pay  where contract_Id=Ag.id  and 
                      invoice_consultant_pay.prev_approve_id=
                        (select  b8.title from invoice_consultant_pay LEFT JOIN baseinfo b8 ON invoice_consultant_pay.no_id= b8.id where contract_Id=Ag.id order by invoice_consultant_pay.no_id desc limit 1)
                            order by no_id desc limit 1) as inv_pay_letter_date_secretariat , 
              (select  g2j(pay_date+ 1)  from invoice_consultant_pay  where contract_Id=Ag.id  and 
                      invoice_consultant_pay.prev_approve_id=
                        (select  b8.title from invoice_consultant_pay LEFT JOIN baseinfo b8 ON invoice_consultant_pay.no_id= b8.id where contract_Id=Ag.id order by invoice_consultant_pay.no_id desc limit 1)
                            order by no_id desc limit 1) as inv_pay_pay_date , 
              
             inv.letter_no_branch  as inv_letter_no_branch ,
             inv.letter_no_manager  as letter_no_manager ,
             (select letter_no_employer  from invoice_consultant_approve  where contract_Id=Ag.id
                                and  invoice_consultant_approve.prev_approve_id=b5.title  order by no_id desc limit 1) as inv_app_letter_no_employer , 
            (select b4.title  from invoice_consultant_pay LEFT JOIN baseinfo b4 ON invoice_consultant_pay.type_id = b4.id  where contract_Id=Ag.id  and 
                         invoice_consultant_pay.prev_approve_id=
                        (select  b8.title from invoice_consultant_pay LEFT JOIN baseinfo b8 ON invoice_consultant_pay.no_id= b8.id where contract_Id=Ag.id order by invoice_consultant_pay.no_id desc limit 1) 
                            order by no_id desc limit 1) as inv_pay_type_id ,
                          
            (select  g2j(credit_date+ 1)  from invoice_consultant_pay  where contract_Id=Ag.id  and 
                      invoice_consultant_pay.prev_approve_id=
                        (select  b8.title from invoice_consultant_pay LEFT JOIN baseinfo b8 ON invoice_consultant_pay.no_id= b8.id where contract_Id=Ag.id order by invoice_consultant_pay.no_id desc limit 1)
                            order by no_id desc limit 1) as inv_pay_credit_date,
            
            
            (select round(sum(((x.done-x.value_change)*wieght/100))::numeric, 2)as pishraft
           from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
           
             ,(select round(sum(d.current_done)::numeric, 2) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
           where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
           from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
           where c.id=Ag.id
           group by c.title)  as  pishraft_phisical ,  
           
           (select round( ROUND(( inv.manager_price)::numeric, 2)/
           ROUND((coalesce((select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) ,  Ag.initial_amount))::numeric, 2)*100::numeric, 2))
             as pishraft_percent,
             
           
           (select round( ROUND((select prev_price  from invoice_consultant_approve LEFT JOIN baseinfo b10 ON invoice_consultant_approve.no_id= b10.id  where contract_Id=Ag.id and  b10.title=b5.title)::numeric, 2)/
           ROUND((coalesce((select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) ,  Ag.initial_amount))::numeric, 2)*100::numeric, 2))
             as pishraft_percent_approve,
             
           (select round( ROUND((select manager_price  from invoice_consultant_pay LEFT JOIN baseinfo b9 ON invoice_consultant_pay.no_id= b9.id where contract_Id=Ag.id  and  b9.title=b5.title)::numeric, 2)/
           ROUND((coalesce((select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) ,  Ag.initial_amount))::numeric, 2)*100::numeric, 2))
             as pishraft_percent_pay
           
           
             
                 From  invoice_consultant as inv
                       LEFT JOIN agreement  as Ag ON inv.contract_id =Ag.id
                       LEFT JOIN baseinfo b2 ON Ag.contract_type_id = b2.id 
                       LEFT JOIN company as co  ON Ag.company_id =co.id
                       left join town  on town.id=ANY (Ag.town_id)
                       LEFT JOIN baseinfo b9 ON town.province_id = b9.id
                     LEFT JOIN baseinfo b5 ON inv.no_id= b5.id  `},


 { key: 'creditPredict', query:`      
                     select 
                      ROW_NUMBER () OVER (ORDER BY cp.id),
                      con.contract_no,
                    con.title,
                    g2j(start_date+ 1) as startDate,
                    g2j(cp.end_date+ 1) as endDate,
                    con.initial_amount,
                       Vc.contract_new_price,
                    round((100*(Vc.new_work +(Vc.increase_price - Vc.decrease_price))/con.initial_amount) ::numeric,2) as change_price_percent, 
                     cp.invoice_paid_price,
                    cp.invoice_paid_period,
                    g2j(invoice_paid_date+ 1) as invoice_paid_date ,
                    cp.invoice_approved_price,
                    cp.invoice_approved_period,
                    g2j(invoice_approved_date+ 1) as invoice_approved_date ,
                  cp.start_date::date - cp.invoice_approved_date ::date as TimePast,   
                  cp.price_until_now,
                    cp.start_date ::date-(coalesce((select end_date from Extension where type_id=2 and contract_id=con.id order by end_date desc limit 1) , con.end_date)) ::date  as  TimeStartUntilEnd,
                   cp.price_until_end,
                    cp.price_until_now+cp.price_until_end+cp.invoice_approved_price as estimation_initial_amount,
                       round(     
                      ROUND((cp.price_until_now+cp.price_until_end+(select price from invoice_contractor_pay where contract_Id=con.id order by invoice_contractor_pay.no_id desc limit 1))::numeric, 2)
                           /
                     ROUND((con.initial_amount)::numeric, 2)
                              *100::numeric, 2) as PerecentIncDec
                        
                        
               
                       From  credit_Predict as cp
                             LEFT JOIN contract  as con ON cp.contract_id =con.id
                         LEFT JOIN value_Change  as Vc ON cp.contract_id =Vc.contract_id`},
          
              


              
       { key: 'weeklyOperation', query:`  select 
       ROW_NUMBER () OVER (ORDER BY wo.id),
       (select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where wo.contract_Id=con.id order by town_id desc limit 1) as town ,
       con.title as Contract,
       con.contract_no,
       co.title as company,
	   operation.title as operation_title,
	   b2.title as unit ,
	   wbs.price,
	   wbs.wieght,
	   wbs.value_change as TotalAmount ,
      (select cumulative_done  from wbs   LEFT JOIN weekly_operation_detail ON   wo.id =weekly_operation_detail.parent_id  where contract_Id=con.id order by wbs.id desc limit 1) as cumulative_done ,
   
	   
       (select  b3.title from contract_cycle LEFT JOIN baseinfo b3 ON contract_cycle.state_id= b3.id  where contract_Id=con.id order by contract_cycle.id desc limit 1) as state_id ,
       period.title  as period
       /*,g2j(period.start_date) as start_date ,
       g2j(period.end_date) as */
       
       
          From  weekly_operation  as wo
          LEFT JOIN contract  as con ON  wo.contract_id =con.id
		  LEFT JOIN wbs  ON wo.contract_Id=wbs.contract_id
		  LEFT JOIN operation  ON wbs.operation_id= operation.id
          LEFT JOIN period  ON  wo.period_id =period.id
          LEFT JOIN company as co  ON con.company_id =co.id
		  LEFT JOIN baseinfo b2 ON  wbs.unit_id= b2.id
`},
     
              
            

      { key: ' weekly_Weather', query:`   
      
      select 
      ROW_NUMBER () OVER (ORDER BY weekly_Weather.id),
      (select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where weekly_Weather.contract_Id=con.id order by town_id desc limit 1) as town ,
      con.title,
      con.contract_no,
      co.title as company,
       period.title,g2j(period.start_date+ 1) as start_date ,g2j(period.end_date+ 1) as end_date,
      
      (select COUNT(weather_status_id) from weekly_weather_detail where weather_status_id=100 and parent_id=weekly_Weather.id) as "آفتابی",
      (select COUNT(weather_status_id) from weekly_weather_detail where weather_status_id=101 and parent_id=weekly_Weather.id) as "بارانی",
      (select COUNT(weather_status_id) from weekly_weather_detail where weather_status_id=244 and parent_id=weekly_Weather.id) as "برفی",
      (select COUNT(weather_status_id) from weekly_weather_detail where weather_status_id=245 and parent_id=weekly_Weather.id) as "گردو خاک",
      (select COUNT(workshop_status_id) from weekly_weather_detail where weather_status_id=102 and parent_id=weekly_Weather.id) as "فعال",
      (select COUNT(workshop_status_id) from weekly_weather_detail where weather_status_id=103 and parent_id=weekly_Weather.id) as "نیمه فعال",
      (select COUNT(workshop_status_id) from weekly_weather_detail where weather_status_id=247 and parent_id=weekly_Weather.id) as "تعطیل",
      (select COUNT(rain) from weekly_weather_detail where  parent_id=weekly_Weather.id)as rain,
      (select COUNT(contractor_user) from  weekly_user   LEFT JOIN weekly_user_detail as wu ON  parent_id=wu.id  where user_type = N'کارشناس بومی' and weekly_Weather.contract_id =weekly_user.contract_id ) as "کارشناس بومی", 
      (select COUNT(contractor_user) from weekly_user LEFT JOIN weekly_user_detail as wu ON  parent_id=wu.id  where user_type = N'تکنسین بومی ' and  weekly_Weather.contract_id =weekly_user.contract_id ) as "تکنسین بومی ",  
      (select COUNT(contractor_user) from weekly_user  LEFT JOIN weekly_user_detail as wu ON  parent_id=wu.id  where user_type = N'ساده بومی' and weekly_Weather.contract_id =weekly_user.contract_id ) as "ساده بومی ",  
      (select COUNT(contractor_user) from weekly_user LEFT JOIN weekly_user_detail as wu ON  parent_id=wu.id  where user_type = N'کارشناس غیر بومی ' and weekly_Weather.contract_id =weekly_user.contract_id ) as "کارشناس غیر بومی ",  
      (select COUNT(contractor_user) from weekly_user LEFT JOIN weekly_user_detail as wu ON  parent_id=wu.id  where user_type = N'تکنسین غیر بومی ' and weekly_Weather.contract_id =weekly_user.contract_id ) as "تکنسین غیر بومی ", 
      (select COUNT(contractor_user) from weekly_user  LEFT JOIN weekly_user_detail as wu ON  parent_id=wu.id  where user_type = N'ساده غیر بومی ' and weekly_Weather.contract_id =weekly_user.contract_id ) as "ساده غیر بومی ", 
      (select COUNT (machine_type_id) from weekly_machine_detail  LEFT JOIN weekly_machine as wm ON weekly_Weather.contract_id =wm.contract_id where machine_type_id=198 and parent_id=wm.id) as "فعال",
      (select COUNT (machine_type_id) from weekly_machine_detail  LEFT JOIN weekly_machine as wm ON weekly_Weather.contract_id =wm.contract_id where machine_type_id=246 and parent_id=wm.id) as "غیرفعال"
      
      
      From  weekly_Weather
            LEFT JOIN contract  as con ON  weekly_Weather.contract_id =con.id
            LEFT JOIN period  ON   weekly_Weather.period_id =period.id
            LEFT JOIN company as co  ON con.company_id =co.id`},
         






            { key: 'studyOperation', query:` 
            select 
            ROW_NUMBER () OVER (ORDER BY so.id),             
            town.title  as town ,
             con.title,
             con.contract_no,
            co.title as company,
            operation,
            study_operation_detail.weight,
            study_operation_detail.percent_done,
            study_operation_detail.progress_done,
            study_operation_detail.percent_approve,
            study_operation_detail.progress_approve,
            g2j(report_date)
                  
   
     From  study_operation as so  
               LEFT JOIN contract  as con ON  so.contract_id =con.id
               LEFT JOIN town  ON con.town_id =town.id 
               LEFT JOIN company as co  ON con.company_id =co.id
              LEFT JOIN study_operation_detail  ON study_operation_detail.parent_id=so.id`},
         






           { key: 'insurance', query:` 
                   select
                     b4.title as province,
                     town.title as town ,
                     con.title,
                     (select STRING_AGG(title, ', ') from baseinfo where  id= ANY (ARRAY[con.operation_type_id])) as operation_type,
                     con.contract_no, 
                     co.title as company,
                     g2j(con.contract_date+ 1) as contract_date,
                     g2j(con.land_delivery_date+ 1)as land_delivery_date ,
                    con.duration,
                    g2j(con.end_date) as end_date ,
                   (select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) as Sumextension, 
   
                   g2j(coalesce((select end_date from Extension where type_id=2 and contract_id=con.id order by end_date desc limit 1) , con.end_date)) as DateEndextension ,
                     ins.insurance_no,
                     (select  b5.title from insurance LEFT JOIN baseinfo b5 ON insurance.insurance_company_id= b5.id  where 
                    contract_Id=con.id order by insurance.id desc limit 1) as insurance_company ,
      
                     ins.fund,
                     (select  b3.title from insurance LEFT JOIN baseinfo b3 ON insurance.insurance_type_id= b3.id  where 
                       contract_Id=con.id order by insurance.id desc limit 1) as insurance_type_id ,
                     g2j(ins.start_date+ 1) as ins_start_date,
                     g2j(ins.end_date+ 1) as ins_end_date,
                     (select STRING_AGG(title, ', ') from baseinfo where  id= ANY (ARRAY[ins.buy_close_id])) as buy_close,
                     ins.price,
                     ins.file_contract,
                     insApp.insurance_id,
                     g2j(insApp.start_date+ 1) as insApp_start_date ,
                     g2j(insApp.end_date+ 1) as insApp_end_date ,
                     insApp.price as price_2,
                     insApp.file_contract file_contractas ,
                      g2j(coalesce((select end_date from insurance_Appendix where contract_id=con.id order by end_date desc limit 1) , ins.end_date)) as DateExpire ,
                    
            g2j(coalesce((select end_date from insurance_Appendix where contract_id=con.id order by end_date desc limit 1) , ins.end_date))::date -
             g2j(coalesce((select end_date from Extension where type_id=2 and contract_id=con.id order by end_date desc limit 1) , con.end_date))::date  as
            TimeToExpire 
  
  From insurance as ins  LEFT JOIN contract as con  ON  ins.contract_id =con.id
                      LEFT JOIN insurance_Appendix as insApp  ON  ins.contract_id =insApp.contract_id
                       LEFT JOIN baseinfo b2 ON con.contract_type_id = b2.id 
                       LEFT JOIN company as co  ON con.company_id =co.id
                          LEFT JOIN town  ON con.town_id =town.id
                       LEFT JOIN baseinfo b4 ON town.province_id = b4.id
             `},
  


         
             { key: 'contractCycle', query:` 
             select
               ROW_NUMBER () OVER (ORDER BY cc.id),
                b3.title as province,
                town.title as town,
               con.title,
              con.contract_no,
              co.title as company,
              con.duration,
			        (coalesce (con.duration +(select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) ,con.duration))  as  ex_total_duration ,
             con.warranty_duration,
             (select  g2j(commission_date+ 1)  from tender  where tender.Id=con.tender_id order by tender.id  desc limit 1) as tender_commission_date , 
             (select  commission_date  from tender  where tender.Id=con.tender_id  order by tender.id  desc limit 1)::date- (coalesce (con.announcement_date ,current_date)) ::date as CommissionToAnnouncement,	
                   
             g2j(con.announcement_date+ 1) as announcement_date  ,
             con.land_delivery_date::date - (coalesce (con.announcement_date ,current_date)) ::date as AnnouncementToland_delivery,
             g2j(con.land_delivery_date+ 1),
               
     
           (select (Period.start_date) from weekly_Operation LEFT JOIN Period  ON weekly_Operation.period_id=Period.id
                where contract_Id=con.id order by weekly_Operation.id ASC limit 1)::date -(con.land_delivery_date)::date as land_deliveryToDate,
           (select g2j(Period.start_date) from weekly_Operation LEFT JOIN Period  ON weekly_Operation.period_id=Period.id
                where contract_Id=con.id order by weekly_Operation.id ASC limit 1) as start_date_Operation ,
      
          (select g2j(Period.end_date) from weekly_Operation LEFT JOIN Period  ON weekly_Operation.period_id=Period.id
                where contract_Id=con.id order by weekly_Operation.id desc limit 1) as end_date_Operation ,
                
        '*****' as ee,
               
 
          (select  round(sum(CASE WHEN x.value_change<>0 then ((x.done/x.value_change)*wieght)else 0 end)::numeric, 2)
                from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
              ,(select sum(d.current_done) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
               from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                 where c.id=con.id
                   group by c.title) as  pishraft_phisical ,
 
      DATE_PART('day', (coalesce((select  (end_date)  from extension  where contract_Id=con.id order by end_date desc limit 1 ),con.end_date))- NOW())  as re,
      g2j(con.land_delivery_date  + (coalesce (con.duration +(select sUM(duration) from extension  where contract_Id=con.id GROUP BY  contract_Id ) ,con.duration)) * interval '1 day')  as ex_end_date ,			 
     
      '*****' as CE,
      
      (select  g2j(commision_date+ 1)  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1) as td_commision_date ,
                
      (select case  with_defect  when  TRUE  then   'بله' when  FALSE   then   'خیر'  end  as td_with_defect    from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1),
      (select  g2j(remove_defect_date+ 1)  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1) as td_remove_defect_date ,
      (select  g2j(elimination_defects_date+ 1)  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1) as td_elimination_defects_date ,
 
      '*****' as ll,

       g2j( con.warranty_duration + con.announcement_date)  as Datewarranty,
      
       '*****' as nn,
            
      (select  g2j(commision_date+ 1)  from Delivery  where contract_Id=con.id order by Delivery.commision_date  desc limit 1) as tm_commision_date ,
      (select  g2j(warranty_letter_date+ 1)  from temp_Delivery  where contract_Id=con.id order by temp_Delivery.commision_date  desc limit 1) as tm_warranty_letter_date ,
      (select  g2j(free_letter_date+ 1)  from  Delivery  where contract_Id=con.id order by  Delivery.commision_date  desc limit 1) as D_free_letter_date 
               
 
 
                            From contract_cycle  as cc 
                            LEFT JOIN contract  as con ON cc.contract_id =con.id
                            LEFT JOIN town  ON con.town_id =town.id
                             LEFT JOIN company as co  ON con.company_id =co.id
                             LEFT JOIN baseinfo b3 ON town.province_id = b3.id`},
 
 
                                
            { key: 'projectCycle', query:`
            select
            ROW_NUMBER () OVER (ORDER BY pc.id),
             b3.title as province,
             town.title as town,
             Ag.title,
             Ag.contract_no,
             co.title as company,
             Ag.duration,
            (select  total_duration  from extension  where contract_Id=Ag.id order by no_id  desc limit 1) as ex_total_duration ,
           '*****' as vbg,
            (select  g2j(commission_date+ 1)  from tender  where tender.Id=Ag.tender_id  order by tender.id  desc limit 1) as tender_commission_date , 
             
            (select  g2j(commission_date+ 1)  from tender  where tender.Id=Ag.tender_id  order by tender.id  desc limit 1)::date - g2j(Ag.announcement_date+ 1)::date as CommissionToAnnouncement,
 
           g2j(Ag.announcement_date+ 1) as announcement_date,
           g2j(Ag.announcement_date+ 1)::date - g2j(Ag.land_delivery_date+ 1)::date as AnnouncementToland_delivery,
 
           g2j(Ag.land_delivery_date+ 1) as land_delivery_date,
              
      
          g2j(Ag.land_delivery_date)::date - (select (Period.start_date) from weekly_Operation LEFT JOIN Period  ON weekly_Operation.period_id=Period.id
                     where contract_Id=Ag.id order by weekly_Operation.id ASC limit 1)::date as land_deliveryToDate,
                      (select g2j(Period.start_date) from weekly_Operation LEFT JOIN Period  ON weekly_Operation.period_id=Period.id
                     where contract_Id=Ag.id order by weekly_Operation.id ASC limit 1) as start_date_Operation ,
           
          (select g2j(Period.end_date) from weekly_Operation LEFT JOIN Period  ON weekly_Operation.period_id=Period.id
                     where contract_Id=Ag.id order by weekly_Operation.id desc limit 1) as end_date_Operation ,
          '*****' as ee,
          '*****' as ff,
            (select round(sum(((x.done-x.value_change)*wieght/100))::numeric, 2)as pishraft
                    from contract as c left join(select w.contract_id,b1.title as operation,b2.title as unit  ,wieght,value_change
                  ,(select round(sum(d.current_done)::numeric, 2) from weekly_operation as m left join weekly_operation_detail as d on m.id=d.parent_id
                  where m.contract_id=w.contract_id and d.operation=b1.title and d.unit=b2.title) as done
                 from wbs as w join operation as b1 on w.operation_id= b1.id join baseinfo as b2 on w.unit_id=b2.id) as x on c.id=x.contract_id
                 where c.id=Ag.id
                group by c.title)  as  pishraft_phisical ,
 
         '*****' as RE,
         (select  g2j(end_date+ 1) from extension  where contract_Id=Ag.id order by no_id  desc limit 1) as ex_end_date , 
              
        '*****' as kk,
         (select  with_defect  from temp_Delivery  where contract_Id=Ag.id order by temp_Delivery.id  desc limit 1) as td_with_defect ,
        (select  g2j(remove_defect_date+ 1)  from temp_Delivery  where contract_Id=Ag.id order by temp_Delivery.id  desc limit 1) as td_remove_defect_date ,
         (select  g2j(elimination_defects_date+ 1)  from temp_Delivery  where contract_Id=Ag.id order by temp_Delivery.id  desc limit 1) as td_elimination_defects_date ,
  
        '*****' as ll,
       '*****' as nkn,  
        '*****' as nn,   
      (select  g2j(commision_date+ 1)  from Delivery  where contract_Id=Ag.id order by Delivery.id  desc limit 1) as tm_commision_date ,
       (select  g2j(warranty_letter_date+ 1)  from temp_Delivery  where contract_Id=Ag.id order by temp_Delivery.id  desc limit 1) as tm_warranty_letter_date ,
      (select  g2j(free_letter_date+ 1)  from  Delivery  where contract_Id=Ag.id order by  Delivery.id  desc limit 1) as D_free_letter_date 
             
  
  
                        From project_cycle  as pc 
                          LEFT JOIN agreement  as Ag ON pc.contract_id =Ag.id
                          left join town  on town.id=ANY (Ag.town_id)
                          LEFT JOIN company as co  ON Ag.company_id =co.id
                           LEFT JOIN baseinfo b3 ON town.province_id = b3.id
                                     
                                    `},
                 
                
     
     




];

module.exports ={queries}