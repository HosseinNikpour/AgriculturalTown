import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
  { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
  { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
  //{ dataIndex: 'insurance_no',key: 'insurance_no', title: 'شماره بیمه نامه' },
  { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان' },
  { dataIndex: 'insurance_company',key: 'insurance_company', title: 'نام بیمه گر' }, 
 // { dataIndex: 'insurance_type',key: 'insurance_type', title: 'نوع بیمه' }, 
  { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
  { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
  { dataIndex: 'fund',key: 'fund', title: 'سرمایه بیمه شده', render: function (text) { return  text?parseInt(text).toLocaleString():0 } }, 
  // { dataIndex: 'buy_close_id',key: 'buy_close_id', title: 'کلوزهای خریداری شده' }, 
  { dataIndex: 'price',key: 'price', title: 'مبلغ حق بیمه', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
  { dataIndex: 'file_contract',key: 'file_contract', title: 'قرارداد بیمه ',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
  //{ dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
  //{ dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
  //{ dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 // { dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
 // { dataIndex: 'status',key: 'status', title: 'وضعیت' }
];
export const storeIndex = "insurance";
export const pageHeder = 'بیمه';

export const emptyItem = {
 insurance_no : '' ,contract_id : '' ,insurance_company_id : '' ,fund : '' ,insurance_type_id : '' ,start_date : '' ,end_date : '' ,buy_close_id : [] ,price : '' ,
};