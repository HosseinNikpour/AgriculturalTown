import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
   { dataIndex: 'id',key: 'id', title: 'شناسه ' },
   { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
   { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان  ' }, 
   { dataIndex: 'vw_file_agreement',key: 'vw_file_agreement', title: ' قرارداد ',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''}  },
  // { dataIndex: 'prev',key: 'prev', title: 'شماره آخرین صورت وضعیت تایید شده مدیر طرح' },
 //{ dataIndex: 'prev_price',key: 'prev_price', title: 'مبلغ آخرین صورت وضعیت تایید شده مدیر طرح', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  },
   { dataIndex: 'no',key: 'no', title: 'شماره صورت وضعیت فعلی' }, 
   { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع دوره کارکرد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
   { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان دوره کارکرد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
  // { dataIndex: 'contractor_price',key: 'contractor_price', title: 'مبلغ تجمعی ارائه شده پیمانکار' , render: function (text) { return  text?parseInt(text).toLocaleString():0 }   }, 
  // { dataIndex: 'consultant_price',key: 'consultant_price', title: 'مبلغ تجمعی تایید نظارت' , render: function (text) { return  text?parseInt(text).toLocaleString():0 }  },
  { dataIndex: 'manager_price',key: 'manager_price', title: 'مبلغ تجمعی تایید مدیر طرح', render: function (text) { return  text?parseInt(text).toLocaleString():0 }    }, 
   // { dataIndex: 'period_price',key: 'period_price', title: 'کارکرد دوره' }, 
//{ dataIndex: 'letter_date_manager',key: 'letter_date_manager', title: 'تاریخ نامه مدیر طرح به معاون فنی' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//{ dataIndex: 'letter_no_manager', key: 'letter_no_manager', title: 'شماره نامه مدیر طرح' },
//{ dataIndex: 'letter_date_branch',key: 'letter_date_branch', title: 'تاریخ نامه مدیر شعبه' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//{ dataIndex: 'letter_no_branch', key: 'letter_no_branch', title: 'شماره نامه مدیر شعبه' },
   { dataIndex: 'file_invoice',key: 'file_invoice', title: 'روکش صورت وضعیت',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
   // { dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },

    // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
    // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
    // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
    // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "invoiceContractor";
export const pageHeder = 'صورت وضعیت - مدیر طرح';

export const emptyItem = { contract_id : ''  ,prev_id : '' ,prev_price : '' ,no_id : '' ,start_date : '' ,letter_no_branch: '' ,letter_no_manager: '' ,end_date : '' ,contractor_price : '' ,consultant_price : '' ,manager_price : '' ,period_price : '' 
,file_invoice : '' ,decsciption : '' ,consultant_letter_date : '' ,contractor_letter_date : '' ,file_letter_manager : '' ,};


