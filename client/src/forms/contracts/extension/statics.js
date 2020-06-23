
import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
  { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
  { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
   { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان/قرارداد' }, 
   { dataIndex: 'vw_contract_title',key: 'vw_contract_title', title: 'عنوان پروژه ' },
   { dataIndex: 'no',key: 'no', title: 'شماره تمدید' }, 
   //{ dataIndex: 'letter_no',key: 'letter_no', title: 'شماره نامه ابلاغ تمدید' }, 
   //{ dataIndex: 'letter_date',key: 'letter_date', title: 'تاریخ نامه ابلاغ تمدید' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}}, 
   //{ dataIndex: 'total_duration',key: 'total_duration', title: 'جمع مدت اولیه پیمان به اضافه مدت تمدیدهای قبل' }, 
   { dataIndex: 'duration',key: 'duration', title: 'مدت تمدید شده ابلاغ فعلی' }, 
  // { dataIndex: 'end_date_calc',key: 'end_date_calc', title: 'تاریخ پایان ' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان ابلاغ فعلی' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   { dataIndex: 'allow_late',key: 'allow_late', title: 'مدت تاخیرات مجاز' }, 
   { dataIndex: 'file_signification',key: 'file_signification', title: 'سند ابلاغ تمدید',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
    //{ dataIndex: 'file_late',key: 'file_late', title: 'سند لایحه تاخیرات',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
   // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
   // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
   // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   // { dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
   // { dataIndex: 'status',key: 'status', title: 'وضعیت' }, 
   
   ];


export const storeIndex = "extension";
export const pageHeder = 'تمدید';

export const emptyItem = { contract_id : ''  ,no_id : '' ,letter_no : '' ,letter_date : '' ,total_duration : '' ,duration : '' ,end_date : '' ,end_date_calc : '',Announcement_date : '' ,allow_late : '' ,file_signification : '' ,file_late : ''  };
