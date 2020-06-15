import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
 { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان ' },
 { dataIndex: 'status',key: 'status', title: 'چرخه پیمان' }, 
 { dataIndex: 'date',key: 'date', title: 'تاریخ', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 //{ dataIndex: 'period',key: 'period', title: 'دوره' }, 
 { dataIndex: 'file_record',key: 'file_record', title: 'بارگذاری صورتجلسه',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''}  },
 { dataIndex: 'signification_date',key: 'signification_date', title: 'تاریخ ابلاغ ', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//  { dataIndex: 'description',key: 'description', title: 'توضیحات' },
/* { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
 { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
 { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
 { dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
 { dataIndex: 'status',key: 'status', title: 'وضعیت' }*/
   ];

export const storeIndex = "contractCycle";
export const pageHeder = 'چرخه پیمان';

export const emptyItem = { contract_id : '' ,status_id : '' ,date : ''  ,file_record : '' ,signification_date : '' ,description : ''};//,period_id : ''


