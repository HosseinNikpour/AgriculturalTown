import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
   { dataIndex: 'id',key: 'id', title: 'شناسه ' },
   { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
   { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان  ' },
   { dataIndex: 'vw_file_agreement',key: 'vw_file_agreement', title: ' قرارداد ' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''}  },
   { dataIndex: 'vw_contract_type',key: 'vw_contract_type', title: ' نوع قرارداد ' },
//{dataIndex: 'prev_approve_id',key: 'prev_approve_id', title: 'شماره آخرین صورت حساب تایید شده دفتر فنی' }, 
//{dataIndex: 'prev_id',key: 'prev_id', title: 'شماره آخرین صورت حساب پرداخت شده مالی' },
// {dataIndex: 'prev_approve_price',key: 'prev_approve_price', title: 'مبلغ آخرین صورت حساب تایید شده دفتر فنی', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  }, 
 //{dataIndex: 'prev_price',key: 'prev_price', title: 'شماره آخرین صورت حساب پرداخت شده مالی', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  },
 {dataIndex: 'no',key: 'no', title: 'شماره صورت حساب فعلی' },
 {dataIndex: 'price',key: 'price', title: 'مبلغ قابل پرداخت تجمعی', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  }, 
 //{ dataIndex: 'period_price',key: 'period_price', title: 'مبلغ قابل پرداخت در دوره', render: function (text) { return  text?parseInt(text).toLocaleString():0 }  },
 //{ dataIndex: 'letter_no_approve', key: 'letter_no_approve', title: 'شماره نامه تایید دفتر فنی کارفرما' },
 //{ dataIndex: 'letter_date_secretariat',key: 'letter_date_secretariat', title: 'تاریخ نامه دریافت از دبیرخانه' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 //{ dataIndex: 'pay_date',key: 'pay_date', title: 'تاریخ سند پرداخت' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } }, 
 //{ dataIndex: 'type',key: 'type', title: 'نوع پرداخت' },
    //{dataIndex: 'Credit_date',key: 'Credit_date', title: 'تاریخ سررسید اسناد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } }, 
    { dataIndex: 'file_invoice',key: 'file_invoice', title: 'بارگذاری سند مالی',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
  //{dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },
    // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
    // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
    // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
    // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "invoiceConsultantPay";
export const pageHeder = 'صورت حساب - پرداخت ';

export const emptyItem = { contract_id : '' ,prev_approve_id : '' ,prev_id : '' ,prev_approve_price : '' ,prev_price : '' ,
no_id : '' ,price : '' ,period_price : '' ,pay_date : '' ,type_id : '' ,letter_no_approve: '' , decsciption : '' ,};


