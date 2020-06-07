import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
  { dataIndex: 'insurance_no',key: 'insurance_no', title: 'شماره بیمه نامه' },
  { dataIndex: 'contract',key: 'contract', title: 'شماره قرارداد/پیمان' },
  { dataIndex: 'insurance_company',key: 'insurance_company', title: 'نام بیمه گر' }, 
  { dataIndex: 'fund',key: 'fund', title: 'سرمایه بیمه شده', render: function (text) { return  text?text.toLocaleString():0 } },
  { dataIndex: 'insurance_type',key: 'insurance_type', title: 'نوع بیمه' }, 
  { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
  { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
  // { dataIndex: 'buy_close_id',key: 'buy_close_id', title: 'کلوزهای خریداری شده' }, 
  { dataIndex: 'price',key: 'price', title: 'مبلغ حق بیمه', render: function (text) { return  text?text.toLocaleString():0 } },
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