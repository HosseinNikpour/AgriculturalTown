import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
   { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
    { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
    { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان' }, 
    //{ dataIndex: 'insurance',key: 'insurance', title: 'بیمه پیمان' },
    { dataIndex: 'vw_insurance_company',key: 'vw_insurance_company', title: 'نام بیمه گر ' },
    { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  },
    { dataIndex:'end_date',key: 'end_date', title: 'تاریخ پایان', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
    //{ dataIndex: 'price',key: 'price', title: 'مبلغ حق بیمه', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
    { dataIndex: 'file_contract',key: 'file_contract', title: 'قرارداد الحاقیه',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
    // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
   // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
   // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
   // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
   // { dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
   // { dataIndex: 'status',key: 'status', title: 'وضعیت' }
   ];
   export const storeIndex = "insuranceAppendix";
   export const pageHeder = 'الحاقیه بیمه';
   
   export const emptyItem = {
    contract_id : '' ,insurance_id : '' ,start_date : '' ,end_date : '' ,price : '' ,
   };