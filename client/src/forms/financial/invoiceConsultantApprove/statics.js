

import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
   { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
   { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان  ' },
   { dataIndex: 'vw_file_agreement',key: 'vw_file_agreement', title: ' قرارداد ' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''}  },
   { dataIndex: 'vw_contract_type',key: 'vw_contract_type', title: ' نوع قرارداد ' },
// { dataIndex: 'prev_approve_id',key: 'prev_approve_id', title: 'شماره آخرین صورت حساب تایید شده  مدیر طرح' }, 
// { dataIndex: 'prev_id',key: 'prev_id', title: 'شماره آخرین صورت حساب تایید شده دفتر فنی' },
// { dataIndex: 'prev_approve_price',key: 'prev_approve_price', title: 'مبلغ آخرین صورت حساب تایید شده مدیر طرح', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  }, 
 //{ dataIndex: 'prev_price',key: 'prev_price', title: 'مبلغ آخرین صورت حساب تایید شده دفتر فنی', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  },
   { dataIndex: 'no',key: 'no', title: 'شماره صورت حساب فعلی' },
   { dataIndex: 'price',key: 'price', title: 'مبلغ قابل تایید دفتر فنی کارفرما', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  }, 
 //{ dataIndex: 'period_price',key: 'period_price', title: 'مبلغ قابل پرداخت در دوره', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  },
 
   //{dataIndex: 'letter_date_manager',key: 'letter_date_manager', title: 'تاریخ نامه مدیر طرح' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
  //{dataIndex: 'letter_no_manager', key: 'letter_no_manager', title: 'شماره نامه مدیر طرح' },
  {dataIndex: 'file_letter_manager',key: 'file_letter_manager', title: 'بارگذاری سند نامه مدیر طرح',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
  //{ dataIndex: 'letter_date_employer',key: 'letter_date_employer', title: 'تاریخ نامه تایید دفتر فنی کارفرما' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 //{dataIndex: 'letter_no_employer', key: 'letter_no_employer', title: 'شماره نامه دفتر فنی کارفرما' },
   { dataIndex: 'file_letter_employer',key: 'file_letter_employer', title: 'بارگذاری نامه دفتر فنی کارفرما به مالی',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 

 //{ dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },
 //{dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
 //{dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
 //{dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
 //{ dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "InvoiceConsultantApprove";
export const pageHeder = 'صورتحساب-تایید کارفرما';

export const emptyItem = { contract_id : '' ,prev_approve_id : '' ,prev_id : '' ,prev_approve_price : '' ,prev_price : '' ,no_id : '' ,approve_price : '' ,price : '' ,period_price : '' ,decsciption : '' ,};


