import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
  { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
  { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان' },
  { dataIndex: 'vw_file_agreement',key: 'vw_file_agreement', title: ' قرارداد ' ,render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''}  },
  { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ گزارش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
  ////{ dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان' },   
  //{ dataIndex: 'invoice_paid_price',key: 'invoice_paid_price', title: 'مبلغ تجمعی صورت وضعیت پرداخت شده' , render: function (text) { return  text?parseInt(text).toLocaleString():0 }   },
 // { dataIndex: 'invoice_paid_period',key: 'invoice_paid_period', title: 'شماره آخرین صورت وضعیت پرداخت شده' }, 
 // { dataIndex: 'invoice_approved_price',key: 'invoice_approved_price', title: 'مبلغ تجمعی صورت وضعیت تایید شده', render: function (text) { return  text?parseInt(text).toLocaleString():0 }    },
  //{ dataIndex: 'invoice_approved_period',key: 'invoice_approved_period', title: 'شماره آخرین صورت وضعیت تایید شده ' }, 
  { dataIndex: 'price_until_now',key: 'price_until_now', title: 'برآورد مبلغ صورت وضعیت از آخرین تاریخ تایید تا تاریخ گزارش', render: function (text) { return  text?parseInt(text).toLocaleString():0 }    },
  { dataIndex: 'price_until_end',key: 'price_until_end', title: 'برآورد مبلغ صورت وضعیت از تاریخ گزارش تا پایان کار', render: function (text) { return  text?parseInt(text).toLocaleString():0 }    }, 
 // { dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },
 { dataIndex: 'invoice_paid_date',key: 'invoice_paid_date', title: 'تاریخ آخرین  صورت وضعیت پرداخت شده' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  },
 { dataIndex: 'invoice_approved_date',key: 'invoice_approved_date', title: 'تاریخ آخرین صورت وضعیت تایید شده' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
  // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
  // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
   // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
   // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "creditPredict";
export const pageHeder = 'پیش بینی اعتبار';

export const emptyItem = {contract_id : '' ,start_date : '' ,end_date:'',invoice_paid_price : '' ,invoice_paid_period : '' ,invoice_approved_price : '' ,invoice_approved_period : '' ,price_until_now : '' ,price_until_end : '' ,decsciption : '' ,};


