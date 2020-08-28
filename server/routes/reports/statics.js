const queries = [
    { key: 'company', query:`SELECT full_title,meli_code,economic_code , registration_number,'******' AS D,'******' AS C,contract.contract_no as contract_no,b2.title as registration_province,
               b1.title as province, city,address ,b3.title as certificate_type_id, rating1,rating2,postalcode ,tell, company.fax, company.email
       FROM company LEFT JOIN baseinfo b1 ON company.province_id = b1.id
           LEFT JOIN baseinfo b2 ON company.registration_province_id = b2.id
           LEFT JOIN baseinfo b3 ON company.certificate_type_id = b3.id
           LEFT JOIN  contract  on contract.company_id=company.id`},


                               
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
  --select g2j(now())
  select town.province_id,town.title as town,con.title,
  b6.title as operation_type,
 con.contract_no,co.title as company,
 (select  co.title from  company as co  where con.colleague1_id=co.id order by co.id desc limit 1) as  colleague1,
 (select  co.title from  company as co  where con.colleague2_id=co.id order by co.id desc limit 1) as  colleague2,
  b2.title as contract_type,
 (select  b3.title from contract_cycle LEFT JOIN baseinfo b3 ON contract_cycle.state_id= b3.id  where contract_Id=con.id order by contract_cycle.id desc limit 1) as state_id ,
 (select g2j(date) from contract_cycle  where contract_Id=con.id order by contract_cycle.id desc limit 1 ) as cc_date,
  g2j(con.contract_date) as contract_date ,g2j(con.announcement_date) as con_announcement_date ,
  g2j(con.land_delivery_date) as con_land_delivery_date,g2j(con.end_date) as con_end_date,
  (select  g2j(end_date) from extension  where contract_Id=con.id order by no_id  desc limit 1) as ex_end_date , 
  (select  g2j(commision_date) from temp_Delivery  where contract_Id=con.id order by temp_Delivery.id desc limit 1) as td_commision_date,
  (select  g2j(commision_date) from Delivery  where contract_Id=con.id order by  Delivery.id desc limit 1) as D_commision_date,
  con.duration,
  (select duration from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_duration ,  
  (select total_duration from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_total_duration ,
  (select allow_late from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_allow_late ,

  con.initial_amount,con.client_initial_amount,
  (select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) as contract_new_price ,

  (select title from agreement as ag where con.monitoring_agreement_id=ag.id order by ag.id desc limit 1) as monitoring,
  (select title from agreement as ag where con.study_agreement_id=ag.id order by ag.id desc limit 1) as study,

  (select g2j(start_date) from insurance  where contract_Id=con.id order by insurance.id desc limit 1) as ins_start_date,
  (select g2j(end_date) from insurance  where contract_Id=con.id order by insurance.id desc limit 1) as ins_end_date,
  (select g2j(start_date) from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.id desc limit 1) as insApp_start_date,
  (select g2j(end_date) from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.id desc limit 1) as insApp_end_date,
  (select  b7.title from insurance LEFT JOIN baseinfo b7 ON insurance.insurance_company_id=b7.id  where contract_Id=con.id order by insurance.id desc limit 1) asins_insurance_company ,
  (select fund from insurance where contract_Id=con.id order by insurance.id desc limit 1) as ins_fund,
  (select price from insurance where contract_Id=con.id order by insurance.id desc limit 1) as ins_price,
  (select price from insurance_Appendix where contract_Id=con.id order by insurance_Appendix.id desc limit 1) as insApp_price,
  '******' as c,
  (select no_id from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_no_id ,
  (select letter_no from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_letter_no , 
  (select g2j(letter_date) from extension  where contract_Id=con.id order by no_id desc limit 1) as ex_letter_date , 
  con.project_manager_name,con.project_manager_contacts, '******' as d, '******' as e,
  (select  b4.title from Invoice_Contractor LEFT JOIN baseinfo b4 ON Invoice_Contractor.no_id= b4.id  where contract_Id=con.id order by Invoice_Contractor.id desc limit 1) as  MaxInvoice,
   (select  b5.title from invoice_contractor_pay  LEFT JOIN baseinfo b5 ON invoice_contractor_pay.no_id= b5.id where contract_Id=con.id order by invoice_contractor_pay.id desc limit 1) as  MaxInvoicePay,
   (select g2j(end_date) from invoice_contractor where contract_Id=con.id order by invoice_contractor.id desc limit 1) as end_date, 
   (select manager_price from invoice_contractor where contract_Id=con.id order by invoice_contractor.id desc limit 1) as manager_price,
   (select price from invoice_contractor_pay where contract_Id=con.id order by invoice_contractor_pay.id desc limit 1) as price
  
    ,'******' as d,'******' as e,'******' as f,
    '******' as g,'******' as h,'******' as i,
    '******' as j,'******' as k,'******' as l,
	'******' as m,'******' as n
  
     From contract as con  LEFT JOIN town  ON con.town_id =town.id
     LEFT JOIN company as co  ON con.company_id =co.id
     LEFT JOIN baseinfo b2 ON con.contract_type_id = b2.id
      left join baseinfo b6 on b6.id=ANY ( con.operation_type_id)


`},





       { key: 'agreement', query:` --select g2j(now())
       select  
       '******',
       select  
       '******',
       (select STRING_AGG(title, ', ') from town where  id= ANY (ARRAY[Ag.town_id])) as town,
       Ag.title,
       (select STRING_AGG(title, ', ') from baseinfo where  id= ANY (ARRAY[Ag.operation_type_id])) as operation_type,
       Ag.contract_no,co.title as company,
      (select  co.title from  company as co  where Ag.colleague1_id=co.id order by co.id desc limit 1) as  colleague1,
      (select  co.title from  company as co  where Ag.colleague2_id=co.id order by co.id desc limit 1) as  colleague2,
       b2.title as contract_type,
       (select  b3.title from project_cycle LEFT JOIN baseinfo b3 ON project_cycle.state_id= b3.id  where contract_Id=Ag.id order by project_cycle.id desc limit 1) as state_id ,
       (select g2j(date) from project_cycle  where contract_Id=Ag.id order by project_cycle.id desc limit 1 ) as PC_date,
       g2j(Ag.contract_date) as contract_date ,
       g2j(Ag.announcement_date) as Ag_announcement_date ,
       g2j(Ag.end_date) as Ag_end_date,
       (select  g2j(end_date) from extension  where contract_Id=Ag.id order by no_id  desc limit 1) as ex_end_date , 
       Ag.duration,
       (select duration from extension  where contract_Id=Ag.id order by no_id desc limit 1) as ex_duration ,  
       (select total_duration from extension  where contract_Id=Ag.id order by no_id desc limit 1) as ex_total_duration ,
       Ag.initial_amount,
       Ag.client_initial_amount,
       (select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) as contract_new_price ,
	   (select  b4.title from extension LEFT JOIN baseinfo b4 ON extension.no_id= b4.id  where contract_Id=Ag.id order by extension.id desc limit 1) as   no_id,
       (select letter_no from extension  where contract_Id=Ag.id order by no_id desc limit 1) as ex_letter_no , 
       (select g2j(letter_date) from extension  where contract_Id=Ag.id order by no_id desc limit 1) as ex_letter_date , 
       Ag.study_surface,
       Ag.study_surface_final,
       Ag.mapping_surface,
       Ag.mapping_surface_final,
       '******','******', 
       (select  b4.title from invoice_Consultant LEFT JOIN baseinfo b4 ON invoice_Consultant.no_id= b4.id where contract_Id=Ag.id order by invoice_Consultant.id desc limit 1) as  MaxInvoice,
	 (select  b5.title from invoice_Consultant_pay  LEFT JOIN baseinfo b5 ON invoice_Consultant_pay.no_id= b5.id where contract_Id=Ag.id order by invoice_Consultant_pay.id desc limit 1) as  MaxInvoicePay,
       (select  g2j(end_date) from invoice_Consultant where contract_Id=Ag.id order by invoice_Consultant.id desc limit 1) as end_date, 
       (select manager_price from invoice_Consultant where contract_Id=Ag.id order by invoice_Consultant.id desc limit 1) as manager_price,
       (select price from invoice_Consultant_pay where contract_Id=Ag.id order by invoice_Consultant_pay.id desc limit 1) as price,
        Ag.project_manager_name,Ag.project_manager_contacts
       
                   From agreement as Ag 
                                   LEFT JOIN company as co  ON Ag.company_id =co.id
                                  LEFT JOIN baseinfo b2 ON Ag.contract_type_id = b2.id`},





    { key: 'valueChange', query:` --select g2j(now())   
    select 
(select b3.title from town  LEFT JOIN baseinfo b3 ON town.province_id = b3.id  where contract_Id=con.id order by town.id desc limit 1)  as province, 
(select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where contract_Id=con.id order by town_id desc limit 1) as town ,
con.contract_no,con.title,con.initial_amount,b2.title as no_id,vc.increase_price,
    vc.decrease_price,new_work,change_price,contract_new_price,increase_price_percent,decrease_price_percent,new_work_percent,
    change_price_percent,has_license,has25, '******' as a, '******' as b
    
                    From value_Change as vc 
                          LEFT JOIN contract  as con ON vc.contract_id =con.id
                          LEFT JOIN baseinfo b2 ON vc.no_id = b2.id`},
                               

 { key: 'tender', query:`--select g2j(now())
 select  ROW_NUMBER () OVER (ORDER BY tn.id),tn.title,
town.title as town,town.province_id,
town.city,
b1.title as group_id , b2.title as type_id, b3.title as service_type,
(select STRING_AGG(title, ', ') from baseinfo where  id= ANY (ARRAY[tn.operation_type_id])) as operation_type,
b4.title as modifier_type,g2j(commission_date),
 b5.title as commission_result, b6.title as invite_method, b7.title as call_method,recommender_count,tender_no,invite_no,
'******',g2j(invite_date),init_amount,first_winner_name,first_winner_amount,second_winner_name,
second_winner_amount,'******','******',tn.description,'******','******','******','******','******'

From tender as tn  LEFT JOIN town  ON tn.town_id =town.id
                   LEFT JOIN baseinfo b1 ON  tn.group_id = b1.id
				   LEFT JOIN baseinfo b2 ON  tn.type_id = b2.id
				   LEFT JOIN baseinfo b3 ON  tn.service_type_id = b3.id
				   LEFT JOIN baseinfo b4 ON  tn.modifier_type_id = b4.id
				   LEFT JOIN baseinfo b5 ON  tn.commission_result_id = b5.id
				   LEFT JOIN baseinfo b6 ON  tn.invite_method_id = b6.id
				   LEFT JOIN baseinfo b7 ON  tn.call_method_id = b7.id


   `},



{ key: 'invoiceContractor', query:` --select g2j(now())

select
(select b3.title from town  LEFT JOIN baseinfo b3 ON town.province_id = b3.id  where contract_Id=con.id order by town.id desc limit 1)  as province, 
(select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where contract_Id=con.id order by town_id desc limit 1) as town ,
con.title,con.contract_no,b2.title as contract_type, co.title as company,con.initial_amount,
(select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) as contract_new_price ,
(select  b5.title from Invoice_Contractor LEFT JOIN baseinfo b5 ON Invoice_Contractor.no_id= b5.id  
    where contract_Id=con.id order by Invoice_Contractor.id desc limit 1) as no_id,
(select  b6.title from value_Change LEFT JOIN baseinfo b6 ON value_Change.no_id= b6.id  
    where contract_Id=con.id order by value_Change.id desc limit 1) as no_valueChange,
(select  g2j(start_date) from invoice_contractor  where contract_Id=con.id order by no_id  desc limit 1) as inv_start_date  , 
(select  g2j(end_date) from invoice_contractor  where contract_Id=con.id order by no_id  desc limit 1) as inv_end_date ,
(select manager_price  from invoice_contractor  where contract_Id=con.id order by no_id desc limit 1) as inv_manager_price ,
(select period_price  from invoice_contractor  where contract_Id=con.id order by no_id desc limit 1) as inv_period_price ,
(select prev_price  from invoice_contractor_approve  where contract_Id=con.id order by no_id desc limit 1) as inv_app_prev_price ,
(select period_price  from invoice_contractor_approve  where contract_Id=con.id order by no_id desc limit 1) as inv_app_period_price ,
(select price  from invoice_contractor_pay  where contract_Id=con.id order by no_id desc limit 1) as inv_pay_price ,
(select period_price  from invoice_contractor_pay  where contract_Id=con.id order by no_id desc limit 1) as inv_pay_period_price ,
(select g2j(letter_date_branch)  from invoice_contractor  where contract_Id=con.id order by no_id desc limit 1) as inv_letter_date_branch ,
(select g2j(letter_date_manager)  from invoice_contractor  where contract_Id=con.id order by no_id desc limit 1) as inv_letter_date_manager ,
(select g2j(letter_date_employer)  from invoice_contractor_approve  where contract_Id=con.id order by no_id desc limit 1) as inv_app_letter_date_employer  ,
(select g2j(letter_date_secretariat)  from invoice_contractor_pay  where contract_Id=con.id order by no_id desc limit 1) as inv_pay_letter_date_secretariat  ,
(select g2j(pay_date)  from invoice_contractor_pay  where contract_Id=con.id order by no_id desc limit 1) as inv_pay_pay_date ,
(select letter_no_branch  from invoice_contractor  where contract_Id=con.id order by no_id desc limit 1) as inv_letter_no_branch ,
(select letter_no_manager  from invoice_contractor  where contract_Id=con.id order by no_id desc limit 1) as letter_no_manager ,
(select letter_no_employer  from invoice_contractor_approve  where contract_Id=con.id order by no_id desc limit 1) as inv_app_letter_no_employer ,
(select b4.title  from invoice_contractor_pay LEFT JOIN baseinfo b4 ON invoice_contractor_pay.type_id = b4.id  where contract_Id=con.id order by no_id desc limit 1) as inv_pay_type_id ,
(select g2j(credit_date) from invoice_contractor_pay  where contract_Id=con.id order by no_id desc limit 1) as inv_pay_credit_date 
,'******', '******','******', '******'
 From  invoice_contractor as inv
       LEFT JOIN contract  as con ON inv.contract_id =con.id
	   LEFT JOIN baseinfo b2 ON con.contract_type_id = b2.id 
       LEFT JOIN company as co  ON con.company_id =co.id`},




       { key: 'invoiceConsultant', query:` --select g2j(now())   
       select
       (select b3.title from town  LEFT JOIN baseinfo b3 ON town.province_id = b3.id  where contract_Id=Ag.id  order by town.id desc limit 1)  as province, 
       
       (select STRING_AGG(title, ', ') from town where  id= ANY (ARRAY[Ag.town_id])) as town,
       
       Ag.title,Ag.contract_no,b2.title as contract_type, co.title as company,Ag.initial_amount,
       (select contract_new_price from value_Change  where contract_Id=Ag.id order by no_id desc limit 1) as contract_new_price ,
       (select  b5.title from invoice_consultant LEFT JOIN baseinfo b5 ON invoice_consultant.no_id= b5.id  
           where contract_Id=ag.id order by invoice_consultant.id desc limit 1) as no_id,
       (select  b6.title from value_Change LEFT JOIN baseinfo b6 ON value_Change.no_id= b6.id  
           where contract_Id=ag.id order by value_Change.id desc limit 1) as no_valueChange,
       (select  g2j(start_date) from invoice_consultant  where contract_Id=Ag.id order by no_id  desc limit 1) as inv_start_date  , 
       (select  g2j(end_date) from invoice_consultant  where contract_Id=Ag.id order by no_id  desc limit 1) as inv_end_date ,
       (select manager_price  from invoice_consultant  where contract_Id=Ag.id order by no_id desc limit 1) as inv_manager_price ,
       (select period_price  from invoice_consultant  where contract_Id=Ag.id order by no_id desc limit 1) as inv_period_price ,
       (select price  from invoice_consultant_approve  where contract_Id=Ag.id order by no_id desc limit 1) as inv_app_price ,
       (select period_price  from invoice_consultant_approve  where contract_Id=Ag.id order by no_id desc limit 1) as inv_app_period_price ,
       (select price  from invoice_consultant_pay  where contract_Id=Ag.id order by no_id desc limit 1) as inv_pay_price ,
       (select period_price  from invoice_consultant_pay  where contract_Id=Ag.id order by no_id desc limit 1) as inv_pay_period_price ,
       (select g2j(letter_date_branch)  from invoice_consultant  where contract_Id=Ag.id order by no_id desc limit 1) as inv_letter_date_branch ,
       (select g2j(letter_date_manager)  from invoice_consultant  where contract_Id=Ag.id order by no_id desc limit 1) as inv_letter_date_manager ,
       (select g2j(letter_date_employer)  from invoice_consultant_approve  where contract_Id=Ag.id order by no_id desc limit 1) as inv_app_letter_date_employer  ,
       (select g2j(letter_date_secretariat)  from invoice_consultant_pay  where contract_Id=Ag.id order by no_id desc limit 1) as inv_pay_letter_date_secretariat  ,
       (select g2j(pay_date)  from invoice_consultant_pay  where contract_Id=Ag.id order by no_id desc limit 1) as inv_pay_pay_date ,
       (select letter_no_branch  from invoice_consultant  where contract_Id=Ag.id order by no_id desc limit 1) as inv_letter_no_branch ,
       (select letter_no_manager  from invoice_consultant  where contract_Id=Ag.id order by no_id desc limit 1) as letter_no_manager ,
       (select letter_no_employer  from invoice_consultant_approve  where contract_Id=Ag.id order by no_id desc limit 1) as inv_app_letter_no_employer ,
       (select b4.title  from invoice_consultant_pay LEFT JOIN baseinfo b4 ON invoice_consultant_pay.type_id = b4.id  where contract_Id=Ag.id order by no_id desc limit 1) as inv_pay_type_id ,
       (select g2j(credit_date) from invoice_consultant_pay  where contract_Id=Ag.id order by no_id desc limit 1) as inv_pay_credit_date 
       ,'******', '******','******', '******'
        From  invoice_consultant as inv
              LEFT JOIN agreement  as Ag ON inv.contract_id =Ag.id
              LEFT JOIN baseinfo b2 ON Ag.contract_type_id = b2.id 
              LEFT JOIN company as co  ON Ag.company_id =co.id`},








       { key: 'creditPredict', query:` --select g2j(now())   
       select 
       ROW_NUMBER () OVER (ORDER BY cp.id),
       con.title,con.contract_no,g2j(start_date) as startDate,g2j(cp.end_date) as endDate,con.initial_amount,
       (select contract_new_price from value_Change  where contract_Id=con.id order by no_id desc limit 1) as contract_new_price,
       (select change_price_percent from value_Change  where contract_Id=con.id order by no_id desc limit 1) as change_price_percent ,
       cp.invoice_paid_price,cp.invoice_paid_period,g2j(invoice_paid_date),cp.invoice_approved_price,cp.invoice_approved_period,g2j(invoice_approved_date),
       cp.start_date-cp.invoice_approved_date as  datecalculate,cp.price_until_now,'******',cp.price_until_end,'******','******'
       
        From  credit_Predict as cp
              LEFT JOIN contract  as con ON cp.contract_id =con.id`},
          
              


              
       { key: 'weeklyOperation', query:` --select g2j(now())   
       select 
       ROW_NUMBER () OVER (ORDER BY wo.id),
       (select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where contract_Id=con.id order by town_id desc limit 1) as town ,
       con.title,
       con.contract_no,
       co.title as company,
       (select operation.title from wbs   LEFT JOIN operation ON  wbs.operation_id= operation.id   where contract_Id=con.id order by wbs.id desc limit 1) as operation ,
       (select b2.title from wbs   LEFT JOIN baseinfo b2 ON  wbs.unit_id= b2.id   where contract_Id=con.id order by wbs.id desc limit 1) as unit ,
       (select price from wbs where contract_Id=con.id order by wbs.id desc limit 1) as price,
       (select wieght from wbs where contract_Id=con.id order by wbs.id desc limit 1) as wieght, 
       '******',
       weekly_operation_detail.cumulative_done,
       (select  b3.title from contract_cycle LEFT JOIN baseinfo b3 ON contract_cycle.state_id= b3.id  where contract_Id=con.id order by contract_cycle.id desc limit 1) as state_id ,
       period.title  as period
       /*,g2j(period.start_date) as start_date ,
       g2j(period.end_date) as */
       
       
          From  weekly_operation  as wo
          LEFT JOIN contract  as con ON  wo.contract_id =con.id
          LEFT JOIN weekly_operation_detail ON  wo.id =weekly_operation_detail.parent_id
          LEFT JOIN period  ON  wo.period_id =period.id
          LEFT JOIN company as co  ON con.company_id =co.id`},
     
              
            

      { key: ' weekly_Weather', query:` --select g2j(now())   
      
      select 
      ROW_NUMBER () OVER (ORDER BY weekly_Weather.id),
      (select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where weekly_Weather.contract_Id=con.id order by town_id desc limit 1) as town ,
      con.title,
      con.contract_no,
      co.title as company,
       period.title,g2j(period.start_date) as start_date ,g2j(period.end_date) as end_date,
      
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
         






            { key: 'studyOperation', query:` --select g2j(now())   
            
             select 
            ROW_NUMBER () OVER (ORDER BY so.id),
            (select town.title from contract as con  LEFT JOIN town  ON con.town_id =town.id   where contract_Id=con.id order by town_id desc limit 1) as town ,
            con.title,
           con.contract_no,
           co.title as company,
           '******',
           '******',
           '******',
           '******',
           '******',
           '******'
                From  study_operation as so
                   LEFT JOIN contract  as con ON  so.contract_id =con.id
	               LEFT JOIN study_operation_detail ON  so.id =study_operation_detail.parent_id
                   LEFT JOIN company as co  ON con.company_id =co.id`}



                     
];

module.exports ={queries}