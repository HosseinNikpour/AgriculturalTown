import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
  { dataIndex: 'id',key: 'id', title: 'شناسه ' },
  { dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' }, 
    { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان' },
    //{ dataIndex: 'contractor_date',key: 'contractor_date', title: 'تاریخ درخواست پیمانکار' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
    //{ dataIndex: 'consultant_date',key: 'consultant_date', title: 'تاریخ درخواست مشاور' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   // { dataIndex: 'branch_date',key: 'branch_date', title: 'تاریخ درخواست مدیر شعبه' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   // { dataIndex: 'manager_date',key: 'manager_date', title: 'تاریخ درخواست مدیر طرح' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
    { dataIndex: 'with_defect',key: 'with_defect', title: 'تحویل با نقص' , render: function (text) { return text ? 'بلی' : 'خیر' } },
    { dataIndex: 'commision_date',key: 'commision_date', title: 'تاریخ تشکیل کمیسیون' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   // { dataIndex: 'remove_defect_date',key: 'remove_defect_date', title: 'آخرین مهلت تعیین شده برای رفع نقص' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
   // { dataIndex: 'file_defect',key: 'file_defect', title: 'لیست نواقص',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
   { dataIndex: 'file_record',key: 'file_record', title: 'سند صورتجلسه',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
    //{ dataIndex: 'file_signification',key: 'file_signification', title: 'سند ابلاغ صورتجلسه',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
   //{ dataIndex: ' file_elimination_defects',key: ' file_elimination_defects', title: 'صورت جلسه رفع نقص',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
  //{ dataIndex: 'elimination_defects_date',key: 'elimination_defects_date', title: 'تاریخ رفع نقص' , render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
  //  { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
   // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
   // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return text?text.format('jYYYY/jMM/jDD'):'' }}, 
   // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return text?text.format('jYYYY/jMM/jDD'):'' }},
    // { dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' },
    // { dataIndex: 'status',key: 'status', title: 'وضعیت' }, 
   ];

export const storeIndex = "tempDelivery";
export const pageHeder = 'تحویل موقت';

export const emptyItem = { contractor_date : '' ,consultant_date : '' ,branch_date : '' ,manager_date : '' ,with_defect : '' ,commision_date : '' ,remove_defect_date : '' ,file_defect : '' ,file_record : '' ,file_signification : '' ,contract_id : '' ,project_id : ''   };
