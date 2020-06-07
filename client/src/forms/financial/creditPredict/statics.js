import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
  { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان' },
  { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع' }, 
  { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان' },   
  { dataIndex: 'invoice_paid_price',key: 'invoice_paid_price', title: 'مبلغ تجمعی صورت وضعیت پرداخت شده' , render: function (text) { return  text?text.toLocaleString():0 }  },
  { dataIndex: 'invoice_paid_period',key: 'invoice_paid_period', title: 'دوره پرداخت' }, 
  { dataIndex: 'invoice_approved_price',key: 'invoice_approved_price', title: 'مبلغ تجمعی صورت وضعیت تایید شده', render: function (text) { return  text?text.toLocaleString():0 }   },
  { dataIndex: 'invoice_approved_period',key: 'invoice_approved_period', title: 'دوره تایید' }, 
  { dataIndex: 'price_until_now',key: 'price_until_now', title: 'برآورد مبلغ صورت وضعیت از آخرین دوره تایید تا دوره گزارش', render: function (text) { return  text?text.toLocaleString():0 }   },
  { dataIndex: 'price_until_end',key: 'price_until_end', title: 'برآورد مبلغ صورت وضعیت از دوره گزارش تا پایان کار', render: function (text) { return  text?text.toLocaleString():0 }   }, 
 // { dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },
  // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
  // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
   // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
   // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "creditPredict";
export const pageHeder = 'پیش بینی اعتبار';

export const emptyItem = {contract_id : '' ,start_date : '' ,end_date:'',invoice_paid_price : '' ,invoice_paid_period : '' ,invoice_approved_price : '' ,invoice_approved_period : '' ,price_until_now : '' ,price_until_end : '' ,decsciption : '' ,};


